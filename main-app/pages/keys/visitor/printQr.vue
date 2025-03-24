<template>
  <v-row class="pa-8">
    <v-col cols="12" v-if="printOrientation === 'A4'">
      <div class="a4-size page-break" v-for="i in printRangeTotal" :key="i">
        <!-- Top half -->
        <div class="half-page" style="height: 50%">
          <VuetifyViewer
            height="100%"
            class="a4HalfSize liner"
            :maxWidth="'8.27in'"
            :value="templateQrCode.A4FrontWysiwyg"
            markdown-theme="github"
          />

          <qrcode-vue
            :value="getQrCodeValue(i)"
            :size="templateQrCode.A4FrontQRCodeSize"
            level="H"
            margin="3"
            :style="{
              top: templateQrCode.A4FrontQRCodeTop + '%',
              left: templateQrCode.A4FrontQRCodeLeft + '%',
              transform: 'translate(-50%, -50%)',
            }"
            class="position-absolute"
          />
          <div
            :style="{
              top: templateQrCode.A4FrontPassTop + '%',
              left: templateQrCode.A4FrontPassLeft + '%',
              transform: 'translate(-50%, -50%)',
            }"
            class="position-absolute text-center"
          >
            Pass Number: {{ prefix }}0{{ +printRangeStart + i - 1 }}
          </div>
        </div>

        <!-- Divider to clearly separate sections -->
        <v-divider :thickness="2" class="py-5"></v-divider>

        <!-- Bottom half -->
        <div class="half-page" style="height: 50%; transform: rotate(180deg)">
          <VuetifyViewer
            height="100%"
            class="a4HalfSize liner"
            :maxWidth="'8.27in'"
            :value="templateQrCode.A4BackWysiwyg"
            markdown-theme="github"
          />

          <qrcode-vue
            :value="getQrCodeValue(i)"
            :size="templateQrCode.A4BackQRCodeSize"
            level="H"
            margin="3"
            :style="{
              top: templateQrCode.A4BackQRCodeTop + '%',
              left: templateQrCode.A4BackQRCodeLeft + '%',
              transform: 'translate(-50%, -50%)',
            }"
            class="position-absolute"
          />
          <div
            :style="{
              top: templateQrCode.A4BackPassTop + '%',
              left: templateQrCode.A4BackPassLeft + '%',
              transform: 'translate(-50%, -50%)',
            }"
            class="position-absolute text-center"
          >
            Pass Number: {{ prefix }}0{{ +printRangeStart + i - 1 }}
          </div>
        </div>
      </div>
    </v-col>

    <v-col cols="12" v-else-if="printOrientation === 'CCP'" class="pa-0 ma-0">
      <div class="a4-size">
        <v-row class="d-flex portraitCardSize" no-gutters>
          <v-col cols="12" class="d-flex justify-center position-relative">
            <v-row no-gutters>
              <!-- Front and Back Cards -->
              <v-col
                cols="6"
                v-for="(card, index) in cardData"
                :key="index"
                class="no-space print-page ma-0"
                :style="{
                  flex: cardData.length === 4 ? 1 : 0,
                  breakInside: 'avoid',
                }"
              >
                <!-- Front of the Credit Card (F) -->
                <v-card
                  flat
                  v-if="card.type === 'F'"
                  border="dashed lg"
                  class="border-dashed border-md ma-0 pa-0 credit-card-size-portrait"
                >
                  <VuetifyViewer
                    class="credit-card-size-portrait"
                    :maxWidth="'8.27in'"
                    :value="templateQrCode.CCFrontWysiwyg"
                    markdown-theme="github"
                  />

                  <qrcode-vue
                    v-if="templateQrCode.CCFrontQREnabled"
                    :value="`${prefix}0${+printRangeStart + +card.number - 1}`"
                    :height="`0%`"
                    :size="templateQrCode.CCFrontQRCodeSize"
                    level="H"
                    :style="{
                      top: `${templateQrCode.CCFrontQRCodeTop - 45}%`,
                      left: `${templateQrCode.CCFrontQRCodeLeft}%`,
                    }"
                    class="position-absolute"
                  />

                  <div
                    :style="{
                      top: `${templateQrCode.CCFrontPassTop - 45}%`,
                      left: `${templateQrCode.CCFrontPassLeft}%`,
                      fontSize: templateQrCode.CCFrontPassSize + 'px',
                      textWrap: 'nowrap',
                    }"
                    class="position-absolute"
                  >
                    Pass Number: {{ prefix }}0{{
                      +printRangeStart + +card.number - 1
                    }}
                  </div>
                </v-card>
                <!-- Back of the Credit Card (F) -->
                <v-card
                  elavation="0"
                  flat
                  v-if="card.type === 'B'"
                  :border="
                    card.number !== 0 && isLastDuplicate[index]
                      ? 'dashed lg'
                      : ''
                  "
                  class="ma-0 credit-card-size-portrait pa-2"
                  :style="{ transform: 'rotate(180deg)' }"
                  :class="{
                    'no-border': !(card.number !== 0 && isLastDuplicate[index]),
                  }"
                >
                  <VuetifyViewer
                    v-if="card.number !== 0 && isLastDuplicate[index]"
                    :maxWidth="'8.27in'"
                    :value="templateQrCode.CCBackWysiwyg"
                    markdown-theme="github"
                  />
                  <!-- <VuetifyViewer
                    v-if="card.number !== 0 && isLastDuplicate[index]"
                    class="credit-card-size-portrait"
                    :maxWidth="'8.27in'"
                    :value="templateQrCode.CCBackWysiwyg"
                    markdown-theme="github"
                  /> -->

                  <qrcode-vue
                    v-if="
                      card.number !== 0 &&
                      isLastDuplicate[index] &&
                      templateQrCode.CCBackQREnabled
                    "
                    :value="`${prefix}0${+printRangeStart + +card.number - 1}`"
                    :size="templateQrCode.CCBackQRCodeSize"
                    level="H"
                    :style="{
                      top: `${templateQrCode.CCBackQRCodeTop - 45}%`,
                      left: `${templateQrCode.CCBackQRCodeLeft}%`,
                    }"
                    class="position-absolute"
                  />

                  <div
                    v-if="
                      card.number !== 0 &&
                      isLastDuplicate[index] &&
                      templateQrCode.CCBackQREnabled
                    "
                    :style="{
                      top: `${templateQrCode.CCBackPassTop - 45}%`,
                      left: `${templateQrCode.CCBackPassLeft}%`,
                      fontSize: templateQrCode.CCBackPassSize + 'px',
                      textWrap: 'nowrap',
                    }"
                    class="position-absolute"
                  >
                    Pass Number: {{ prefix }}0{{
                      +printRangeStart + +card.number - 1
                    }}
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </v-col>
    <v-col cols="12" v-else-if="printOrientation === 'CCL'" class="pa-0 ma-0">
      <Qr-TemplateCreditCardLandscape
        :paginatedCardData="paginatedCardData"
        :templateQrCode="templateQrCode"
        :prefix="prefix"
        :printRangeStart="printRangeStart"
      />
    </v-col>

    <!-- print key -->
    <v-col
      v-else-if="printOrientation === 'KeyCard'"
      cols="12"
      class="pa-0 ma-0"
    >
      <v-card class="a4-size pa-4" flat>
        <v-row no-gutters style="align-content: flex-start">
          <v-col
            cols="2"
            v-for="(key, i) in selectedKeysToPrint"
            :key="i"
            class="mt-2 pa-0"
          >
            <v-row no-gutters>
              <v-card
                border="dashed sm"
                tile
                flat
                class="ma-0 pa-0"
                style="align-content: center; width: 1.22in"
              >
                <v-card
                  variant="outlined"
                  tile
                  flat
                  class="ma-0 pa-0"
                  style="height: 0.5in; width: 1.2in"
                >
                  <v-row
                    no-gutters
                    class="fill-height pl-2"
                    align-content="center"
                  >
                    <qrcode-vue
                      :value="key?.prefixAndName"
                      style="height: 1cm; width: 1cm"
                    />

                    <span
                      class="pl-2 text-uppercase"
                      style="align-content: center; font-size: 11.19px"
                    >
                      {{ key?.prefixAndName }}
                    </span>
                  </v-row>
                </v-card>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import QrcodeVue from "qrcode.vue";
