## UI Components & Blocks

This directory is reserved for UI primitives and reusable blocks.

### Installation from Registry

Components and blocks are meant to be installed from the [UNOPS Component Registry](https://registry-unops.vercel.app/).

#### Quick Install

1. Visit https://registry-unops.vercel.app/
2. Browse and select a component or block
3. Copy the installation command (or use the pattern below):

```bash
pnpm dlx shadcn@latest add <registry-item-url>
```

#### Example

```bash
pnpm dlx shadcn@latest add https://registry-unops.vercel.app/r/button
```

#### First Time Setup

If it's your first time using the shadcn CLI, run:

```bash
pnpm dlx shadcn@latest init
```

This will configure the CLI for your project. Accept the defaults (or review [components.json](../../components.json) for custom settings).

---

**Note:** The shadcn CLI automatically generates TypeScript types and integrates with the Tailwind config. All installed components will respect the UN/UNOPS theme tokens defined in `src/styles/tokens.css`.
