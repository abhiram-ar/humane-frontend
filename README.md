#### project structure

```bash
src/
│
├── app/                    # Entry-point level setup (providers, router, global styles)
│   ├── App.tsx
│   ├── index.tsx
│   ├── router.tsx
│   └── providers/          # React Contexts, Redux stores, etc.
│
├── assets/                 # Static assets like images, fonts
│
├── components/             # Reusable UI components (buttons, modals, inputs)
│   └── common/             # General shared components
│
├── features/               # Feature-based modules (scalable design pattern)
│   ├── auth/
│   │   ├── components/     # Auth-related components
│   │   ├── pages/          # Login, Register pages
│   │   ├── services/       # API calls
│   │   ├── hooks/          # Feature-specific custom hooks
│   │   └── Types/          # Types handled by the feature
│   └── dashboard/
│       └── ...
│
├── hooks/                  # App-wide custom hooks (e.g., useDebounce)
│
├── layouts/                # Layouts like AuthLayout, DashboardLayout
│
├── lib/                    # Utilities (Axios instance, formatters, validators)
│
├── types/                  # Global TypeScript types and interfaces
│
├── constants/              # App-wide constants (roles, routes, status codes)
│
├── env/                    # Environment configs
│   ├── config.ts           # `import.meta.env.VITE_*` wrappers
│
└── styles/                 # Global styles (tailwind, css modules, sass)
    └── index.css
```
