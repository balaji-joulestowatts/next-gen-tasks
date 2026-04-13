import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useSmartTodos } from "@/hooks/useSmartTodos";

export default function SmartTodos() {
  const navigate = useNavigate();
  const { todos, toggleTodo, removeTodo, clearCompleted } = useSmartTodos();
  const [filter, setFilter] = React.useState<"all" | "active" | "completed">("all");

  const filtered = React.useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((t) => !t.completed);
      case "completed":
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [filter, todos]);

  return (
    <div className="mx-auto w-full max-w-3xl p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Smart Todos</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate("/smart-todos/new")}> 
            <Plus className="h-4 w-4" />
            New Todo
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">Your Todos</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>All</Button>
            <Button variant={filter === "active" ? "default" : "outline"} size="sm" onClick={() => setFilter("active")}>Active</Button>
            <Button variant={filter === "completed" ? "default" : "outline"} size="sm" onClick={() => setFilter("completed")}>Completed</Button>
            <Separator orientation="vertical" className="mx-2 hidden h-6 sm:block" />
            <Button variant="ghost" size="sm" onClick={clearCompleted}>Clear Completed</Button>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No todos yet. Create your first one!</div>
          ) : (
            <ul className="space-y-2">
              {filtered.map((todo) => (
                <li key={todo.id} className="flex items-start justify-between rounded-md border p-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      aria-label={todo.completed ? "Mark as active" : "Mark as completed"}
                    />
                    <div>
                      <div className={`text-sm font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                        {todo.title}
                      </div>
                      {todo.description ? (
                        <p className={`mt-1 text-xs ${todo.completed ? "line-through text-muted-foreground" : "text-muted-foreground"}`}>
                          {todo.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-3">
                    <Button variant="ghost" size="icon" onClick={() => removeTodo(todo.id)} aria-label="Delete todo">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
