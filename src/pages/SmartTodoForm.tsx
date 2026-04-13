import * as React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSmartTodos } from "@/hooks/useSmartTodos";

export default function SmartTodoForm() {
  const navigate = useNavigate();
  const { addTodo } = useSmartTodos();

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = title.trim();
    if (!trimmed) {
      setError("Title is required");
      return;
    }

    addTodo({ title: trimmed, description });
    navigate("/smart-todos");
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Todo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="e.g. Prepare quarterly report"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? "title-error" : undefined}
              />
              {error ? (
                <p id="title-error" className="text-xs text-red-600">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (optional)
              </label>
              <Textarea
                id="description"
                placeholder="Add more details to your task"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate("/smart-todos")}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
