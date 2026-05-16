const steps = ["Shipping", "Payment", "Confirmation"] as const;

export type CheckoutStep = (typeof steps)[number];

export function CheckoutStepper({
  currentStep
}: {
  currentStep: CheckoutStep;
}) {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <ol className="flex flex-wrap gap-2" aria-label="Checkout progress">
      {steps.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <li
            key={step}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
              isCurrent
                ? "bg-furni-primary text-white shadow-soft"
                : isComplete
                  ? "bg-furni-primary/15 text-furni-primary"
                  : "bg-white text-furni-muted ring-1 ring-furni-primary/12"
            }`}
            aria-current={isCurrent ? "step" : undefined}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                isCurrent
                  ? "bg-furni-accent text-furni-primary"
                  : isComplete
                    ? "bg-furni-primary text-white"
                    : "bg-furni-surface text-furni-muted"
              }`}
            >
              {isComplete ? "✓" : index + 1}
            </span>
            {step}
          </li>
        );
      })}
    </ol>
  );
}

export { steps as checkoutSteps };
