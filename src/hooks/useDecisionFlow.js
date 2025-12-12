import { useState } from "react";

export function useDecisionFlow() {
  const [step, setStep] = useState("idle");
  // idle | drafting | sacrificing | confirming

  return {
    step,
    startDraft: () => setStep("drafting"),
    startSacrifice: () => setStep("sacrificing"),
    confirm: () => setStep("confirming"),
    reset: () => setStep("idle"),
  };
}
