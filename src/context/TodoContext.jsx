import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

const TodoContext = createContext(null);

const initial = {
  todos: [],
  filter: "active", // active | done | discarded
  pendingTodo: null,
  sacrificeOpen: false,
  sacrificeTargetId: null,
};

function uid() {
  return crypto?.randomUUID?.() ?? String(Date.now() + Math.random());
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, filter: action.filter };

    case "REQUEST_ADD": {
      const title = action.title?.trim();
      if (!title) return state;

      const todo = {
        id: uid(),
        title,
        note: action.note?.trim() ?? "",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const hasActive = state.todos.some((t) => t.status === "active");
      if (hasActive) {
        return {
          ...state,
          pendingTodo: todo,
          sacrificeOpen: true,
          sacrificeTargetId: null,
        };
      }

      return { ...state, todos: [todo, ...state.todos] };
    }

    case "CANCEL_ADD":
      return { ...state, pendingTodo: null, sacrificeOpen: false, sacrificeTargetId: null };

    case "SET_SACRIFICE_TARGET":
      return { ...state, sacrificeTargetId: action.id };

    case "CONFIRM_SACRIFICE": {
      const { pendingTodo, sacrificeTargetId } = state;
      if (!pendingTodo || !sacrificeTargetId) return state;

      const todos = state.todos.map((t) =>
        t.id === sacrificeTargetId
          ? { ...t, status: "discarded", updatedAt: Date.now() }
          : t
      );

      return {
        ...state,
        todos: [pendingTodo, ...todos],
        pendingTodo: null,
        sacrificeOpen: false,
        sacrificeTargetId: null,
      };
    }

    case "TOGGLE_DONE": {
      const todos = state.todos.map((t) =>
        t.id === action.id
          ? {
              ...t,
              status: t.status === "done" ? "active" : "done",
              updatedAt: Date.now(),
            }
          : t
      );
      return { ...state, todos };
    }

    case "DISCARD": {
      const todos = state.todos.map((t) =>
        t.id === action.id ? { ...t, status: "discarded", updatedAt: Date.now() } : t
      );
      return { ...state, todos };
    }

    case "EDIT": {
      const todos = state.todos.map((t) =>
        t.id === action.id ? { ...t, ...action.patch, updatedAt: Date.now() } : t
      );
      return { ...state, todos };
    }

    default:
      return state;
  }
}

export function TodoProvider({ children }) {
  const [persisted, setPersisted] = useLocalStorageState("letgo:v1", initial);
  const [state, dispatch] = useReducer(reducer, persisted);

  useEffect(() => {
    setPersisted(state);
  }, [state, setPersisted]);

  const api = useMemo(() => {
    const activeTodos = state.todos.filter((t) => t.status === "active");
    const doneTodos = state.todos.filter((t) => t.status === "done");
    const discardedTodos = state.todos.filter((t) => t.status === "discarded");

    return {
      state,
      activeTodos,
      doneTodos,
      discardedTodos,

      setFilter: (filter) => dispatch({ type: "SET_FILTER", filter }),

      requestAdd: ({ title, note }) => dispatch({ type: "REQUEST_ADD", title, note }),
      cancelAdd: () => dispatch({ type: "CANCEL_ADD" }),

      setSacrificeTarget: (id) => dispatch({ type: "SET_SACRIFICE_TARGET", id }),
      confirmSacrifice: () => dispatch({ type: "CONFIRM_SACRIFICE" }),

      toggleDone: (id) => dispatch({ type: "TOGGLE_DONE", id }),
      discard: (id) => dispatch({ type: "DISCARD", id }),
      edit: (id, patch) => dispatch({ type: "EDIT", id, patch }),
    };
  }, [state]);

  return <TodoContext.Provider value={api}>{children}</TodoContext.Provider>;
}

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodos must be used inside <TodoProvider>");
  return ctx;
}
