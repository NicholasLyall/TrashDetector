# File Placement Diagram

Use this repo layout.

```text
smart-waste-intelligence/
├── CLAUDE.md
├── README.md
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── UI_UX_SPEC.md
│   ├── API_SPEC.md
│   ├── DATA_MODEL.md
│   ├── HARDWARE_SYSTEM_CONTEXT.md
│   ├── MODEL_CONTEXT.md
│   ├── IMPLEMENTATION_PLAN.md
│   └── assets/
│       └── dashboard-reference.png
├── apps/
│   ├── web/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── public/
│   │   └── package.json
│   └── api/
│       ├── app/
│       │   ├── main.py
│       │   ├── routes/
│       │   ├── services/
│       │   ├── schemas/
│       │   └── db/
│       ├── requirements.txt
│       └── .env.example
├── pi/
│   ├── runtime/
│   │   ├── camera.py
│   │   ├── inference.py
│   │   ├── sorter.py
│   │   ├── uploader.py
│   │   └── main.py
│   ├── models/
│   │   └── best.pt
│   └── config/
│       └── settings.example.json
└── infra/
    ├── supabase/
    │   ├── schema.sql
    │   └── policies.sql
    └── deployment/
        ├── vercel.md
        ├── render.md
        └── railway.md
```

## What goes where

### Repo root
- `CLAUDE.md` should live at the root so Claude Code sees it immediately.
- `README.md` should be the human-facing repo entrypoint.

### `/docs`
Put all planning and product documents here.

### `/docs/assets`
Put the dashboard concept image here and rename it to `dashboard-reference.png`.

### `/apps/web`
Frontend Next.js app.

### `/apps/api`
FastAPI backend.

### `/pi`
All Raspberry Pi runtime and model files.

### `/infra`
Schema, deployment notes, and environment setup docs.
