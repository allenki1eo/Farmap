# KilimoScope AI

Mobile-first agricultural intelligence for Tanzania.

KilimoScope AI helps farmers, investors, agronomists, NGOs, and institutions discover what grows where, compare crop suitability by area, ask mock AI farming questions, and save useful recommendations offline.

## Run Locally

```bash
npm install
npx expo start
```

For web preview:

```bash
npx expo start --web
```

## App Structure

- `app/` - Expo Router routes, bottom tabs, workflow screens, and detail pages.
- `components/` - Reusable cards, badges, buttons, search, chat, map, offline, and loading UI.
- `data/` - Mock Tanzania crop, region, district, suitability, soil, climate, and AI response data.
- `services/api.ts` - Central API-ready service layer with simulated loading delays.
- `services/offline.ts` - SQLite-backed localStorage persistence for onboarding, language, saved items, and recent searches.
- `stores/` - Zustand app, saved-items, and search stores.
- `types/` - Shared TypeScript domain types.
- `constants/theme.ts` - KilimoScope AI color, radius, and shadow tokens.

## Current MVP Notes

- The map is a premium placeholder with region markers, layer selection, and an insight bottom sheet. It is structured so React Native Maps or Mapbox can replace the visual layer later.
- The AI advisor uses local keyword-based mock responses. The API service is ready to swap `askAI()` for `POST /api/ai/ask`.
- Saved recommendations, language, onboarding status, and recent searches persist locally.

## Disclaimer

KilimoScope AI provides decision-support information based on available agricultural, climate, soil, and crop suitability data. It should not replace professional agronomic advice, field soil testing, or official weather warnings.
