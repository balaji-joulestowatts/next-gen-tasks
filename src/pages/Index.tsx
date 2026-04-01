import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useTodos } from "@/hooks/useTodos";
import { TodoItem } from "@/components/TodoItem";
import { AddTodoDialog } from "@/components/AddTodoDialog";
import { TodoFilters, FilterStatus, FilterPriority, SortBy } from "@/components/TodoFilters";
import { TodoStats } from "@/components/TodoStats";
// import { MediaToolsCard } from "@/components/MediaToolsCard";
import { Button } from "@/components/ui/button";
import { CheckSquare, LogOut } from "lucide-react";
import { toast } from "sonner";

const priorityOrder = { high: 0, medium: 1, low: 2 };

export default function Index() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { todos, isLoading, addTodo, updateTodo, deleteTodo, toggleTodo } = useTodos(user?.id);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FilterStatus>("all");
  const [priority, setPriority] = useState<FilterPriority>("all");
  const [sortBy, setSortBy] = useState<SortBy>("newest");

  const filteredTodos = useMemo(() => {
    let result = [...todos];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q)
      );
    }

    if (status === "active") result = result.filter((t) => !t.completed);
    if (status === "completed") result = result.filter((t) => t.completed);
    if (priority !== "all") result = result.filter((t) => t.priority === priority);

    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "priority":
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case "due_date":
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return result;
  }, [todos, search, status, priority, sortBy]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // If not logged in, redirect handled by App.tsx
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold font-display tracking-tight text-foreground">
              TaskFlow
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.email}
            </span>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Stats */}
        <TodoStats todos={todos} />

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <AddTodoDialog
            onAdd={(todo) => {
              addTodo.mutate(todo, {
                onSuccess: () => toast.success("Task added!"),
                onError: (e) => toast.error(e.message),
              });
            }}
            loading={addTodo.isPending}
          />
        </div>

        <TodoFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          priority={priority}
          onPriorityChange={setPriority}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Camera/Mic tools disabled */}
        {/* <MediaToolsCard /> */}

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-xl p-4 h-20 animate-pulse" />
            ))}
          </div>
        ) : filteredTodos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-4xl mb-3">✨</p>
            <p className="text-lg font-display font-medium text-foreground">
              {todos.length === 0 ? "No tasks yet" : "No matching tasks"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {todos.length === 0
                ? "Add your first task to get started"
                : "Try adjusting your filters"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={(id, completed) =>
                    toggleTodo.mutate({ id, completed })
                  }
                  onDelete={(id) =>
                    deleteTodo.mutate(id, {
                      onSuccess: () => toast.success("Task deleted"),
                    })
                  }
                  onUpdate={(data) =>
                    updateTodo.mutate(data, {
                      onSuccess: () => toast.success("Task updated"),
                    })
                  }
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
