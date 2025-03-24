<template>
  <v-col cols="12" class="pa-0 ma-0">
    <div class="a4-size">
      <v-row class="d-flex" no-gutters>
        <!-- Iterate through each page -->

        <v-col
          v-for="(page, pageIndex) in paginatedCardData"
          :key="pageIndex"
          cols="12"
          class="d-flex justify-center position-relative print-page"
        >
          <v-row no-gutters>
            <!-- Iterate through each card in the page -->
            <v-col
              v-for="(card, cardIndex) in page"
              :key="cardIndex"
              cols="6"
              class="pa-0"
            >
              <!-- Front of the Credit Card (F) -->
              <v-card
                v-if="card.type === 'F'"
                border="dashed lg"
                class="ma-0 pa-0 credit-card-size-landscape"
              >
                <VuetifyViewer
                  class="credit-card-size-landscape"
                  :maxWidth="'8.27in'"
                  :value="templateQrCode.CCFrontWysiwyg"
                  markdown-theme="github"
                />

                <qrcode-vue
                  v-if="templateQrCode.CCFrontQREnabled"
                  :value="`${prefix}0${+printRangeStart + +card.number - 1}`"
                  :size="templateQrCode.CCFrontQRCodeSize"
                  level="H"
                  :style="{
                    top: `${templateQrCode.CCFrontQRCodeTop - 45}%`,
                    left: `${templateQrCode.CCFrontQRCodeLeft}%`,
                  }"
                  class="position-absolute"
                />

                <div
                  v-if="templateQrCode.CCFrontQREnabled"
                  :style="{
                    top: `${templateQrCode.CCFrontPassTop - 45}%`,
                    left: `${templateQrCode.CCFrontPassLeft}%`,
                    fontSize: templateQrCode.CCFrontPassSize + 'px',
                    textWrap: 'nowrap',
                  }"
                  class="position-absolute text-center"
                >
                  Pass Number: {{ prefix }}0{{
                    +printRangeStart + +card.number - 1
                  }}
                </div>
              </v-card>

              <!-- Back of the Credit Card (B) -->
              <v-card
                v-if="card.type === 'B'"
                border="dashed lg"
                class="ma-0 pa-0 credit-card-size-landscape"
              >
                <VuetifyViewer
                  class="credit-card-size-landscape"
                  :maxWidth="'8.27in'"
                  :value="templateQrCode.CCBackWysiwyg"
                  markdown-theme="github"
                />

                <qrcode-vue
                  v-if="templateQrCode.CCBackQREnabled"
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
                  v-if="templateQrCode.CCBackQREnabled"
                  :style="{
                    top: `${templateQrCode.CCBackPassTop - 45}%`,
                    left: `${templateQrCode.CCBackPassLeft}%`,
                    fontSize: templateQrCode.CCBackPassSize + 'px',
                    textWrap: 'nowrap',
                  }"
                  class="position-absolute text-center"
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
</template>

<script setup>
import QrcodeVue from "qrcode.vue";

const props = defineProps({
  paginatedCardData: Array,
  templateQrCode: Object,
  prefix: String,
  printRangeStart: Number,
});
onMounted(() => {
  console.log("templateQrCode 11", props.templateQrCode.CCOrientation);
});

const parseValue = (value) => parseFloat(value ?? 0);
</script>

<style scoped>
.a4-size {
  width: 21cm;
  height: 29.7cm;
  margin: 0;
  padding: 0;
}

@media print {
  .print-page {
    page-break-before: always;
    page-break-inside: avoid;
    break-inside: avoid;
  }
}

/* Credit Card Size */
.credit-card-size-landscape {
  width: 10.5cm;
  height: 6.8cm;
}
</style>
