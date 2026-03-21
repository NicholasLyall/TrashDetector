# Smart Waste Intelligence Platform Docs Pack

This folder contains the core planning documents for the **Smart Waste Intelligence Platform** project: a computer-vision-assisted trash sorting system with a real-time SaaS-style analytics dashboard.

## What this project is

A staged smart trash sorter that:

1. accepts one or more pieces of trash through a top opening,
2. mechanically funnels or stages items so they can be processed reliably,
3. captures an image with a Raspberry Pi camera,
4. runs a YOLO-based perception model locally on the Pi,
5. routes the item with a servo-controlled mechanism,
6. sends an event and snapshot to a backend,
7. visualizes live sorting and environmental impact in a polished dashboard.

## Primary docs

- `CLAUDE.md` — master implementation context and coding guidance for Claude Code
- `PRD.md` — product requirements document
- `ARCHITECTURE.md` — end-to-end system architecture
- `UI_UX_SPEC.md` — dashboard layout, visual language, and interaction details
- `API_SPEC.md` — backend API contract
- `DATA_MODEL.md` — database tables and event schema
- `HARDWARE_SYSTEM_CONTEXT.md` — physical system assumptions and mechanical logic
- `MODEL_CONTEXT.md` — perception model and training context
- `IMPLEMENTATION_PLAN.md` — build order and milestones
- `FILE_PLACEMENT_DIAGRAM.md` — where each file should go in the repo

## Reference image

Use this dashboard mockup as a layout/style reference:

`/mnt/data/a_2d_digital_graphic_displays_a_smart_recycling_da.png`

## Suggested repo root

```text
smart-waste-intelligence/
```

See `FILE_PLACEMENT_DIAGRAM.md` for the full structure.
