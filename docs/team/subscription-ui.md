# Subscription UI first pass

The user approved the recommended first pass of the subscription UX research: plan comparison, clear pricing/demo terms, and preview/FAQ. The returning-user dashboard and aggregate progress proposals remain a later pass.

- `Paywall.tsx` presents Year and Rescue in aligned cards with concrete feature lists. Year is identified for changing income. Planned prices are prominent, while each action remains explicitly a free demo with no card or charge. The repayment reduction still comes from the current plan.
- `PlanAccessDetails.tsx` illustrates the checklist and export with generic feature previews, never protected personal amounts or invented recommendations. Three native, keyboard-accessible disclosures explain included features, demo charges and entering personal numbers. The Rescue-to-Year view omits the redundant core-tool preview.
- `PlanPreview.tsx` adds a comparison shortcut beside the calculated result. It jumps to the existing `PlanAccess` section; the single unlock flow and request coordinator remain in place.

References: [Notion plan comparison](https://www.notion.com/pricing), [Spotify price/term presentation](https://www.spotify.com/us/premium/), [YNAB card-free trial and FAQs](https://www.ynab.com/pricing). These inspired the information structure; conversion or retention effects have not been measured.

There are no new API calls, providers, billing options, calculation rules or dependencies. Real Stripe remains deferred. Keep the explicit planned-price/free-demo distinction when integrating. Preview `/plan` with a saved household and `DEMO_UNLOCK_ENABLED=true`; test both initial selection and the Rescue-to-Year upgrade.

Validation: lint, strict type checking, all 560 existing tests across 47 files, production build and diff whitespace checks pass. Disposable local HTTP checks covered locked fields, Rescue/Year grants, upgrade, check-in and export. Rendered-content checks covered the normal, upgrade and disabled-demo views, their feature lists, price/demo labels, FAQ semantics and unique IDs. No browser connection was available, so desktop/mobile visual interaction remains a manual check. Local preview: http://127.0.0.1:3002/check → Try Dani's family → rescue plan → Compare access options.
