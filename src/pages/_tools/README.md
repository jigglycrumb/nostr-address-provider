In this folder you'll find simple tools for

- importing from an an existing `nostr.json`
- exporting your database to JSON

These tools are disabled by default. To enable them, rename this folder to `tools`.
To disable them again, rename the folder to `_tools`.

### importing

- Place your `nostr.json` in the `tools` folder
- Build and deploy to activate the import page
- Visit `<yoursite>/tools/import` to populate your MongoDB instance.

### exporting

- Visit `<yoursite>/tools/export`
- Copy the JSON to see in the browser to a file
