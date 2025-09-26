# Dev Simulation — Quick Start

## Option A — Codespaces / Dev Container
1) Commit and push the `.devcontainer` folder to your repo.
2) Open in **GitHub Codespaces** or **VS Code Dev Containers**.
3) After container builds, run:
```bash
npm run dev
# or run emulator:
npm run emul
```

## Option B — Local (no Docker)
```bash
npm i -g firebase-tools
npm ci
npm run dev
npm run emul    # start emulators (hosting/firestore/auth/ui)
```

## Add these scripts to package.json
```json
{
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "emul": "firebase emulators:start",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "format:check": "prettier --check .",
    "format:fix": "prettier --write ."
  }
}
```

## Firebase Notes
- Replace `your-firebase-project-id` in `.firebaserc`.
- Emulators run on ports: Firestore 8080, Auth 9099, Hosting 5100, UI 4000.
- For Next.js + Firebase Hosting, use framework-aware hosting or Actions later.
