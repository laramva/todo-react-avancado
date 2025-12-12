import React from "react";
import TodoItem from "./TodoItem.jsx";

export default function TodoList({
  list,
  onToggle,
  onDiscard,
  concluirIcon,
  cemiterioIcon,
}) {
  if (!list || list.length === 0) {
    return (
      <div className="rounded-3xl bg-white/6 p-5 ring-1 ring-white/12">
        <div className="font-ui text-[14px] font-semibold text-[#F4F3FF]/88">
          vazio (por enquanto)
        </div>
        <div className="mt-1 font-body text-[13px] text-[#F4F3FF]/70">
          Crie uma tarefa pra começar. Se já existir uma ativa, você vai precisar escolher um sacrifício.
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {list.map((t) => (
        <TodoItem
          key={t.id}
          todo={t}
          onToggle={onToggle}
          onDiscard={onDiscard}
          concluirIcon={concluirIcon}
          cemiterioIcon={cemiterioIcon}
        />
      ))}
    </div>
  );
}
