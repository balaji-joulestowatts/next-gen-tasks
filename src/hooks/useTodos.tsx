import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Todo = Tables<"todos">;
type TodoInsert = {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  due_date?: string | null;
  category?: string | null;
};

export function useTodos(userId: string | undefined) {
  const queryClient = useQueryClient();
  const todosQueryKey = ["todos", userId] as const;

  const todosQuery = useQuery({
    queryKey: todosQueryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Todo[];
    },
    enabled: !!userId,
  });

  const addTodo = useMutation({
    mutationFn: async (todo: TodoInsert) => {
      const { data, error } = await supabase
        .from("todos")
        .insert({ ...todo, user_id: userId! })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todosQueryKey }),
  });

  const updateTodo = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Todo> & { id: string }) => {
      const { data, error } = await supabase
        .from("todos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todosQueryKey }),
  });

  const deleteTodo = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todosQueryKey }),
  });

  const toggleTodo = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase
        .from("todos")
        .update({ completed })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todosQueryKey }),
  });

  const markAllCompleted = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("todos")
        .update({ completed: true })
        .eq("user_id", userId!)
        .eq("completed", false);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todosQueryKey }),
  });

  const clearCompleted = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("user_id", userId!)
        .eq("completed", true);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todosQueryKey }),
  });

  return {
    todos: todosQuery.data ?? [],
    isLoading: todosQuery.isLoading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    markAllCompleted,
    clearCompleted,
  };
}
