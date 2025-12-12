import React from "react";
import { cn } from "../utils/cn.js";
function TodoItemBase({ todo, onToggle, onDiscard, concluirIcon, cemiterioIcon }) {
  return (
    <div className="relative flex items-center justify-between gap-4 rounded-[26px] bg-white/6 p-4 ring-1 ring-white/12">
      <div className="min-w-0">
        <div className="font-ui text-[16px] font-semibold text-[#F4F3FF]/92 truncate">
          {todo.title}
        </div>
        {todo.note ? (
          <div className="mt-1 font-body text-[13px] text-[#F4F3FF]/65 truncate">
            {todo.note}
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        {/* CONCLUIR */}
        <button
          type="button"
          onClick={() => onToggle(todo.id)}
          title="Concluir"
          className={cn(
            "grid h-14 w-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/14 hover:bg-white/14 hover:ring-white/22 transition"
          )}
        >
          <img
            src={concluirIcon}
            alt="Concluir"
            className="h-14 w-14 opacity-85 drop-shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
          />
        </button>

        {/* CEMITÉRIO */}
        <button
          type="button"
          onClick={() => onDiscard(todo.id)}
          title="Cemitério"
          className={cn(
            "grid h-14 w-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/14 hover:bg-white/14 hover:ring-white/22 transition"
          )}
        >
          <img
            src={cemiterioIcon}
            alt="Cemitério"
            className="h-14 w-14 opacity-85 drop-shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
          />
        </button>
      </div>
    </div>
  );
}

const TodoItem = React.memo(TodoItemBase);
export default TodoItem;
