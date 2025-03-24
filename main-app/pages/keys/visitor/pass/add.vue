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
                  @click="dialog = false"
                ></v-btn>
                <span
                  class="ml-2 text-h6 font-weight-bold text-capitalize"
                  style="letter-spacing: 2px !important"
                >
                  Create {{ isTabKeyOrPass }}
                </span>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>

            <v-col cols="12" v-if="isTabKeyOrPass == 'pass'">
              <v-row no-gutters class="pa-8">
                <v-col cols="12" class="mb-2" v-if="isTabKeyOrPass == 'pass'">
                  <div class="text-subtitle-1 text-medium-emphasis">Type</div>
                  <v-select
                    v-model="keyLog.passType"
                    density="comfortable"
                    :items="passTypes.filter((type) => type.value !== null)"
                    hide-details
                    :rules="[requiredInput]"
                  >
                  </v-select>
                </v-col>

                <v-col
                  cols="12"
                  class="mb-0 pb-0"
                  v-if="isTabKeyOrPass == 'pass'"
                >
                  <div class="text-subtitle-1 text-medium-emphasis">
                    ID Name
                  </div>
                  <v-text-field
                    v-model="keyLog.name"
                    placeholder="Enter ID Name"
                    :persistent-hint="false"
                    density="comfortable"
                    :rules="[requiredInput]"
                    clearable
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
                      :loading="isAdding"
                    >
                      add
                    </v-btn>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" v-else>
              <v-row no-gutters class="pa-6">
                <v-row no-gutters class="mt-0 pt-0">
                  <v-row no-gutters class="d-flex align-center">
                    <v-switch
                      class="pr-2"
                      v-model="isRetain"
                      color="success"
                      label="Retain"
                      hide-details
                    ></v-switch>
                    <v-btn color="primary" @click="clear" rounded="lg"
                      >Reset</v-btn
                    ></v-row
                  >

                  <v-col
                    :cols="$vuetify.display.xs ? 12 : 6"
                    :class="{ 'pl-1': !$vuetify.display.xs }"
                    class="pb-0 mb-0"
                  >
                  </v-col>
                </v-row>
                <v-col cols="12" class="mb-0 pb-2">
                  <div class="text-subtitle-1 text-medium-emphasis">
                    ID Name
                  </div>
                  <v-text-field
                    variant="solo"
                    readonly
                    v-model="prefixKey"
                    placeholder="Enter Prefix"
                    :persistent-hint="false"
                    density="comfortable"
                    :rules="[requiredInput]"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-row no-gutters class="mt-0 pt-0">
                  <v-col :cols="$vuetify.display.xs ? 12 : 6" class="pb-0 mb-0">
                    <div class="text-subtitle-1 text-medium-emphasis">
                      Prefix
                    </div>
                    <v-text-field
                      v-model="prefix"
                      placeholder="Enter Prefix"
                      :persistent-hint="false"
                      density="comfortable"
                      :rules="[lettersOnly, requiredInput, maxLength]"
                      hint="Maximun of 5 characters"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col
                    :cols="$vuetify.display.xs ? 12 : 6"
                    :class="{ 'pl-1': !$vuetify.display.xs }"
                    class="pb-0 mb-0"
                  >
                    <div class="text-subtitle-1 text-medium-emphasis">No</div>
                    <v-text-field
                      v-model="keyNumber"
                      placeholder="Key Number"
                      :persistent-hint="false"
                      density="comfortable"
                      :rules="[requiredInput]"
                      hint="Ex. Inspector"
                      clearable
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-col cols="12" class="mb-0 pb-2">
                  <div class="text-subtitle-1 text-medium-emphasis">
                    Quantity
                  </div>
                  <v-text-field
                    v-model="quantity"
                    placeholder="1"
                    hide-details
                    density="comfortable"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="mb-0 pb-0">
                  <div class="text-subtitle-1 text-medium-emphasis">
                    Location
                  </div>
                  <v-text-field
                    v-model="location"
                    placeholder="Enter location"
                    :persistent-hint="false"
                    density="comfortable"
                    :rules="[requiredInput]"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="mb-0 pb-0">
                  <div class="text-subtitle-1 text-medium-emphasis">
                    Description
                  </div>
                  <v-textarea
                    v-model="description"
                    placeholder="Enter Description"
                    :persistent-hint="false"
                    density="comfortable"
                    :rules="[requiredInput]"
                    clearable
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-btn
                      block
                      class="font-weight-bold"
                      :disabled="!isKeyLogValid"
                      type="submit"
                      color="primary"
                      :loading="isAdding"
                    >
                      add
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
const {
  setKey,
  addKeyLog,
  keyLog,
  isKeyLogValid,
  passTypes,
  getCountTotalKeys,
} = useKey();
const { tab, dialog } = usePassKey();
const { mySite, myProvider } = useFilter();

