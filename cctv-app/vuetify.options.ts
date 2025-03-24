// vuetify.options.ts

export const primaryTheme = {
  dark: false,
  colors: {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    base: "#FFFFFF",
    primary: "#1867C0",
    secondary: "#FAFAFA",
    accent: "#7f867e",
    main: "#FAFAFA",
    navigationDrawer: "#042134",
    number: "#848d97",
  },
};

export const vuetifyDefaults = {
  VTextField: {
    variant: "outlined",
    density: "compact",
    // hint: "This field is required",
    persistentHint: true,
  },
  VBtn: {
    class: "text-capitalize",
  },
  VSelect: {
    density: "compact",
    variant: "outlined",
    // hint: "This field is required",
    persistentHint: true,
  },
  VTextarea: {
    variant: "outlined",
    // hint: "This field is required",
    persistentHint: true,
  },
  VAutocomplete: {
    density: "compact",
    variant: "outlined",
    // hint: "This field is required",
    persistentHint: true,
  },
  VCombobox: {
    density: "compact",
    variant: "outlined",
    // hint: "This field is required",
    persistentHint: true,
  },
  VTimePicker: {
    density: "compact",
    variant: "outlined",
    // hint: "This field is required",
  },
};
