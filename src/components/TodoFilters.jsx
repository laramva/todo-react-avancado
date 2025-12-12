import React from "react";
import { cn } from "../utils/cn.js";

export default function TodoFilters({ value, onChange, counts, icons }) {
  const items = [
    { k: "all", label: "Todas", sub: "tudo junto", icon: icons?.all },
    { k: "active", label: "Ativas", sub: "o que está vivo", icon: icons?.active },
    { k: "done", label: "Concluídas", sub: "o que foi cumprido", icon: icons?.done },
    { k: "discarded", label: "Cemitério", sub: "o que foi sacrificado", icon: icons?.discarded },
  ];

  return (
    <div className="mt-7 grid gap-3 sm:grid-cols-2">
      {items.map((it) => (
        <button
          key={it.k}
          onClick={() => onChange(it.k)}
          className={cn(
            "rounded-3xl bg-white/6 ring-1 ring-white/12 p-4 text-left transition",
            value === it.k && "bg-white/12 ring-white/25",
            it.k === "discarded" && "sm:col-span-2"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/7 ring-1 ring-white/12">
                {it.icon ? (
                  <img src={it.icon} alt={it.label} className="h-12 w-12 opacity-85" />
                ) : (
                  <span className="text-[#F4F3FF]/80 text-[14px]">•</span>
                )}
              </div>

              <div>
                <div className="font-ui text-[16px] font-semibold text-[#F4F3FF]/92">
                  {it.label}
                </div>
                <div className="font-body text-[13px] text-[#F4F3FF]/65">
                  {it.sub}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/6 px-3 py-2 ring-1 ring-white/12 font-body text-[12px] text-[#F4F3FF]/72">
              {String(counts?.[it.k] ?? 0)}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
