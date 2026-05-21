import * as React from "react";

export type PwaPlatform = "ios" | "android" | "desktop" | "unknown";
export type InstallOutcome = "accepted" | "dismissed" | "unavailable" | "installed";

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export type PwaInstallState = {
  platform: PwaPlatform;
  canPrompt: boolean;
  installed: boolean;
  prompt: () => Promise<InstallOutcome>;
};

export function detectPwaPlatform(userAgent = getNavigatorUserAgent(), platform = getNavigatorPlatform()): PwaPlatform {
  const ua = userAgent.toLowerCase();
  const platformValue = platform.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua) || (platformValue.includes("mac") && hasTouch())) return "ios";
  if (ua.includes("android")) return "android";
  if (ua) return "desktop";
  return "unknown";
}

export function isStandalonePwa(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

export function usePwaInstallPrompt(): PwaInstallState {
  const [platform, setPlatform] = React.useState<PwaPlatform>("unknown");
  const [event, setEvent] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = React.useState(false);

  React.useEffect(() => {
    setPlatform(detectPwaPlatform());
    setInstalled(isStandalonePwa());

    const onBeforeInstallPrompt = (nextEvent: Event) => {
      nextEvent.preventDefault();
      setEvent(nextEvent as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setEvent(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const prompt = React.useCallback(async (): Promise<InstallOutcome> => {
    if (installed) return "installed";
    if (!event) return "unavailable";
    await event.prompt();
    const choice = await event.userChoice;
    setEvent(null);
    if (choice.outcome === "accepted") setInstalled(true);
    return choice.outcome;
  }, [event, installed]);

  return {
    platform,
    canPrompt: Boolean(event) && !installed,
    installed,
    prompt,
  };
}

export type PwaInstallButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  state: PwaInstallState;
  onOutcome?: (outcome: InstallOutcome) => void;
};

export function PwaInstallButton({ state, onOutcome, children, disabled, ...props }: PwaInstallButtonProps) {
  return React.createElement(
    "button",
    {
      ...props,
      disabled: disabled ?? (!state.canPrompt && !state.installed),
      onClick: async () => {
        const outcome = await state.prompt();
        onOutcome?.(outcome);
      },
    },
    children ?? (state.installed ? "Open app" : "Install app"),
  );
}

function getNavigatorUserAgent(): string {
  return typeof navigator === "undefined" ? "" : navigator.userAgent;
}

function getNavigatorPlatform(): string {
  return typeof navigator === "undefined" ? "" : navigator.platform;
}

function hasTouch(): boolean {
  return typeof document !== "undefined" && "ontouchend" in document;
}
