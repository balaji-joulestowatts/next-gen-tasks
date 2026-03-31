import { motion } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";

type Todo = Tables<"todos">;

export function TodoStats({ todos }: { todos: Todo[] }) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;
  const highPriority = todos.filter((t) => t.priority === "high" && !t.completed).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: "Total", value: total, color: "text-foreground" },
        { label: "Active", value: active, color: "text-primary" },
        { label: "Done", value: completed, color: "text-accent" },
        { label: "Urgent", value: highPriority, color: "text-destructive" },
      ].map((stat) => (
        <motion.div
          key={stat.label}
          className="glass rounded-xl p-4 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <p className={`text-2xl font-bold font-display ${stat.color}`}>{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
        </motion.div>
      ))}
      {total > 0 && (
        <div className="col-span-2 sm:col-span-4">
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-center">
            {progress}% complete
          </p>
        </div>
      )}
    </div>
  );
}
