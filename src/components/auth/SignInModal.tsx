"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Check,
} from "lucide-react";
import { useAuth, SIGNIN_OPEN_EVENT_NAME, type AuthMode } from "@/lib/auth/AuthContext";
import { Input, Label } from "@/components/ui/Input";
import { LogoMark } from "@/components/layout/Logo";
import { EXPERIENCE_LABELS, type ExperienceLevel, type RiskComfort } from "@/lib/auth/types";

const GOALS = [
  "Learn how investing works",
  "Track stocks I care about",
  "Practise with a virtual portfolio",
  "Research before I invest for real",
];

const RISKS: { value: RiskComfort; title: string; sub: string }[] = [
  { value: "low", title: "Play it safe", sub: "Steady, lower-risk names" },
  { value: "medium", title: "Balanced", sub: "A mix of growth and stability" },
  { value: "high", title: "Go for growth", sub: "Comfortable with big swings" },
];

const EXPERIENCE_ORDER: ExperienceLevel[] = ["new", "learning", "confident", "pro"];

export function SignInModal() {
  const { clientId, ready, user, _setCredential, signInPassword, registerPassword, updateProfile } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("signin");
  const [signupStep, setSignupStep] = useState<0 | 1>(0);
  // True while a freshly Google-authenticated user is answering onboarding —
  // keeps the modal open even though `user` is already set.
  const [googleOnboarding, setGoogleOnboarding] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState<ExperienceLevel | null>(null);
  const [goals, setGoals] = useState<string[]>([]);
  const [risk, setRisk] = useState<RiskComfort | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const buttonHostRef = useRef<HTMLDivElement | null>(null);
  const initialisedRef = useRef(false);

  function resetForm() {
    setGoogleOnboarding(false);
    setSignupStep(0);
    setName("");
    setEmail("");
    setPassword("");
    setExperience(null);
    setGoals([]);
    setRisk(null);
    setError(null);
    setBusy(false);
  }

  // Open via global event; honour the requested mode ("signin" | "signup")
  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent<{ mode?: AuthMode }>).detail;
      setMode(detail?.mode ?? "signin");
      resetForm();
      setOpen(true);
    }
    window.addEventListener(SIGNIN_OPEN_EVENT_NAME, onOpen);
    return () => window.removeEventListener(SIGNIN_OPEN_EVENT_NAME, onOpen);
  }, []);

  // Close automatically once signed in — unless we're mid-onboarding for a
  // brand-new Google account.
  useEffect(() => {
    if (user && !googleOnboarding) setOpen(false);
  }, [user, googleOnboarding]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Render the Google button (available in both modes, on the credentials step)
  const showGoogle = clientId && (mode === "signin" || signupStep === 0);
  useEffect(() => {
    if (!open || !ready || !clientId || !buttonHostRef.current || !showGoogle) return;
    if (typeof window === "undefined" || !window.google?.accounts?.id) return;
    if (!initialisedRef.current) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response?.credential) {
            const res = _setCredential(response.credential);
            if (!res.ok) return;
            if (res.hasProfile) {
              router.replace("/dashboard");
            } else {
              // First Google sign-up: collect the onboarding profile so
              // Sense can tailor its answers, then head to the dashboard.
              setGoogleOnboarding(true);
              setMode("signup");
              setSignupStep(1);
              setError(null);
            }
          }
        },
        cancel_on_tap_outside: false,
      });
      initialisedRef.current = true;
    }
    buttonHostRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(buttonHostRef.current, {
      type: "standard",
      theme: "filled_black",
      size: "large",
      text: mode === "signup" ? "signup_with" : "continue_with",
      shape: "pill",
      logo_alignment: "left",
      width: 340,
    });
  }, [open, ready, clientId, _setCredential, mode, signupStep, showGoogle, router]);

  if (!open) return null;

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const result = await signInPassword(email, password);
    setBusy(false);
    if (result.ok) {
      router.replace("/dashboard");
    } else {
      setError(result.error);
      // If no account exists, nudge them straight into sign-up with email kept.
      if (result.noAccount) {
        setMode("signup");
        setSignupStep(0);
        setPassword("");
      }
    }
  }

  function handleCredentialsContinue(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Tell us your name.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setSignupStep(1);
  }

  async function handleCreateAccount() {
    if (!experience) return setError("Pick the option that best describes you.");
    if (!risk) return setError("Choose how you feel about risk.");
    setError(null);

    if (googleOnboarding) {
      // Google already authenticated the user — just attach the profile.
      updateProfile({ experience, goals, risk });
      setGoogleOnboarding(false);
      setOpen(false);
      router.replace("/dashboard");
      return;
    }

    setBusy(true);
    const result = await registerPassword(email, name, password, {
      experience,
      goals,
      risk,
    });
    setBusy(false);
    if (result.ok) router.replace("/dashboard");
    else {
      setError(result.error);
      setSignupStep(0);
    }
  }

  const isSignup = mode === "signup";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-(--color-brand-950)/60 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-(--color-border) bg-(--color-surface) shadow-[0_40px_80px_-30px_rgba(13,31,23,0.4)] animate-fade-up">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full text-(--color-fg-subtle) hover:bg-(--color-surface-2)"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-7 pt-9 pb-7">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <p className="text-[14px] font-semibold tracking-tight text-(--color-fg)">StockSense</p>
          </div>

          {!clientId && !isSignup ? (
            // If Google isn't configured, still allow email/password below,
            // but surface the setup note once.
            <SetupHelp />
          ) : null}

          {isSignup && signupStep === 1 ? (
            <OnboardingStep
              experience={experience}
              setExperience={setExperience}
              goals={goals}
              setGoals={setGoals}
              risk={risk}
              setRisk={setRisk}
              busy={busy}
              error={error}
              backLabel={googleOnboarding ? "Skip for now" : "Back"}
              onBack={() => {
                setError(null);
                if (googleOnboarding) {
                  // Signed in either way — profile can be added later.
                  setGoogleOnboarding(false);
                  setOpen(false);
                  router.replace("/dashboard");
                } else {
                  setSignupStep(0);
                }
              }}
              onSubmit={handleCreateAccount}
            />
          ) : (
            <>
              <h2 className="mt-6 text-[26px] font-semibold tracking-[-0.022em] text-(--color-fg)">
                {isSignup ? "Create your account." : "Welcome back."}
              </h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-(--color-fg-muted)">
                {isSignup
                  ? "Set up a free StockSense account to save your watchlist, portfolio and AI conversations."
                  : "Sign in to pick up your watchlist, portfolio simulator and AI conversations."}
              </p>

              <form onSubmit={isSignup ? handleCredentialsContinue : handleSignIn} className="mt-6 space-y-3.5">
                {isSignup && (
                  <div>
                    <Label htmlFor="auth-name">Name</Label>
                    <Input
                      id="auth-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Aryan Oleti"
                      autoComplete="name"
                      className="mt-1.5"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="auth-email">Email</Label>
                  <Input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    autoComplete="email"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="auth-password">Password</Label>
                  <Input
                    id="auth-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignup ? "At least 6 characters" : "Your password"}
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    className="mt-1.5"
                  />
                </div>

                {error && (
                  <p className="flex items-start gap-2 rounded-lg border border-(--color-down)/20 bg-(--color-down-soft) px-3 py-2 text-[13px] text-(--color-down)">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{error}</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-(--color-brand-700) text-[15px] font-semibold text-white hover:bg-(--color-brand-800) disabled:opacity-60"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {isSignup ? "Continue" : "Sign in"}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {showGoogle && ready && (
                <>
                  <div className="my-5 flex items-center gap-3 text-[11.5px] font-medium uppercase tracking-[0.12em] text-(--color-fg-subtle)">
                    <span className="h-px flex-1 bg-(--color-border)" />
                    or
                    <span className="h-px flex-1 bg-(--color-border)" />
                  </div>
                  <div className="flex justify-center">
                    <div ref={buttonHostRef} />
                  </div>
                </>
              )}

              <p className="mt-6 text-center text-[13.5px] text-(--color-fg-muted)">
                {isSignup ? "Already have an account?" : "New to StockSense?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode(isSignup ? "signin" : "signup");
                    setSignupStep(0);
                    setError(null);
                  }}
                  className="font-semibold text-(--color-brand-700) hover:underline"
                >
                  {isSignup ? "Sign in" : "Get started"}
                </button>
              </p>

              <div className="mt-6 grid gap-2.5 border-t border-(--color-border) pt-5 text-[12.5px] text-(--color-fg-muted)">
                <Feature icon={<ShieldCheck className="h-3.5 w-3.5 text-(--color-up)" />} text="Your password is salted and hashed, never stored in plain text." />
                <Feature icon={<Sparkles className="h-3.5 w-3.5 text-(--color-brand-700)" />} text="Everything stays on your device. No data sold to anyone." />
              </div>
            </>
          )}
        </div>

        <div className="border-t border-(--color-border) bg-(--color-surface-2)/60 px-7 py-3.5 text-[11px] text-(--color-fg-subtle)">
          Demo accounts are stored locally in this browser — see the &ldquo;Is my data safe?&rdquo; note on the homepage.
        </div>
      </div>
    </div>
  );
}

