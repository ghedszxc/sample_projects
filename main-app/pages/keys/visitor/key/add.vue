<template>
  <v-row no-gutters justify="center" class="py-md-8 h-100 h-md-auto">
    <v-col cols="12" xxl="4" xl="4" lg="5" class="font-weight-light mt-md-4">
      <v-card
        width="100%"
        height="100%"
        elevation="0"
        :style="$vuetify.display.smAndDown ? '' : 'border-width: thin'"
      >
        <v-form v-model="isKeyLogValid" @submit.prevent="submit()">
          <v-row no-gutters justify="center">
            <v-col cols="12" class="pa-4">
              <v-row no-gutters class="fill-height" align-content="center">
                <v-btn
                  fav
                  density="compact"
                  icon="mdi-arrow-left"
                  variant="text"
                  class="mt-1"
                  :to="{
                    name: 'keys-visitor',
                    query: {
                      site: mySite,
                    },
                  }"
                ></v-btn>
                <span
                  class="ml-2 text-h6 font-weight-bold text-capitalize"
                  style="letter-spacing: 2px !important"
                >
                  Create Keys
                </span>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>

            <v-col cols="12">
              <v-row no-gutters class="pa-8">
                <v-col cols="12" class="mb-2 font-weight-bold text-h6">
                  Key
                </v-col>
                <v-col cols="12" class="mb-2">
                  <div class="text-subtitle-1 text-medium-emphasis">
                    Area Name
                  </div>
                  <v-text-field
                    v-model="keyLog.name"
                    placeholder="Enter Area Name"
                    :persistent-hint="false"
                    density="comfortable"
                    :rules="[requiredInput]"
                    hint="Ex. Function Hall"
                    clearable
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="mb-2">
                  <div class="text-subtitle-1 text-medium-emphasis">Codes</div>
                  <v-text-field
                    v-model="newCode"
                    placeholder="Enter Code"
                    :persistent-hint="false"
                    density="comfortable"
                    hide-details
                    clearable
                    @keydown.enter="addCode(newCode)"
                  >
                    <template v-slot:append>
                      <v-btn
                        color="blue-darken-3"
                        block
                        variant="flat"
                        size="large"
                        @click="addCode(newCode)"
                      >
                        Add
                      </v-btn>
                    </template>
                  </v-text-field>

                  <div class="text-left py-3 text-h6">
                    <span
                      v-for="(key, idx) in keyLog.codes"
                      :key="idx"
                      class="text-primary"
                    >
                      <v-chip
                        class="mr-1"
                        color="primary"
                        variant="outlined"
                        closable
                        label
                      >
                        {{ key || "N/A" }}
                      </v-chip>
                    </span>
                  </div>
                </v-col>

                <v-col cols="12" class="mb-2">
                  <div class="text-subtitle-1 text-medium-emphasis">
                    ID Number
                  </div>
                  <v-text-field
                    v-model="idNumber"
                    placeholder="Enter ID Number"
                    :persistent-hint="false"
                    density="comfortable"
                    :rules="[requiredInput]"
                    clearable
                    disabled
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-row no-gutters>
                    <v-btn
                      block
                      class="font-weight-bold"
                      :disabled="!isKeyLogValid"
                      type="submit"
                      color="primary"
                    >
                      Add Key
                    </v-btn>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure", "site"],
});

const { setSnackbar } = useLocal();
const { requiredInput } = useUtils();
const { addKeyLog, setKey, keyLog, isKeyLogValid } = useKey();
const { getSitesOptionsForFiltering, mySite, myProvider } = useFilter();

const idNumber = ref(0);
const newCode = ref("");

onMounted(async () => {
  idNumber.value = new Date().getTime();
  setKey();
  await getSitesOptionsForFiltering();
});

function goBack() {
  useRouter().back();
}

async function cancel() {
  goBack();
}

async function addCode(data: string) {
  const sepatedByComma = data.split(",");

  // keyLog.value && keyLog.value.codes && keyLog.value.codes.push(sepatedByComma);
  keyLog.value &&
    keyLog.value.codes &&
    sepatedByComma
      .filter((find) => {
        return find;
      })
      .map((code) => {
        keyLog.value.codes?.push(code);
      });
  newCode.value = "";
}

async function submit() {
  try {
    keyLog.value.passType = "pass-key";
    keyLog.value.passId = String(idNumber.value);
    keyLog.value.site = mySite.value;
    keyLog.value.serviceProvider = myProvider.value;
    const result = await addKeyLog(keyLog.value);
    setSnackbar({ text: result, modal: true, type: "success" });
    goBack();
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}
</script>
