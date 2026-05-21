# @tonycletus/pwa-install-prompt

React utilities for PWA install prompts.

## Install

```bash
npm install @tonycletus/pwa-install-prompt
pnpm add @tonycletus/pwa-install-prompt
```

## Usage

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

Android/Chromium browsers can expose the native `beforeinstallprompt` event.
iOS Safari does not currently allow sites to trigger installation automatically,
so the hook reports `platform: "ios"` and `canPrompt: false`.
