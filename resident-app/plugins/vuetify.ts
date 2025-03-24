import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { VDateInput } from "vuetify/labs/VDateInput";
import {
  VuetifyTiptap,
  VuetifyViewer,
  createVuetifyProTipTap,
  BaseKit,
  Bold,
  Italic,
  Underline,
  Strike,
  Color,
  Highlight,
  Heading,
  TextAlign,
  FontFamily,
  FontSize,
  SubAndSuperScript,
  BulletList,
  OrderedList,
  TaskList,
  Indent,
  Link,
  Image,
  Video,
  Table,
  Blockquote,
  HorizontalRule,
  Code,
  CodeBlock,
  Clear,
  Fullscreen,
  History,
} from "vuetify-pro-tiptap";
import "vuetify-pro-tiptap/style.css";
// import "../assets/scss/markdown.scss";

const light = {
  dark: false,
  colors: {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    base: "#FFFFFF",
    primary: "#1867C0",
    secondary: "#FAFAFA",
    accent: "#7f867e",
    main: "#FAFAFA",
    navigationDrawer: "#121827",
    number: "#848d97",
    textColor: "#EB261E",
    cardColor: "#FFFFFF",
    textBox: "#F2F2F2",
    bluelight: "#FFFFFF",
    secondaryDark: "#FFFFFF",
    textWhite: "#FFFFFF",
    textWhite2: "#0F131C",
  },
};
const dark = {
  dark: false,
  colors: {
    background: "#0F131C",
    surface: "#111723",
    base: "#111723",
    primary: "#111723",
    secondary: "#111723",
    accent: "#111723",
    main: "#111723",
    navigationDrawer: "#111723",
    number: "#111723",
    textColor: "#FFFFFF",
    cardColor: "#F2F2F2",
    textBox: "#0F131C",
    bluelight: "#111723",
    secondaryDark: "#0F131C",
    textWhite: "#FFFFFF",
    textWhite2: "#F2F2F2",
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "dark",
      themes: {
        light,
        dark,
      },
    },
    defaults: {
      font: { family: "Google Sans Display,Arial,Helvetica,sans-serif" },
      VTextField: {
        variant: "outlined",
        density: "compact",
        hint: "This field is required",
        persistentHint: true,
      },
      VBtn: {
        class: "text-capitalize",
      },
      VSelect: {
        density: "compact",
        variant: "outlined",
        hint: "This field is required",
        persistentHint: true,
      },
      VTextarea: {
        variant: "outlined",
        hint: "This field is required",
        persistentHint: true,
      },
      VAutocomplete: {
        density: "compact",
        variant: "outlined",
        hint: "This field is required",
        persistentHint: true,
      },
      VCombobox: {
        density: "compact",
        variant: "outlined",
        hint: "This field is required",
        persistentHint: true,
      },
    },
    components: {
      VDateInput,
    },
  });

  const vuetifyProTipTap = createVuetifyProTipTap({
    lang: "en",
    markdownTheme: "github",
    components: {
      VuetifyTiptap,
      VuetifyViewer,
    },
    extensions: [
      BaseKit.configure({
        placeholder: {
          placeholder: "Enter some text...",
        },
      }),
      Bold,
      Italic,
      Underline,
      Strike,
      Code.configure({ divider: true }),
      Heading,
      TextAlign,
      FontFamily,
      FontSize,
      Color,
      Highlight.configure({ divider: true }),
      SubAndSuperScript.configure({ divider: true }),
      Clear.configure({ divider: true }),
      BulletList,
      OrderedList,
      TaskList,
      Indent.configure({ divider: true }),
      Link,
      Image.configure({
        // imageTabs: [{ name: 'SELECT', component: SelectImage }],
        // hiddenTabs: ['upload'],
        upload(file: File) {
          const url = URL.createObjectURL(file);
          console.log("mock upload api :>> ", url);
          return Promise.resolve(url);
        },
      }),
      Video,
      Table.configure({ divider: true }),
      Blockquote,
      HorizontalRule,
      CodeBlock.configure({ divider: true }),
      History.configure({ divider: true }),
      Fullscreen,
    ],
  });

  nuxtApp.vueApp.use(vuetify);
  nuxtApp.vueApp.use(vuetifyProTipTap);
});
