# Standards

## Naming conventions

- `kebab-case` - for all folders/files.
- `PascalCase` - for classes, types and interfaces.
- `camelCase` - for functions, schemas, fields, db columns and etc.

## Folder structure

- `.` - main source code.

### Assets

- `./assets` - for modularity of composables. **(Only if needed)**
  - `./assets/<module-name>` - for modularity of the features assets.
    - `./assets/<module-name>/<asset-name>.svg` - for modularity of the features base on created assets.

### Composables

- `./composables` - for modularity of composables. **(Only if needed)**
  - `./composables/<module-name>` - for modularity of the features composables.
    - `./composables/<module-name>/<use-composable-name>.ts` - for modularity of the features base on created composables.

### Components

- `./components` - for modularity of components. **(Only if needed)**
  - `./components/<module-name>` - for modularity of the features components.
    - `./components/<module-name>/<component-name>.vue` - for modularity of the features base on created components.

### Pages

- `./pages` - for modularity of pages. **(Only if needed)**
  - `./pages/<module-name>` - for modularity of the features pages.
    - `./pages/<module-name>/<page-name>.vue` - for modularity of the features base on created pages.

### Types

- `./types` - for modularity of types. **(Only if needed)**
  - `./types/<module-name>` - for modularity of the features types.
    - `./types/<module-name>/<type>.d.ts` - for modularity of the features base on created types.

### Others

- `src/plugins` - for 3rd party integrations libraries.
- `src/middleware` - for app middlewares. **(Only if needed or doing fullstack)**
- `src/utils` - for utilities.