definePageMeta({
  middleware: ["secure", "site"],
  layout: "plain",
});

const { mySite } = useFilter();

const keysToPrint: any = localStorage.getItem("selectedKeysToPrint");
const selectedKeysToPrint = JSON.parse(keysToPrint);

const { templateQrCode, getTemplatesByPageSearch } = useTemplateReusable();

const route = useRoute();

const printRangeStart = ref();
const printRangeEnd = ref();
const printRangeTotal = ref();
const printOrientation = ref();
const prefix = ref();

// const flexEnabled = ref(false);
const cardDatas = ref<any>([]);

onMounted(async () => {
  //const name = route.query.nameTemplate;
  printRangeStart.value = route.query.printRangeStart;
  printRangeEnd.value = route.query.printRangeEnd;
  printOrientation.value = route.query.printOrientation;
  const status = "active";
  const templateId = route.query.templateId;
  printRangeTotal.value =
    Math.abs(printRangeStart.value - printRangeEnd.value) + 1;

  prefix.value = route.query.prefix;
  const data: any = await getTemplatesByPageSearch({
    _id: templateId as string,
    sites: [mySite.value],
    statuses: [status],
  });
  generateCardData(printRangeTotal.value);
  cardDatas.value = generateCardDatas(printRangeTotal.value);
  templateQrCode.value = data?.items[0];

  await nextTick();

  // window.print();
  // Wait for the entire page to load before printing
  setTimeout(() => {
    window.print();
  }, 1500);
});

