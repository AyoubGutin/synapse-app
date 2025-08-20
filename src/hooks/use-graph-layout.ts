/**
 * @file A custom hook to position nodes and edges.
 */

import { useMemo } from 'react';
import { MarkerType, Position, type Edge, type Node } from 'reactflow';
import dagre from 'dagre';
import type { Task } from '@/types/taskTypes';
import type { Objective } from '@/types/objectivesTypes';

// -- type definition --
interface CustomNodeData {
  label: string;
  parentId?: string;
  objectiveId?: string;
  status?: Task['status'];
  priority?: Task['priority'];
}
type AppNode = Node<CustomNodeData>;

/**
 * Layouts the nodes and edges using the Dagre library for hierarchial grouping
 * @param nodes - The nodes to layout
 * @param edges - The edges connecting the nodes
 * @returns The layouted nodes and edges in an array with calculated positions
 */
const getLayoutedElements = (
  nodes: AppNode[],
  edges: Edge[]
): { nodes: AppNode[]; edges: Edge[] } => {
  // initialise a directed graph for dagre
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // define initial dimensions of nodes for layout calculation
  const nodeWidth = 180;
  const nodeHeight = 40;

  // set graph layout options (Tb = top to bottom, nodesep and ranksep control spacing)
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 50, ranksep: 100 });

  // add nodes to dagre graph, provide the id and dimensions
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // add edges to dagre graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // run the layout algorithm, and calculate optimal x and y coords
  dagre.layout(dagreGraph);

  // apply the calculated positions back to React flow nodes
  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id); // get the new positional node

    // set source/target handle positions for edge (top, bottom)
    node.targetPosition = Position.Top;
    node.sourcePosition = Position.Bottom;

    // Dagre's coordinate system has the origin (0, 0) at the top left,
    // but React flow is top-left so offset coords
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

/**
 * Custom React hook that transforms tasks and objectives into a layout-ready graph
 * @param tasks - Array of tasks from global store
 * @param objectives - Array of objectives from global store
 * @returns - The nodes and edges for React Flow
 */
export const useGraphLayout = (tasks: Task[], objectives: Objective[]) => {
  // useMemo ensures ransformation only runs when the tasks or objectives change.
  return useMemo(() => {
    // Convert objectives into React Flow nodes.
    const objectiveNodes: AppNode[] = objectives.map((obj) => ({
      id: obj.id,
      type: 'objective',
      data: { label: `🎯 ${obj.title}` },
      position: { x: 0, y: 0 }, // Initial position, this will be overwritten by Dagre.
    }));

    // Convert tasks into React Flow nodes.
    const taskNodes: AppNode[] = tasks.map((task) => ({
      id: task.id,
      type: 'task',
      data: {
        label: task.title,
        parentId: task.parentId,
        objectiveId: task.objectiveId,
        status: task.status,
        priority: task.priority,
      },
      position: { x: 0, y: 0 }, // Initial position, this will be overwritten by Dagre.
    }));

    const allNodes = [...objectiveNodes, ...taskNodes]; // get array of objective and task nodes together

    // Create edges to connect the nodes based on parentId and objectiveId.
    const edges: Edge[] = tasks
      .filter((task) => task.parentId || task.objectiveId)
      .map((task) => ({
        id: `e-${task.parentId || task.objectiveId}-${task.id}`,
        source: (task.parentId || task.objectiveId)!,
        target: task.id,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed }, // arrow head for direction
        style: {
          stroke: task.parentId ? '#9ca3af' : '#d1d5db',
          strokeDasharray: task.parentId ? '0' : '5,5',
        },
      }));

    // pass the prepared nodes and edges to the layout function.
    return getLayoutedElements(allNodes, edges);
  }, [tasks, objectives]);
};
