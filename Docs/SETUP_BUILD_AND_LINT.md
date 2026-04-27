# Guide: Modern Build & Linting Setup

This document explains the modern development and production workflow implemented in this project, focusing on the **tsup** bundler and **ESLint v10** (Flat Config).

---

## 🚀 1. The Build System (tsup)

We use **tsup** to handle our production builds. It is a zero-config, extremely fast bundler powered by `esbuild`.

### Why we use tsup:
1.  **ESM Resolution**: Node.js in ESM mode usually requires `.js` extensions on all imports. `tsup` handles this for us during the build, allowing us to keep our source code clean (no `.js` in imports).
2.  **Path Aliases**: It natively resolves our `@/*` path shortcuts defined in `tsconfig.json`.
3.  **Bundling**: It combines our project into a single, optimized file (`dist/server.js`), which is faster to load and deploy.

### Commands:
```powershell
# Build for production
npm run build

# Start the compiled production server
npm run start
```

---

## 🛡️ 2. Modern Linting (ESLint v10)

We have implemented the latest **ESLint v10** standards using the **Flat Config** system.

### Key Changes:
*   **Configuration**: All rules are now in `eslint.config.js`. Older files like `.eslintrc.json` and `.eslintignore` are no longer needed.
*   **Ignored Files**: Instead of a separate file, ignored paths (like `dist/`) are defined directly inside the `ignores` property of `eslint.config.js`.

### Commands:
```powershell
# Check for code quality issues
npm run lint

# Automatically fix most issues
npm run lint:fix
```

---

## ⚙️ Installation & Requirements

To set up this environment from scratch, you need the following dev dependencies:

```powershell
# Install the Bundler
npm install -D tsup

# Install ESLint v10 and TypeScript support
npm install -D eslint typescript-eslint @eslint/js
```

---

## 🛠️ 3. TypeScript Configuration (`tsconfig.json`)

To work correctly with the bundler and avoid the deprecated `baseUrl`, use the following `tsconfig.json` settings. This uses the modern `moduleResolution: "bundler"` which is optimized for tools like `tsup` and `tsx`.

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2023"],
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "noImplicitAny": true,
    "allowJs": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "sourceMap": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 💡 Troubleshooting: ESM Paths
If you ever see an error like `ERR_MODULE_NOT_FOUND` when running your production build, it is usually because of a path resolution issue. By using `tsup`, we avoid this entirely because the bundler "pre-links" all your files together into one.

---
*This setup ensures that you can focus on writing code without worrying about Node.js module resolution quirks.*