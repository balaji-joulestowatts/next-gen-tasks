import * as React from "react";

export type SmartTodo = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: number;
};

const STORAGE_KEY = "smart_todos";

function loadFromStorage(): SmartTodo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as SmartTodo[];
    }
    return [];
  } catch (_e) {
    return [];
  }
}

function saveToStorage(todos: SmartTodo[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (_e) {
    // ignore
  }
}

export function useSmartTodos() {
  const [todos, setTodos] = React.useState<SmartTodo[]>(() => loadFromStorage());

  React.useEffect(() => {
    saveToStorage(todos);
  }, [todos]);

  const addTodo = React.useCallback((data: { title: string; description?: string }) => {
    const id = (globalThis.crypto && "randomUUID" in globalThis.crypto
      ? (globalThis.crypto as Crypto).randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

    const newTodo: SmartTodo = {
      id,
      title: data.title.trim(),
      description: data.description?.trim() || "",
      completed: false,
      createdAt: Date.now(),
    };

    setTodos((prev) => [newTodo, ...prev]);
    return newTodo;
  }, []);

  const toggleTodo = React.useCallback((id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const removeTodo = React.useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearCompleted = React.useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  return { todos, addTodo, toggleTodo, removeTodo, clearCompleted };
}
