import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

interface AddTodoDialogProps {
  onAdd: (todo: {
    title: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    due_date?: string | null;
    category?: string | null;
  }) => void;
  loading?: boolean;
}

export function AddTodoDialog({ onAdd, loading }: AddTodoDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");

  const composeDescription = (taskSummary: string, taskNotes: string) => {
    const s = taskSummary.trim();
    const n = taskNotes.trim();
    if (!s && !n) return undefined;
    if (s && !n) return `SUMMARY: ${s}`;
    if (!s && n) return n;
    return `SUMMARY: ${s}\nNOTES: ${n}`;
  };

  const isPriorityValue = (value: string): value is "low" | "medium" | "high" => {
    return value === "low" || value === "medium" || value === "high";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      description: composeDescription(summary, notes),
      priority,
      due_date: dueDate || null,
      category: category.trim() || null,
    });
    setTitle("");
    setSummary("");
    setNotes("");
    setPriority("medium");
    setDueDate("");
    setCategory("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 shadow-lg shadow-primary/25">
          <Plus className="h-5 w-5" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="glass sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Input
              id="summary"
              placeholder="Short summary (optional)"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="More details (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) => {
                  if (isPriorityValue(value)) {
                    setPriority(value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="high">🔴 High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="due">Due Date</Label>
              <Input
                id="due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="e.g. Work, Personal, Shopping"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
