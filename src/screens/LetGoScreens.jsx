import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useTodos } from "../context/TodoContext.jsx";

import neutralRobot from "../assets/icons/neutral.png";
import saudacaoRobot from "../assets/icons/saudacao.png";
import friendlyRobot from "../assets/icons/friendly.png";

import adicionarIcon from "../assets/icons/adicionar.png";
import concluirIcon from "../assets/icons/concluir.png";
import excluirIcon from "../assets/icons/excluir.png";
import cemiterioIcon from "../assets/icons/cemiterio.png";
import ritualIcon from "../assets/icons/ritual.png";
import adicionarTopIcon from "../assets/icons/adicionar.png";

import roboCriar from "../assets/icons/robo-criar.png";
import roboEsperar from "../assets/icons/esperar.png";
import roboComecou from "../assets/icons/comecou.png";
import roboDigitando from "../assets/icons/digitando.png";
import roboTextoLongo from "../assets/icons/textolongo.png";
import roboCampoVazio from "../assets/icons/campovazio.png";
import roboPronto from "../assets/icons/pronto.png";
import sair from "../assets/icons/sair.png";
import alertaIcon from "../assets/icons/alerta.png";
import coracaoIcon from "../assets/icons/coracao.png";

import TodoFilters from "../components/TodoFilters.jsx";
import TodoList from "../components/TodoList.jsx";
import TodoForm from "../components/TodoForm.jsx";

/** ✅ EXPORTA cn pra não dar erro em imports antigos (TodoItem/TodoFilters) */
export function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

/* ---------- UI helpers ---------- */

function IconBadge({ kind = "warning" }) {
  return (
    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/6 ring-1 ring-white/12">
      <span className="font-heading text-[12px] font-semibold text-[#F4F3FF]/90">
        {kind === "warning" ? "!" : "•"}
      </span>
    </div>
  );
}

function Pill({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/6 px-4 py-2 ring-1 ring-white/12">
      <div className="font-heading text-[11px] uppercase tracking-[0.12em] text-[#F4F3FF]/55">
        {label}
      </div>
      <div className="mt-0.5 font-ui text-[14px] font-semibold text-[#F4F3FF]/92">
        {value}
      </div>
    </div>
  );
}

function SoftButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group inline-flex items-center gap-2 rounded-2xl bg-white/6 px-4 py-3 ring-1 ring-white/12",
        "hover:bg-white/9 hover:ring-white/18 active:scale-[0.99] transition",
        className
      )}
    >
      {children}
    </button>
  );
}

function PrimaryButton({ children, onClick, className = "", disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-ui text-[14px] font-semibold text-[#0B0614]",
        "bg-gradient-to-r from-[#8B5CF6] via-[#22D3EE] to-[#F472B6]",
        "shadow-[0_18px_60px_rgba(139,92,246,0.25)]",
        "hover:brightness-110 active:scale-[0.99] transition",
        disabled && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3",
        "bg-white/6 ring-1 ring-white/12 hover:bg-white/9 hover:ring-white/18",
        "active:scale-[0.99] transition text-[#F4F3FF]/88",
        className
      )}
    >
      {children}
    </button>
  );
}

/* ---------- Modal shell ---------- */

