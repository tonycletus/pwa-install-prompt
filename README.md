# @tonycletus/pwa-install-prompt

React utilities for Progressive Web App install prompts.

This package gives you a small hook and button component for building an
install experience that behaves correctly across desktop Chrome, Android
Chromium browsers, iOS Safari, and already-installed PWAs.

## Install

```bash
npm install @tonycletus/pwa-install-prompt
pnpm add @tonycletus/pwa-install-prompt
yarn add @tonycletus/pwa-install-prompt
```

## Quick Start

```tsx
import { PwaInstallButton, usePwaInstallPrompt } from "@tonycletus/pwa-install-prompt";

export function InstallApp() {
  const install = usePwaInstallPrompt();

  return (
    <PwaInstallButton state={install}>
      {install.installed ? "Open app" : "Install app"}
    </PwaInstallButton>
  );
}
```

## Custom UI

```tsx
import { usePwaInstallPrompt } from "@tonycletus/pwa-install-prompt";

export function InstallCard() {
  const install = usePwaInstallPrompt();

  if (install.installed) {
    return <p>Installed</p>;
  }

  if (install.platform === "ios") {
    return <p>Open the share menu and choose Add to Home Screen.</p>;
  }

  return (
    <button disabled={!install.canPrompt} onClick={() => install.prompt()}>
      Install app
    </button>
  );
}
```

## Returned State

`usePwaInstallPrompt()` returns:

- `platform`: `ios`, `android`, `desktop`, or `unknown`
- `canPrompt`: whether the browser currently exposes a native install prompt
- `installed`: whether the app appears to be running as an installed PWA
- `prompt()`: opens the native install prompt when the browser supports it
- `error`: the last prompt error, if one happened

## Browser Behavior

Android/Chromium browsers can expose the native `beforeinstallprompt` event.
iOS Safari does not currently allow sites to trigger installation automatically,
so the hook reports `platform: "ios"` and `canPrompt: false`.

This package does not replace the browser's install rules. Your app still needs
a valid web manifest, service worker, HTTPS, and installable PWA metadata before
supported browsers will show a native prompt.
