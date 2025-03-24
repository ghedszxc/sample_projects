// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
    root: true,
    env: {
        browser: true,
        node: true,
    },
    rules: {
        "no-unused-vars": 2,
    },
});
