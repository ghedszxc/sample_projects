import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";
import { VTimePicker } from "vuetify/labs/VTimePicker";
import { VDateInput } from "vuetify/labs/VDateInput";
import "vuetify/styles";
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
// import "./../assets/scss/markdown.scss";
const primaryTheme = {
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
    /* navigationDrawer: "#121827", */
    number: "#848d97",
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "primaryTheme",
      themes: {
        primaryTheme,
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
      VTimePicker: {
        density: "compact",
        variant: "outlined",
        hint: "This field is required",
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
      VTimePicker,
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
      // TextAlign.configure({
      //   defaultAlignment: "center", // or you can try '' if null doesn't work
      // }),
      FontFamily,
      FontSize,
      Color,
      Highlight.configure({ divider: true }),
      // SubAndSuperScript.configure({ divider: true }),
      Clear.configure({ divider: true }),
      BulletList,
      OrderedList,
      TaskList,
      Indent.configure({ divider: true }),
      // Link,
      Image.configure({
        // imageTabs: [{ name: 'SELECT', component: SelectImage }],
        // hiddenTabs: ['upload'],
        divider: true,
        // upload(file: File) {
        //   console.log("file :>> ", file);
        //   const url = URL.createObjectURL(file);
        //   console.log("mock upload api :>> ", url);
        //   return Promise.resolve(url);
        // },
        upload(file: File) {
          return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/api/files/upload?status=draft");
            xhr.onload = function () {
              if (this.status === 200) {
                const responseID = JSON.parse(this.response);
                resolve(`/api/files/${responseID.id}`);
              } else {
                reject(new Error("Upload failed"));
              }
            };
            xhr.onerror = function () {
              reject(new Error("Upload failed"));
            };
            const formData = new FormData();
            formData.append("file", file);
            xhr.send(formData);
          });
        },
      }),
      // Video,
      // Table.configure({ divider: true }),
      Blockquote,
      HorizontalRule,
      CodeBlock.configure({ divider: true }),
      History.configure({ divider: true }),
      // Fullscreen,
    ],
  });

  nuxtApp.vueApp.use(vuetify);
  nuxtApp.vueApp.use(vuetifyProTipTap);
});
