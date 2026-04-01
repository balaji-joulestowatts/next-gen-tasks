import { useState } from "react";
import { motion } from "framer-motion";
import { format, isPast, isToday } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar, Edit2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Tables } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

type Todo = Tables<"todos">;

function parseDescription(description: string | null): { summary: string; notes: string } {
  if (!description) return { summary: "", notes: "" };
  const text = description.trim();
  if (!text) return { summary: "", notes: "" };

  if (!text.startsWith("SUMMARY:")) {
    return { summary: "", notes: text };
  }

  const lines = text.split("\n");
  const summary = (lines[0] ?? "").replace(/^SUMMARY:\s*/i, "").trim();
  const notesIdx = lines.findIndex((l) => /^NOTES:\s*/i.test(l));
  if (notesIdx === -1) return { summary, notes: "" };

  const firstNotes = (lines[notesIdx] ?? "").replace(/^NOTES:\s*/i, "");
  const rest = lines.slice(notesIdx + 1).join("\n");
  const notes = [firstNotes, rest].join("\n").trim();
  return { summary, notes };
}

function composeDescription(summary: string, notes: string): string | null {
  const s = summary.trim();
  const n = notes.trim();
  if (!s && !n) return null;
  if (s && !n) return `SUMMARY: ${s}`;
  if (!s && n) return n;
  return `SUMMARY: ${s}\nNOTES: ${n}`;
}

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
  const initial = parseDescription(todo.description);
  const [editSummary, setEditSummary] = useState(initial.summary);
  const [editNotes, setEditNotes] = useState(initial.notes);

  const dueDate = todo.due_date ? new Date(todo.due_date) : null;
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && !todo.completed;
  const isDueToday = dueDate && isToday(dueDate);

  const handleSaveEdit = () => {
    const nextTitle = editTitle.trim();
    if (!nextTitle) return;

    const { summary: prevSummary, notes: prevNotesRaw } = parseDescription(todo.description);
    const nextSummary = editSummary.trim();
    const nextNotes = editNotes.trim();
    const prevNotes = prevNotesRaw.trim();

    const updates: Partial<Todo> & { id: string } = { id: todo.id };
    if (nextTitle !== todo.title) updates.title = nextTitle;

    const nextDesc = composeDescription(nextSummary, nextNotes);
    const prevDesc = composeDescription(prevSummary, prevNotes);
    if ((nextDesc ?? null) !== (prevDesc ?? null)) updates.description = nextDesc;

    if (Object.keys(updates).length > 1) onUpdate(updates);
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditTitle(todo.title);
    const cur = parseDescription(todo.description);
    setEditSummary(cur.summary);
    setEditNotes(cur.notes);
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
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit();
                    if (e.key === "Escape") cancelEdit();
                  }}
                  autoFocus
                  className="h-8"
                />
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveEdit}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={editSummary}
                onChange={(e) => setEditSummary(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") cancelEdit();
                }}
                placeholder="Summary (optional)"
                className="h-8 text-sm"
              />
              <Textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") cancelEdit();
                }}
                placeholder="Notes (optional)"
                rows={2}
                className="text-sm resize-none"
              />
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3">
              <p
                className={cn(
                  "font-medium text-card-foreground leading-tight min-w-0",
                  todo.completed && "line-through text-muted-foreground"
                )}
              >
                {todo.title}
              </p>
              {(() => {
                const { summary } = parseDescription(todo.description);
                if (!summary) return null;
                return (
                  <span className="hidden sm:block w-44 text-[11px] text-muted-foreground truncate text-right">
                    {summary}
                  </span>
                );
              })()}
            </div>
          )}
          {!editing && (() => {
            const { notes } = parseDescription(todo.description);
            if (!notes) return null;
            return (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {notes}
              </p>
            );
          })()}
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
                const cur = parseDescription(todo.description);
                setEditSummary(cur.summary);
                setEditNotes(cur.notes);
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