const getQrCodeValue = (i: any) => {
  return prefix.value + "0" + (+printRangeStart.value + i - 1);
};

let totalCards = printRangeTotal.value;
// const totalCards = 8;

const cardData = ref<any>([]);

//original function
const generateCardData = (totalCards: any) => {
  let passNumber = 1;
  let cardsPerPage = 3;

  while (passNumber <= totalCards) {
    // Front Cards
    for (let i = 0; i < cardsPerPage && passNumber <= totalCards; i++) {
      cardData.value.push({ type: "F", number: passNumber });
      passNumber++;
    }

    let backStart = passNumber - cardsPerPage;
    let start = totalCards === 1 ? 2 : 0;
    for (let i = start; i < cardsPerPage && backStart + i < passNumber; i++) {
      cardData.value.push({ type: "B", number: backStart + i });
    }
  }
};

const generateCardDatas = (numCards: any) => {
  const cardDatas = [];
  for (let i = 1; i <= numCards; i++) {
    cardDatas.push({ type: "F", number: i.toString() });
    cardDatas.push({ type: "B", number: i.toString() });
  }
  return cardDatas;
};

//const cardDatas = ref(generateCardDatas(printRangeTotal.value));

const paginatedCardData = computed(() => {
  const cardsPerPage = 8;
  const pages = [];

  for (let i = 0; i < cardDatas.value.length; i += cardsPerPage) {
    pages.push(cardDatas.value.slice(i, i + cardsPerPage));
  }

  return pages;
});

const isLastDuplicate = computed(() => {
  let seen: any = {};
  return cardData.value.map((card: any) => {
    if (card.type === "B" && !seen[card.number]) {
      seen[card.number] = true;
      return true;
    }
    return false;
  });
});
</script>

<style scoped>
.a4-size {
  width: 21cm;
  height: 29.7cm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  /* page-break-inside: avoid; */
  /* page-break-after: always; */
}
/* .a4-size {
  width: 21cm;
  height: 29.7cm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  page-break-after: avoid;
} */

/* .a4HalfSize {
  width: 21cm;
  height: 14.85cm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  page-break-after: avoid;
} */

.half-page {
  height: 50%;
  position: relative;
  overflow: hidden;
}
/* div {
  border: 1px solid black;
}
.liner {
  border: 1px solid rgb(73, 0, 0);
} */

/* .watermark {
  position: absolute;
  top: 10px;
  left: 10px;
  opacity: 0.1;
  font-size: 24px;
  z-index: -1;
}

/* credit card portrait style Start */

.credit-card-size-portrait {
  width: 66.6mm;
  height: 100mm;
  /* margin: 0.1in; */
  padding: 0;
}
/* .credit-card-size-portrait {
  width: 203.904px;
  height: 323.52px;
} */
.page-break {
  page-break-inside: avoid;
  break-inside: avoid;
  display: block;
}

/* credit card portrait style End */

.horizontal-line {
  width: 100%;
  height: 7px;
  background-color: #000;
  margin: 0;
}

html,
body {
  height: auto;
}

/* @media print {
  .print-page-break {
    page-break-after: always;
  }
}

@media print {
  html,
  body {
    height: auto;
  }
  .print:last-child {
    page-break-after: auto;
  }
} */

/* landscape CC start */
/* .a4-size.landscape {
  width: 297mm; 
  height: 210mm; 
}

.credit-card-size-landscape {
  width: 85.6mm; 
  height: 53.98mm; 
} */
/* landscape end */

/* portrait CC style */
.portraitCardSize {
  align-content: flex-start;
}

.no-border {
  border: none !important;
}
@media print {
  /* .a4-size {
    width: 8.27in;

    margin: 0 auto;
  } */
  .a4-size {
    width: 21cm;
    height: 29.7cm;
    margin: 0.1in;
    padding: 0;
  }

  .print-page {
    page-break-inside: auto;
  }

  @page {
    size: A4 portrait;
    margin: 0.5in;
  }

  .credit-card-size-portrait {
    width: 66.6mm;
    height: 100mm;
    /* margin: 0.1in; */
    padding: 0;
  }
  /* .credit-card-size-portrait {
    width: 203.904px;
    height: 323.52px;
    margin: 0.1in;
    padding: 0;
  } */
  .credit-card-size-landscape {
    height: 203.904px;
    width: 323.52px;
    margin: 0.1in;
    padding: 0;
  }

  v-row {
  }

  v-col {
  }

  v-col:nth-child(9n) {
    page-break-after: always;
  }

  /* .a4-size:after {
    content: "";
    display: block;
    page-break-before: always;
  } */

  v-row {
  }
}
</style>
