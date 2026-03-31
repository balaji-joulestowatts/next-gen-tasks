import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ListFilter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FilterStatus = "all" | "active" | "completed";
export type FilterPriority = "all" | "low" | "medium" | "high";
export type SortBy = "newest" | "oldest" | "priority" | "due_date";

interface TodoFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: FilterStatus;
  onStatusChange: (v: FilterStatus) => void;
  priority: FilterPriority;
  onPriorityChange: (v: FilterPriority) => void;
  sortBy: SortBy;
  onSortChange: (v: SortBy) => void;
}

export function TodoFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sortBy,
  onSortChange,
}: TodoFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex gap-2">
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(["all", "active", "completed"] as FilterStatus[]).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={status === s ? "default" : "ghost"}
              className="rounded-none text-xs capitalize"
              onClick={() => onStatusChange(s)}
            >
              {s}
            </Button>
          ))}
        </div>
        <Select value={priority} onValueChange={(v) => onPriorityChange(v as FilterPriority)}>
          <SelectTrigger className="w-[110px]">
            <ListFilter className="h-4 w-4 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="high">🔴 High</SelectItem>
            <SelectItem value="medium">🟡 Medium</SelectItem>
            <SelectItem value="low">🟢 Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortBy)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="due_date">Due Date</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
