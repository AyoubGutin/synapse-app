/**
 * @file Renders the filters to be used by TaskList and controls its own state, calling on the callback function when filters change.
 */

// -- Imports --
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TaskStatus, TaskPriority } from '@/types/taskTypes';

// -- Type Definitions --
interface TaskFiltersProps {
  onFiltersChange: (filters: {
    searchTerm: string;
    statusFilter: TaskStatus | 'all';
    priorityFilter: TaskPriority | 'all';
  }) => void;
}

/**
 * React function to provide filters and a search input for the task list.
 * @param onFiltersChange - A callback function to apply the filters, called when filter state change
 */
export function TaskFilters({ onFiltersChange }: TaskFiltersProps) {
  // -- States --
  // default filters are all tasks
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>(
    'all'
  );

  // When filter changes, call the onFiltersChange callback
  useEffect(() => {
    onFiltersChange({ searchTerm, statusFilter, priorityFilter });
  }, [searchTerm, statusFilter, priorityFilter, onFiltersChange]);

  // -- Helper Functions --
  const handleStatusChange = (value: string) => {
    setStatusFilter(value as TaskStatus | 'all');
  };
  const handlePriorityChange = (value: string) => {
    setPriorityFilter(value as TaskPriority | 'all');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="search tasks..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters */}
      <Select value={statusFilter} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">all statuses.</SelectItem>
          <SelectItem value="todo">to do.</SelectItem>
          <SelectItem value="in-progress">in progress.</SelectItem>
          <SelectItem value="completed">completed.</SelectItem>
        </SelectContent>
      </Select>
      <Select value={priorityFilter} onValueChange={handlePriorityChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">all priorities.</SelectItem>
          <SelectItem value="high">high.</SelectItem>
          <SelectItem value="medium">medium.</SelectItem>
          <SelectItem value="low">low.</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
