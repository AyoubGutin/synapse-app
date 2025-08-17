import { useMemo } from 'react';
import { MarkerType } from 'reactflow';

const getLayoutedElements = (nodes, edges) => {
  const nodeWidth = 180;
  const nodeHeight = 40;
  const verticalGap = 100;
  const horizontalGap = 50;
  let totalXOffset = 0;

  const objectiveNodes = nodes.filter((node) => node.type === 'objective');

  objectiveNodes.forEach((objectiveNode) => {
    objectiveNode.position = { x: totalXOffset, y: 0 };

    // Find descendants of objective
    const descendantIds = new Set();
    const tasksForObjective = nodes.filter(
      (n) => n.data.objectiveId === objectiveNode.id
    );
    tasksForObjective.forEach((t) => descendantIds.add(t.id));

    const treeNodes = [objectiveNode, ...tasksForObjective];
    let yLevel = 1;

    // Recursive function to position nodes in a tree
    const positionChildren = (parentId, parentX, level) => {
      const children = treeNodes.filter((n) => n.data.parentId === parentId);
      if (children.length === 0) return;

      const totalWidth =
        children.length * (nodeWidth + horizontalGap) - horizontalGap;
      let currentX = parentX - totalWidth / 2 + nodeWidth / 2;

      children.forEach((child) => {
        child.position = { x: currentX, y: level * verticalGap };
        positionChildren(child.id, currentX, level + 1);
        currentX += nodeWidth + horizontalGap;
      });
    };

    // Position top-level tasks directly under the objective
    const topLevelTasks = tasksForObjective.filter((t) => !t.parentId);
    const totalTopLevelWidth =
      topLevelTasks.length * (nodeWidth + horizontalGap) - horizontalGap;
    let currentX = totalXOffset - totalTopLevelWidth / 2 + nodeWidth / 2;

    topLevelTasks.forEach((task) => {
      task.position = { x: currentX, y: yLevel * verticalGap };
      positionChildren(task.id, currentX, yLevel + 1);
      currentX += nodeWidth + horizontalGap;
    });

    // Update the offset for the next objective tree
    totalXOffset += totalTopLevelWidth + horizontalGap * 2;
  });

  return { nodes, edges };
};

export const useGraphLayout = (tasks, objectives) => {
  return useMemo(() => {
    const nodes = [
      ...objectives.map((obj) => ({
        id: obj.id,
        type: 'objective',
        data: { label: `🎯 ${obj.title}` },
        position: { x: 0, y: 0 },
      })),
      ...tasks.map((task) => ({
        id: task.id,
        type: 'task',
        data: {
          label: task.title,
          parentId: task.parentId,
          objectiveId: task.objectiveId,
          status: task.status,
          priority: task.priority,
        },
        position: { x: 0, y: 0 },
      })),
    ];

    const edges = tasks
      .filter((task) => task.parentId || task.objectiveId)
      .map((task) => ({
        id: `e-${task.parentId || task.objectiveId}-${task.id}`,
        source: task.parentId || task.objectiveId,
        target: task.id,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: {
          stroke: task.parentId ? '#9ca3af' : '#d1d5db',
          strokeDasharray: task.parentId ? '0' : '5,5',
        },
      }));

    return getLayoutedElements(nodes, edges);
  }, [tasks, objectives]);
};
