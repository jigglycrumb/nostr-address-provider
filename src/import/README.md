If you already have an existing `nostr.json`:

- Rename `src/pages/tools/_import.ts` to `src/pages/tools/import.ts`
- Place `nostr.json` here
- Build and deploy to activate the import page
- Visit `<yoursite>/tools/import` to populate your MongoDB instance.
- Rename `src/pages/tools/import.ts` to `src/pages/tools/_import.ts`
- Build and deploy to deactivate the import page