function OnboardingStep({
  experience,
  setExperience,
  goals,
  setGoals,
  risk,
  setRisk,
  busy,
  error,
  backLabel = "Back",
  onBack,
  onSubmit,
}: {
  experience: ExperienceLevel | null;
  setExperience: (v: ExperienceLevel) => void;
  goals: string[];
  setGoals: (v: string[]) => void;
  risk: RiskComfort | null;
  setRisk: (v: RiskComfort) => void;
  busy: boolean;
  error: string | null;
  backLabel?: string;
  onBack: () => void;
  onSubmit: () => void;
}) {
  function toggleGoal(g: string) {
    setGoals(goals.includes(g) ? goals.filter((x) => x !== g) : [...goals, g]);
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1 text-[12.5px] font-medium text-(--color-fg-muted) hover:text-(--color-fg)"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> {backLabel}
      </button>
      <h2 className="mt-3 text-[24px] font-semibold tracking-[-0.02em] text-(--color-fg)">
        A couple of quick questions.
      </h2>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-(--color-fg-muted)">
        This helps Sense, our AI, pitch explanations at the right level for you. You can change it later.
      </p>

      <div className="mt-5 max-h-[46vh] space-y-5 overflow-y-auto pr-1">
        <div>
          <p className="text-[12.5px] font-semibold text-(--color-fg)">How much do you know about stocks?</p>
          <div className="mt-2 grid gap-2">
            {EXPERIENCE_ORDER.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setExperience(level)}
                className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-[13.5px] ${
                  experience === level
                    ? "border-(--color-brand-500) bg-(--color-brand-50) text-(--color-fg)"
                    : "border-(--color-border) bg-(--color-surface) text-(--color-fg-muted) hover:border-(--color-brand-300)"
                }`}
              >
                {EXPERIENCE_LABELS[level]}
                {experience === level && <Check className="h-4 w-4 text-(--color-brand-700)" />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[12.5px] font-semibold text-(--color-fg)">What do you want to do here? <span className="font-normal text-(--color-fg-subtle)">(pick any)</span></p>
          <div className="mt-2 flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => toggleGoal(g)}
                className={`rounded-full border px-3 py-1.5 text-[12.5px] font-medium ${
                  goals.includes(g)
                    ? "border-(--color-brand-500) bg-(--color-brand-50) text-(--color-brand-700)"
                    : "border-(--color-border) bg-(--color-surface) text-(--color-fg-muted) hover:border-(--color-brand-300)"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[12.5px] font-semibold text-(--color-fg)">How do you feel about risk?</p>
          <div className="mt-2 grid gap-2">
            {RISKS.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRisk(r.value)}
                className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left ${
                  risk === r.value
                    ? "border-(--color-brand-500) bg-(--color-brand-50)"
                    : "border-(--color-border) bg-(--color-surface) hover:border-(--color-brand-300)"
                }`}
              >
                <span>
                  <span className="block text-[13.5px] font-medium text-(--color-fg)">{r.title}</span>
                  <span className="block text-[11.5px] text-(--color-fg-subtle)">{r.sub}</span>
                </span>
                {risk === r.value && <Check className="h-4 w-4 text-(--color-brand-700)" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-4 flex items-start gap-2 rounded-lg border border-(--color-down)/20 bg-(--color-down-soft) px-3 py-2 text-[13px] text-(--color-down)">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={busy}
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-(--color-brand-700) text-[15px] font-semibold text-white hover:bg-(--color-brand-800) disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create account <ArrowRight className="h-4 w-4" /></>}
      </button>
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <p className="flex items-start gap-2">
      <span className="mt-0.5">{icon}</span>
      <span>{text}</span>
    </p>
  );
}

function SetupHelp() {
  return (
    <div className="mt-6 rounded-2xl border border-(--color-warn)/30 bg-[color-mix(in_srgb,var(--color-warn)_8%,white)] p-4">
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-(--color-warn)" />
        <div>
          <p className="text-[13px] font-semibold text-(--color-fg)">Google sign-in isn&rsquo;t configured</p>
          <p className="mt-1 text-[12px] leading-relaxed text-(--color-fg-muted)">
            You can still create a local email/password account below. To enable Google, set{" "}
            <code className="rounded bg-(--color-surface-2) px-1.5 py-0.5 text-[11px] font-mono">
              NEXT_PUBLIC_GOOGLE_CLIENT_ID
            </code>{" "}
            in the repo secrets.
          </p>
        </div>
      </div>
    </div>
  );
}