function ModalShell({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-[980px] overflow-hidden rounded-[34px] bg-[#0B0614]/85 ring-1 ring-white/12 shadow-[0_50px_180px_rgba(0,0,0,0.65)]">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------- Todo card ---------- */

const TodoCard = React.memo(function TodoCard({ todo, onToggle, onDiscard, variant = "active" }) {
  const isDiscarded = variant === "discarded";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-white/6 ring-1 ring-white/12 p-4 sm:p-5",
        isDiscarded && "opacity-80"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/12 via-transparent to-[#22D3EE]/10" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div
            className={cn(
              "font-ui text-[15px] font-semibold text-[#F4F3FF]/92",
              variant === "done" && "line-through text-[#F4F3FF]/70",
              variant === "discarded" && "line-through text-[#F4F3FF]/60"
            )}
          >
            {todo.title}
          </div>

          {todo.note ? (
            <div className="mt-1 font-body text-[13px] leading-relaxed text-[#F4F3FF]/65">
              {todo.note}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onToggle(todo.id)}
            title="Concluir"
            className="grid h-14 w-14 place-items-center rounded-2xl bg-white/6 ring-1 ring-white/12 hover:bg-white/12 transition"
          >
            <img src={concluirIcon} alt="Concluir" className="h-14 w-14 opacity-90" />
          </button>

          <button
            type="button"
            onClick={() => onDiscard(todo.id)}
            title="Enviar ao cemitério"
            className="grid h-14 w-14 place-items-center rounded-2xl bg-white/6 ring-1 ring-white/12 hover:bg-white/12 transition"
          >
            <img src={cemiterioIcon} alt="Cemitério" className="h-14 w-14 opacity-85" />
          </button>
        </div>
      </div>
    </div>
  );
});

/* ---------- Onboarding modal ---------- */

function OnboardingModal({ open, onClose, onGoRitual }) {
  return (
    <ModalShell open={open} onClose={onClose}>
      <div className="relative">
        <button
          onClick={onClose}
          title="Sair"
          aria-label="Sair"
          className="absolute top-6 right-6 z-30 rounded-2xl bg-white/0 ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/5 transition"
        >
          <img
            src={sair}
            alt="Sair"
            className="h-10 w-10 opacity-65 hover:opacity-100 transition drop-shadow-[0_10px_32px_rgba(139,92,246,0.22)]"
          />
        </button>

        <div className="relative grid gap-0 md:grid-cols-[1fr_1.05fr]">
          <div className="relative overflow-hidden bg-white/4 p-6 sm:p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/18 via-[#22D3EE]/10 to-[#F472B6]/14" />
            <div className="relative">
              <div className="font-heading text-[12px] uppercase tracking-[0.14em] text-[#F4F3FF]/55">
                Tutorial rápido
              </div>

              <div className="mt-3 font-heading text-[30px] font-semibold text-[#F4F3FF]/92">
                Ritual de escolha
              </div>

              <div className="mt-2 font-body text-[14px] leading-relaxed text-[#F4F3FF]/70">
                LetGo não é “lista de tarefas”. É uma regra:
                <span className="text-[#F472B6]/95"> se algo entra, algo sai</span>.
                Você decide com intenção.
              </div>

              <div className="mt-7 grid gap-3">
                <div className="rounded-3xl bg-white/6 p-4 ring-1 ring-white/12">
                  <div className="font-ui text-[14px] font-semibold text-[#F4F3FF]/92">
                    Crie uma tarefa
                  </div>
                  <div className="mt-1 text-[#F4F3FF]/70 text-[13px]">
                    Se não houver tarefa ativa, ela entra direto no Altar.
                  </div>
                </div>

                <div className="rounded-3xl bg-white/6 p-4 ring-1 ring-white/12">
                  <div className="font-ui text-[14px] font-semibold text-[#F4F3FF]/92">
                    Se já existir uma ativa…
                  </div>
                  <div className="mt-1 text-[#F4F3FF]/70 text-[13px]">
                    Criar outra exige escolher um sacrifício.
                  </div>
                </div>

                <div className="rounded-3xl bg-white/6 p-4 ring-1 ring-white/12">
                  <div className="font-ui text-[14px] font-semibold text-[#F4F3FF]/92">
                    O Cemitério é irreversível
                  </div>
                  <div className="mt-1 text-[#F4F3FF]/70 text-[13px]">
                    O que foi sacrificado não volta.
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton onClick={onGoRitual} className="sm:flex-1">
                  Começar o ritual
                </PrimaryButton>

                <GhostButton onClick={onClose} className="sm:flex-1">
                  Ok, entendi (por enquanto)
                </GhostButton>
              </div>
            </div>
          </div>

          <div className="relative p-6 sm:p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B0614]/0 via-[#0B0614]/45 to-[#0B0614]/70" />
            <div className="relative">
              <div className="font-heading text-[26px] font-semibold text-[#F4F3FF]/92">
                “Promete que é por um bom motivo?”
              </div>

              <div className="mt-2 text-[14px] leading-relaxed text-[#F4F3FF]/70">
                Menos tarefas ativas = mais foco. LetGo funciona melhor quando dói um pouquinho.
              </div>

              <div className="mt-8 relative overflow-hidden rounded-[34px] bg-white/6 ring-1 ring-white/12 p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/18 via-[#22D3EE]/10 to-[#F472B6]/14" />
                <img
                  src={neutralRobot}
                  alt="LetGo robot"
                  className="relative mx-auto w-[240px] opacity-95 drop-shadow-[0_60px_140px_rgba(139,92,246,0.28)]"
                />
                <div className="relative mt-4 text-center text-[13px] text-[#F4F3FF]/70">
                  Dica: quando abrir o sacrifício, escolha com calma. Você está treinando prioridade.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

/* ---------- Animated robot ---------- */

function preloadImages(srcs = []) {
  srcs.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

function AnimatedCreateRobot({ open, focused, typing, title, note, className = "" }) {
  const frames = useMemo(
    () => ({
      base: roboCriar,
      esperar: roboEsperar,
      comecou: roboComecou,
      digitando: roboDigitando,
      textolongo: roboTextoLongo,
      campovazio: roboCampoVazio,
      pronto: roboPronto,
    }),
    []
  );

  useEffect(() => {
    if (!open) return;
    preloadImages(Object.values(frames));
  }, [open, frames]);

  const totalLen = (title?.trim()?.length || 0) + (note?.trim()?.length || 0);
  const hasText = totalLen > 0;
  const isLong = totalLen >= 70;

  const nextKey = useMemo(() => {
    if (!open) return "base";
    if (!focused && !hasText) return "esperar";
    if (focused && !hasText) return "campovazio";
    if (typing) return isLong ? "textolongo" : "digitando";
    if (hasText && totalLen < 3) return "comecou";
    if (hasText) return "pronto";
    return "esperar";
  }, [open, focused, hasText, typing, isLong, totalLen]);

  const [currentKey, setCurrentKey] = useState("base");
  const [prevKey, setPrevKey] = useState(null);

  useEffect(() => {
    if (nextKey === currentKey) return;
    setPrevKey(currentKey);
    setCurrentKey(nextKey);
    const t = setTimeout(() => setPrevKey(null), 220);
    return () => clearTimeout(t);
  }, [nextKey, currentKey]);

  const [pulseStart, setPulseStart] = useState(false);
  useEffect(() => {
    if (!open) return;
    if (focused) {
      setPulseStart(true);
      const t = setTimeout(() => setPulseStart(false), 420);
      return () => clearTimeout(t);
    }
  }, [open, focused]);

  const glow = currentKey === "pronto";
  const thinking = currentKey === "textolongo";

  return (
    <div className={cn("relative", className)}>
      <div className={cn("relative w-full select-none pointer-events-none", "animate-[letgoFloat_6s_ease-in-out_infinite]")}>
        {prevKey ? (
          <img
            src={frames[prevKey]}
            alt=""
            className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-200"
          />
        ) : null}

        <img
          src={frames[currentKey]}
          alt="Robô"
          className={cn(
            "relative w-full h-full object-contain",
            "transition-[transform,filter,opacity] duration-200",
            "will-change-transform",
            "animate-[breathe_3.4s_ease-in-out_infinite]",
            pulseStart && "animate-[letgoPop_420ms_ease-out_1]",
            thinking && "animate-[letgoNod_1.6s_ease-in-out_infinite]"
          )}
          style={{
            filter:
              "drop-shadow(0 30px 90px rgba(139,92,246,0.35)) drop-shadow(0 10px 40px rgba(34,211,238,0.18))",
          }}
        />

        {glow ? (
          <div className="absolute inset-0 rounded-[32px] opacity-60 animate-[letgoGlow_1.2s_ease-in-out_infinite] pointer-events-none" />
        ) : null}

        <div className="absolute -bottom-2 left-1/2 h-6 w-[70%] -translate-x-1/2 rounded-full bg-black/25 blur-xl" />
      </div>
    </div>
  );
}

/* ---------- Add modal ---------- */

function AddModal({ open, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [focused, setFocused] = useState(false);
  const [typing, setTyping] = useState(false);

  const typingTimerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setNote("");
    setFocused(false);
    setTyping(false);
  }, [open]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  const markTyping = useCallback(() => {
    setTyping(true);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => setTyping(false), 650);
  }, []);

  return (
    <ModalShell open={open} onClose={onClose}>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/14 via-[#22D3EE]/8 to-[#F472B6]/10" />

        <div className="relative p-6 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0614]/0 via-[#0B0614]/25 to-[#0B0614]/55" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="font-heading text-[26px] font-semibold text-[#F4F3FF]/92">
                  Criar tarefa (ritual)
                </div>
                <div className="mt-1 font-body text-[13px] text-[#F4F3FF]/60">
                  você escolhe o que fica
                </div>
              </div>

              <button
                onClick={onClose}
                className="grid h-11 w-11 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10 hover:bg-white/8 hover:ring-white/15 transition"
                title="Fechar"
              >
                <span className="text-[#F4F3FF]/85">×</span>
              </button>
            </div>

            <div className="relative mt-6 grid gap-6 md:grid-cols-[360px_1fr]">
              <div className="relative flex items-end justify-center">
                <div className="w-[320px]">
                  <AnimatedCreateRobot open={open} focused={focused} typing={typing} title={title} note={note} />
                </div>
              </div>

              <div className="grid gap-4">
                <input
                  value={title}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    markTyping();
                  }}
                  className="w-full rounded-3xl bg-[#0B0614]/45 px-5 py-4 font-ui text-[15px] text-[#F4F3FF]/92 ring-1 ring-white/12 outline-none placeholder:text-[#F4F3FF]/40 focus:ring-white/22 transition"
                  placeholder="nome da tarefa…"
                />

                <textarea
                  value={note}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onChange={(e) => {
                    setNote(e.target.value);
                    markTyping();
                  }}
                  className="min-h-[160px] w-full resize-none rounded-3xl bg-[#0B0614]/45 px-5 py-4 font-body text-[14px] text-[#F4F3FF]/88 ring-1 ring-white/12 outline-none placeholder:text-[#F4F3FF]/40 focus:ring-white/22 transition"
                  placeholder="nota (opcional)…"
                />

                <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <GhostButton onClick={onClose} className="px-6 py-4 text-[#F4F3FF]/90">
                    Cancelar
                  </GhostButton>

                  <PrimaryButton
                    onClick={() => {
                      onCreate({ title, note });
                      onClose();
                    }}
                    disabled={!title.trim()}
                    className="px-7 py-4"
                  >
                    Iniciar
                  </PrimaryButton>
                </div>
              </div>
            </div>
            {/* fim grid */}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

/* ---------- Sacrifice modal ---------- */

function SacrificeModal({ open, onClose, activeTodos, targetId, setTargetId, onConfirm, pendingTitle }) {
  return (
    <ModalShell open={open} onClose={onClose}>
      <div className="relative p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/14 via-[#22D3EE]/8 to-[#F472B6]/10" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="font-heading text-[24px] font-semibold text-[#F4F3FF]/92">
              Escolha um sacrifício
            </div>
            <div className="mt-2 font-body text-[13px] leading-relaxed text-[#F4F3FF]/72">
              Você quer criar{" "}
              <span className="text-[#22D3EE]/95 font-semibold">{pendingTitle || "uma nova tarefa"}</span>
              . Então… alguém precisa ir.
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-2xl bg-white/6 ring-1 ring-white/12 grid place-items-center hover:bg-white/9 transition"
            title="Fechar"
          >
            <span className="text-[#F4F3FF]/85">×</span>
          </button>
        </div>

        <div className="relative mt-6 grid gap-3 md:grid-cols-2">
          {(activeTodos || []).map((t) => {
            const selected = t.id === targetId;
            return (
              <button
                key={t.id}
                onClick={() => setTargetId(t.id)}
                className={cn(
                  "text-left rounded-3xl p-4 ring-1 transition",
                  selected ? "bg-white/12 ring-white/28" : "bg-white/6 ring-white/12 hover:bg-white/9 hover:ring-white/18"
                )}
              >
                <div className="font-ui text-[14px] font-semibold text-[#F4F3FF]/92">{t.title}</div>
                <div className="mt-1 font-body text-[13px] text-[#F4F3FF]/70">
                  {selected ? "Selecionada para ir ao cemitério." : "Clique para sacrificar."}
                </div>
              </button>
            );
          })}
        </div>

        <div className="relative mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <GhostButton onClick={onClose}>Cancelar</GhostButton>
          <PrimaryButton onClick={onConfirm} disabled={!targetId}>
            Confirmar sacrifício
          </PrimaryButton>
        </div>
      </div>
    </ModalShell>
  );
}

/* ---------- Screen ---------- */

export default function LetGoScreens() {
  const {
    state,
    activeTodos,
    doneTodos,
    discardedTodos,
    setFilter,
    requestAdd,
    cancelAdd,
    setSacrificeTarget,
    confirmSacrifice,
    toggleDone,
    discard,
  } = useTodos();

  const [addOpen, setAddOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(() => {
    const seen = localStorage.getItem("letgo:onboarding:seen");
    return !seen;
  });

  const closeOnboarding = useCallback(() => {
    localStorage.setItem("letgo:onboarding:seen", "1");
    setOnboardingOpen(false);
  }, []);

  const reopenOnboarding = useCallback(() => setOnboardingOpen(true), []);

  // ✅ lista robusta (não explode se vier undefined)
  const list = useMemo(() => {
    const act = activeTodos ?? [];
    const done = doneTodos ?? [];
    const disc = discardedTodos ?? [];

    // suporte "all" se existir
    if (state?.filter === "all") return [...act, ...done, ...disc];
    if (state?.filter === "active") return act;
    if (state?.filter === "done") return done;
    if (state?.filter === "discarded") return disc;

    // fallback seguro (evita tela branca)
    return act;
  }, [state?.filter, activeTodos, doneTodos, discardedTodos]);

  const counts = useMemo(() => {
    const act = activeTodos?.length ?? 0;
    const done = doneTodos?.length ?? 0;
    const disc = discardedTodos?.length ?? 0;
    return { all: act + done + disc, active: act, done, discarded: disc };
  }, [activeTodos, doneTodos, discardedTodos]);

  const onCreate = useCallback(({ title, note }) => requestAdd({ title, note }), [requestAdd]);

  const currentTitle = useMemo(() => {
    if (state?.filter === "all") return "Todas";
    if (state?.filter === "active") return "Ativas";
    if (state?.filter === "done") return "Concluídas";
    if (state?.filter === "discarded") return "Cemitério";
    return "Ativas";
  }, [state?.filter]);

  const currentIcon = useMemo(() => {
    if (state?.filter === "done") return concluirIcon;
    if (state?.filter === "discarded") return cemiterioIcon;
    if (state?.filter === "all") return ritualIcon;
    return ritualIcon;
  }, [state?.filter]);

  return (
    <div className="min-h-screen bg-[#0B0614] text-[#F4F3FF]">
      <style>{`
        @keyframes breathe { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-6px) scale(1.01); } }
        @keyframes letgoFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes letgoNod { 0%, 100% { transform: translateY(0) rotate(0deg); } 30% { transform: translateY(-4px) rotate(-1.2deg); } 60% { transform: translateY(2px) rotate(1.0deg); } }
        @keyframes letgoPop { 0% { transform: scale(1); } 60% { transform: scale(1.035); } 100% { transform: scale(1); } }
        @keyframes letgoGlow { 0%, 100% { box-shadow: 0 0 0 rgba(34,211,238,0.0), 0 0 0 rgba(244,114,182,0.0); } 50% { box-shadow: 0 0 44px rgba(34,211,238,0.22), 0 0 58px rgba(244,114,182,0.18); } }
      `}</style>

      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#120A25] via-[#0B0614] to-[#07030D]" />
        <div className="absolute inset-0 opacity-[0.25]">
          <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#8B5CF6]/25 blur-3xl" />
          <div className="absolute -right-52 top-24 h-[560px] w-[560px] rounded-full bg-[#22D3EE]/16 blur-3xl" />
          <div className="absolute left-1/3 top-[65%] h-[520px] w-[520px] rounded-full bg-[#F472B6]/12 blur-3xl" />
        </div>
        <div className="absolute right-10 top-[30%] h-[520px] w-[520px] rounded-full border border-white/7 opacity-20" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-5 pb-16 pt-10 sm:px-8">
        <div className="pointer-events-none absolute left-[-140px] top-[-120px] z-0 w-[680px] max-w-none opacity-[0.34] sm:left-[-160px] sm:top-[-140px] sm:w-[760px] lg:left-[-190px] lg:top-[-160px] lg:w-[860px]">
          <img
            src={saudacaoRobot}
            alt="LetGo robot saudacao"
            className="w-full select-none drop-shadow-[0_60px_200px_rgba(139,92,246,0.30)]"
            style={{ clipPath: "inset(0 0 48% 0 round 40px)" }}
          />
        </div>

        <header className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="font-heading text-[20px] font-semibold text-[#F4F3FF]/92">LetGo</div>
              <div className="font-body text-[13px] text-[#F4F3FF]/65">escolhas irreversíveis</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SoftButton onClick={reopenOnboarding} className="gap-4 px-6 py-4">
              <img
                src={ritualIcon}
                alt="Ritual"
                className="h-12 w-12 drop-shadow-[0_0_18px_rgba(168,85,247,0.55)]"
              />
              <span className="font-ui text-[16px] font-semibold text-[#F4F3FF]/95">Ritual</span>
            </SoftButton>

            <SoftButton onClick={() => setAddOpen(true)} className="gap-4 px-6 py-4">
              <img
                src={adicionarTopIcon}
                alt="Nova"
                className="h-12 w-12 drop-shadow-[0_0_18px_rgba(168,85,247,0.55)]"
              />
              <span className="font-ui text-[16px] font-semibold text-[#F4F3FF]/95">Nova</span>
            </SoftButton>
          </div>
        </header>

        <section className="relative z-10 mt-40 sm:mt-44 lg:mt-36 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative overflow-hidden rounded-[34px] bg-white/6 ring-1 ring-white/12">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/14 via-transparent to-[#22D3EE]/10" />
            <div className="relative p-6 sm:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="font-heading text-[42px] leading-[1.05] font-semibold text-[#F4F3FF]/92">
                    Altar de Prioridades
                  </div>
                  <div className="mt-3 font-body text-[14px] leading-relaxed text-[#F4F3FF]/72">
                    Aqui não existe “depois eu vejo”. Se algo entra, algo sai.{" "}
                    <span className="text-[#F472B6]/95">Alguém precisa ir…</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Pill label="ativas" value={String(activeTodos?.length ?? 0)} />
                  <Pill label="modo" value="irreversível" />
                </div>
              </div>

              {/* ✅ filtros por componente */}
              <TodoFilters
                value={state?.filter === "all" ? "all" : state?.filter || "active"}
                onChange={(k) => setFilter(k)}
                counts={counts}
                icons={{ all: ritualIcon, active: ritualIcon, done: concluirIcon, discarded: cemiterioIcon }}
              />

              <div className="mt-6 rounded-[34px] bg-[#0B0614]/40 p-4 ring-1 ring-white/12">
                <div className="flex items-center gap-2 font-ui text-[14px] font-semibold text-[#F4F3FF]/92">
                  <img src={currentIcon} alt="" className="h-12 w-12 opacity-85" />
                  <span>{currentTitle}</span>
                  <span className="font-body text-[#F4F3FF]/60">— {list.length}</span>
                </div>

                <div className="mt-4 grid gap-3">
                  {list.length === 0 ? (
                    <div className="rounded-3xl bg-white/6 p-5 ring-1 ring-white/12">
                      <div className="font-ui text-[14px] font-semibold text-[#F4F3FF]/88">
                        vazio (por enquanto)
                      </div>
                      <div className="mt-1 font-body text-[13px] text-[#F4F3FF]/70">
                        Crie uma tarefa pra começar. Se já existir uma ativa, você vai precisar escolher um sacrifício.
                      </div>
                    </div>
                  ) : (
                    list.map((t) => (
                      <TodoCard
                        key={t.id}
                        todo={t}
                        variant={t.status}
                        onToggle={toggleDone}
                        onDiscard={discard}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <aside className="relative rounded-[34px] bg-white/6 ring-1 ring-white/12">
            <div className="absolute inset-0 overflow-hidden rounded-[34px]">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/22 via-transparent to-[#22D3EE]/14" />
            </div>

            <div className="pointer-events-none absolute -top-[255px] right-[300px] z-40 w-[260px] sm:w-[290px] lg:w-[320px]">
              <img
                src={friendlyRobot}
                alt="LetGo robot friendly"
                className="w-full select-none drop-shadow-[0_40px_120px_rgba(139,92,246,0.45)]"
              />
              <div className="absolute bottom-[18px] left-1/2 h-6 w-40 -translate-x-1/2 rounded-full bg-black/25 blur-xl" />
            </div>

            <div className="relative p-6 sm:p-8 pt-12">
              <div className="flex items-center justify-between">
                <div className="font-heading text-[22px] font-semibold text-[#F4F3FF]/92">
                  Painel de Decisão
                </div>

                <img
                  src={alertaIcon}
                  alt="Alerta"
                  className="h-14 w-14 opacity-85 drop-shadow-[0_12px_34px_rgba(139,92,246,0.26)]"
                />
              </div>

              <div className="mt-3 font-body text-[13px] leading-relaxed text-[#F4F3FF]/72">
                Regra: se já existe uma tarefa ativa, criar outra exige um sacrifício.
                <span className="ml-1 text-[#22D3EE]/95">Escolha com consciência.</span>
              </div>

              <div className="mt-6 rounded-[34px] bg-white/6 p-5 ring-1 ring-white/12">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/7 ring-1 ring-white/12">
                    <img
                      src={coracaoIcon}
                      alt="Coração"
                      className="h-8 w-8 scale-110 opacity-90 drop-shadow-[0_6px_18px_rgba(244,114,182,0.35)]"
                    />
                  </div>

                  <div>
                    <div className="font-ui text-[16px] font-semibold text-[#F4F3FF]/92">
                      “Promete que é por um bom motivo?”
                    </div>
                    <div className="mt-1 font-body text-[13px] text-[#F4F3FF]/72">
                      Menos tarefas ativas = mais foco. LetGo funciona melhor quando dói um pouquinho.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[34px] bg-gradient-to-r from-[#8B5CF6]/22 via-[#22D3EE]/12 to-[#F472B6]/18 p-5 ring-1 ring-white/12">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-ui text-[16px] font-semibold text-[#F4F3FF]/92">
                      Criar tarefa (ritual)
                    </div>
                    <div className="mt-1 font-body text-[13px] text-[#F4F3FF]/72">
                      você escolhe o que fica
                    </div>
                  </div>

                  <button
                    onClick={() => setAddOpen(true)}
                    className="grid h-14 w-14 place-items-center rounded-2xl bg-white/12 ring-1 ring-white/18 hover:bg-white/16 hover:ring-white/25 transition"
                    title="Criar"
                  >
                    <img
                      src={adicionarIcon}
                      alt="Adicionar"
                      className="h-14 w-14 opacity-90 drop-shadow-[0_10px_28px_rgba(34,211,238,0.18)]"
                    />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <GhostButton onClick={reopenOnboarding} className="w-full">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/7 ring-1 ring-white/12">
                    <img
                      src={ritualIcon}
                      alt="Ritual"
                      className="h-8 w-8 scale-110 opacity-90 drop-shadow-[0_6px_20px_rgba(139,92,246,0.35)]"
                    />
                  </span>
                  Reabrir tutorial
                </GhostButton>
              </div>

              <div className="mt-6 rounded-[34px] bg-white/5 p-6 ring-1 ring-white/12">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { k: "Adicionar", icon: adicionarIcon },
                    { k: "Concluir", icon: concluirIcon },
                    { k: "Excluir", icon: excluirIcon },
                    { k: "Cemitério", icon: cemiterioIcon },
                  ].map((x) => (
                    <button
                      type="button"
                      key={x.k}
                      className="group flex h-[140px] flex-col items-center justify-center gap-4 rounded-3xl bg-white/6 ring-1 ring-white/12 transition hover:bg-white/10 hover:ring-white/20 active:scale-[0.99]"
                    >
                      <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/18 transition group-hover:bg-white/14">
                        <img
                          src={x.icon}
                          alt={x.k}
                          className="h-14 w-14 object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]"
                        />
                      </div>
                      <span className="font-ui text-[14px] font-semibold text-[#F4F3FF]/92">
                        {x.k}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-[34px] bg-white/4 p-5 ring-1 ring-white/12">
                <img
                  src={neutralRobot}
                  alt="LetGo robot"
                  className="mx-auto w-[180px] opacity-90 drop-shadow-[0_40px_120px_rgba(34,211,238,0.16)]"
                />
                <div className="mt-3 text-center font-body text-[12px] text-[#F4F3FF]/65">
                  Se a interface parecer “calma demais”, é porque ainda não sacrificou nada.
                </div>
              </div>
            </div>
          </aside>
        </section>

        <OnboardingModal
          open={onboardingOpen}
          onClose={closeOnboarding}
          onGoRitual={() => {
            closeOnboarding();
            setAddOpen(true);
          }}
        />

        <AddModal open={addOpen} onClose={() => setAddOpen(false)} onCreate={onCreate} />

        <SacrificeModal
          open={state?.sacrificeOpen}
          onClose={() => cancelAdd()}
          activeTodos={activeTodos ?? []}
          targetId={state?.sacrificeTargetId}
          setTargetId={setSacrificeTarget}
          onConfirm={() => confirmSacrifice()}
          pendingTitle={state?.pendingTodo?.title}
        />
      </div>
    </div>
  );
}
