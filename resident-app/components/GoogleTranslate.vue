<template>
  <div>
    <div id="google_translate_element" />
    <Script
      type="text/javascript"
      src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    />
  </div>
</template>

<script setup lang="ts">
const { theme } = useLocal();
const emit = defineEmits<{
  (event: "onShowGoogleTranslate"): void;
}>();

if (process.client) {
  setTimeout(() => {
    googleTranslateElementInit();
    observeAndHideElements();
    toggleDarkMode(theme.value);
    emit("onShowGoogleTranslate");
  }, 2000);
}

watch(theme, (val: any) => {
  toggleDarkMode(val);
});

function toggleDarkMode(val: any) {
  const element1 = document.querySelector(".goog-te-combo");
  const element2 = document.querySelector("#google_translate_element > div");
  const element3 = document.querySelector(
    "#google_translate_element > div > span > a",
  );
  if (val === "dark") {
    element1!.classList.add("google-translate-dark");
    element1!.classList.remove("google-translate-light");
    element2!.classList.add("google-translate-dark");
    element2!.classList.remove("google-translate-light");
    element3!.classList.add("google-translate-dark");
    element3!.classList.remove("google-translate-light");
  } else {
    element1!.classList.add("google-translate-light");
    element1!.classList.remove("google-translate-dark");
    element2!.classList.add("google-translate-light");
    element2!.classList.remove("google-translate-dark");
    element3!.classList.add("google-translate-light");
    element3!.classList.remove("google-translate-dark");
  }
}

function googleTranslateElementInit() {
  //setCookie("googtrans", "/en/en", 1);
  emit("onShowGoogleTranslate");
  new google.translate.TranslateElement(
    { pageLanguage: "en", autoDisplay: false },
    "google_translate_element",
  );
}

const observeAndHideElements = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        const elements = document.querySelectorAll("body > .skiptranslate");
        elements.forEach((el) => {
          el.style.display = "none";
          el.style.opacity = 0;
          document.querySelector("body").removeAttribute("style");
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

//function setCookie(key: string, value: string, expiry: number) {
//  const expires = new Date();
//  expires.setTime(expires.getTime() + expiry * 24 * 60 * 60 * 1000);
//  document.cookie = key + "=" + value + ";expires=" + expires.toUTCString();
//}

//const handleClick = () => {
//  const el = document.querySelector(
//    "#google_translate_element > .skiptranslate .goog-te-combo",
//  );
//  el!.click();
//  console.log(el);
//};
</script>

<style>
.google-translate-dark {
  background-color: #111723 !important;
  color: white !important;
}

.google-translate-light {
  background-color: #fff !important;
  color: black !important;
}
</style>