const isAdding = ref(false);
const keyNumber = ref("");

const idNumber = ref<number>(0);
const quantity = ref<number>();
const location = ref<string>("");
const description = ref<string>("");
const prefix = ref<string>("");
const isRetain = ref<boolean>(true);

const isTabKeyOrPass = computed(() => useRoute().query.tab);
watchEffect(async () => {
  const newValue = isTabKeyOrPass.value;

  if (newValue !== "pass" && newValue !== "key") {
    await useRouter().push({
      path: "/keys/visitor",
      query: { site: mySite.value },
    });
  }
});
onMounted(async () => {
  setKey();

  keyNumber.value = String(await getCountTotalKeys({ site: mySite.value }));

  idNumber.value = new Date().getTime();

  if (isTabKeyOrPass.value !== "key") {
    passTypes.value = passTypes.value.filter(
      (passKey: any) => passKey.value !== "pass-key",
    );
  } else {
    passTypes.value = [{ title: "Key", value: "pass-key" }];
    keyLog.value.passType = passTypes.value[0];
  }
});

const prefixKey = computed(
  () =>
    `${prefix.value ? prefix.value.toUpperCase() : ""}${keyNumber.value || ""}`,
);

watchEffect(() => {
  if (prefix.value) {
    prefix.value = prefix.value
      .replace(/[^A-Za-z]/g, "")
      .slice(0, 5)
      .toUpperCase();
  }
});
const lettersOnly = (v) =>
  /^[A-Za-z]+$/.test(v) || "Input must be letters only";
const maxLength = (v) => v.length <= 5 || "Input must be 5 characters or less";

async function submit() {
  isAdding.value = true;

  try {
    if (isTabKeyOrPass.value !== "pass") {
      keyLog.value.nextNumber = Number(keyNumber.value);
      keyLog.value.qty = quantity.value;
      keyLog.value.location = location.value;
      keyLog.value.description = description.value;
      keyLog.value.name = prefixKey.value;
      keyLog.value.passType = "pass-key";
      keyLog.value.site = mySite.value;
      keyLog.value.prefix = prefix.value;
      const result: any = await addKeyLog(keyLog.value);

      if (!isRetain.value) {
        quantity.value = null;
        location.value = "";
        description.value = "";
        prefix.value = "";
      }

      setSnackbar({ text: result, modal: true, type: "success" });

      keyNumber.value = String(await getCountTotalKeys({ site: mySite.value }));
    } else {
      keyLog.value.passId = String(idNumber.value);
      keyLog.value.site = mySite.value;
      keyLog.value.serviceProvider = myProvider.value;
      const result = await addKeyLog(keyLog.value);
      setSnackbar({ text: result, modal: true, type: "success" });

      goBack();
    }
  } catch (error) {
    if (
      error &&
      error ==
        "The No. has been updated with to a new one. Click Add button again"
    ) {
      setSnackbar({ text: error as string, modal: true, type: "error" });
      keyNumber.value = String(await getCountTotalKeys({ site: mySite.value }));
    } else {
      setSnackbar({ text: error as string, modal: true, type: "error" });
    }
  }
  isAdding.value = false;
}

const clear = () => {
  location.value = "";
  description.value = "";
  prefix.value = "";
};

function goBack() {
  useRouter().push({
    name: "keys-visitor",
    query: {
      site: mySite.value,
    },
  });
}
</script>
