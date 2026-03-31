import { useState } from "react";
import { motion } from "framer-motion";
import { format, isPast, isToday } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar, Edit2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Tables } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

type Todo = Tables<"todos">;

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (data: Partial<Todo> & { id: string }) => void;
}

const priorityConfig = {
  low: { label: "Low", className: "bg-priority-low/15 text-priority-low border-priority-low/30" },
  medium: { label: "Med", className: "bg-priority-medium/15 text-priority-medium border-priority-medium/30" },
  high: { label: "High", className: "bg-priority-high/15 text-priority-high border-priority-high/30" },
};

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const dueDate = todo.due_date ? new Date(todo.due_date) : null;
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && !todo.completed;
  const isDueToday = dueDate && isToday(dueDate);

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      onUpdate({ id: todo.id, title: editTitle.trim() });
    }
    setEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group glass rounded-xl p-4 transition-all hover:shadow-xl",
        todo.completed && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={(checked) => onToggle(todo.id, !!checked)}
          className="mt-1 h-5 w-5 rounded-md border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex gap-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") setEditing(false);
                }}
                autoFocus
                className="h-8"
              />
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveEdit}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditing(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <p
              className={cn(
                "font-medium text-card-foreground leading-tight",
                todo.completed && "line-through text-muted-foreground"
              )}
            >
              {todo.title}
            </p>
          )}
          {todo.description && !editing && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {todo.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="outline" className={cn("text-xs", priorityConfig[todo.priority].className)}>
              {priorityConfig[todo.priority].label}
            </Badge>
            {todo.category && (
              <Badge variant="secondary" className="text-xs">
                {todo.category}
              </Badge>
            )}
            {dueDate && (
              <span
                className={cn(
                  "flex items-center gap-1 text-xs text-muted-foreground",
                  isOverdue && "text-destructive font-medium",
                  isDueToday && "text-priority-medium font-medium"
                )}
              >
                <Calendar className="h-3 w-3" />
                {isOverdue ? "Overdue: " : isDueToday ? "Today" : ""}
                {!isDueToday && format(dueDate, "MMM d")}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!editing && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setEditTitle(todo.title);
                setEditing(true);
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(todo.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
