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
                  Edit
                </span>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>

            <v-col cols="12" v-if="isTabKeyOrPass == 'pass'">
              <v-row no-gutters class="pa-8">
                <v-col cols="12" class="mb-2">
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

                <v-col cols="12" class="mb-2">
                  <div class="text-subtitle-1 text-medium-emphasis">
                    ID Name
                  </div>
                  <v-text-field
                    v-model="keyLog.name"
                    placeholder="Enter ID Name"
                    :persistent-hint="false"
                    density="comfortable"
                    :rules="[requiredInput]"
                    hint="Ex. Inspector"
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
                      :loading="isUpdating"
                    >
                      update
                    </v-btn>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" v-else>
              <v-row no-gutters class="pa-6">
                <v-col cols="12" class="mb-0 pb-2">
                  <div class="text-subtitle-1 text-medium-emphasis">
                    ID Name
                  </div>
                  <v-text-field
                    variant="solo"
                    readonly
                    v-model="prefixWithCodes"
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
                      v-model="keyWithSequence.prefix"
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
                      v-model="keyWithSequence.keyNo"
                      placeholder="Key Number"
                      :persistent-hint="false"
                      density="comfortable"
                      :rules="[requiredInput]"
                      clearable
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-col cols="12" class="mb-0 pb-2">
                  <div class="text-subtitle-1 text-medium-emphasis">
                    Quantity
                  </div>
                  <v-text-field
                    v-model="keyWithSequence.qty"
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
                    v-model="keyWithSequence.location"
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
                    v-model="keyWithSequence.description"
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
                      :loading="isUpdating"
                    >
                      update
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
  updateKeyById,
  keyLog,
  isKeyLogValid,
  passTypes,
  getKeyById,
  setKey,
  getKeyWithSequence,
} = useKey();
const { tab } = usePassKey();
const { mySite } = useFilter();

const id = computed(() => useRoute().params.id as string);
const isTabKeyOrPass = computed(() => useRoute().query.tab);

const isUpdating = ref(false);
const keyWithSequence = reactive(keyLog);

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
  const isKeyExist = passTypes.value.find(
    (item: any) => item.value == "pass-key",
  );

  if (isTabKeyOrPass.value !== "pass") {
    const result = await getKeyWithSequence({
      site: mySite.value,
      _id: id.value,
    });

    keyWithSequence.value = result;
  } else {
    if (!isKeyExist) {
      passTypes.value.push({ title: "Pass Key", value: "pass-key" });
    }

    const passKey = await getKeyById(id.value);

    await setKey(passKey);
  }
});
watchEffect(() => {
  if (keyWithSequence.value.prefix) {
    keyWithSequence.value.prefix = keyWithSequence.value.prefix
      .replace(/[^A-Za-z]/g, "")
      .slice(0, 5)
      .toUpperCase();
  } else if (
    keyWithSequence.value.name &&
    keyWithSequence.value.name.trim() !== ""
  ) {
    keyWithSequence.value.prefix = keyWithSequence.value.name
      .replace(/[^A-Za-z]/g, "")
      .slice(0, 5)
      .toUpperCase();
  }
});

const prefixWithCodes = computed(() => {
  return `${keyWithSequence.value.prefix ? keyWithSequence.value.prefix.toUpperCase() : ""}${keyWithSequence.value.keyNo || ""}`;
});

async function submit() {
  isUpdating.value = true;
  try {
    delete keyLog.value._id;
    let result;
    if (isTabKeyOrPass.value == "pass") {
      result = await updateKeyById(id.value, {
        ...keyLog.value,
        site: mySite.value,
      });
    } else {
      const name = prefixWithCodes.value;

      result = await updateKeyById(id.value, {
        ...keyWithSequence.value,
        site: mySite.value,
        name,
      });
    }

    // if (!result.acknowledged) {
    //   setSnackbar({ text: "Failed to update", modal: true, type: "warning" });
    //   return;
    // }

    if (result !== "Successfully updated.") {
      setSnackbar({ text: "Failed to update", modal: true, type: "warning" });
      return;
    }
    setSnackbar({ text: "Successfully updated", modal: true, type: "success" });
    goBack();
  } catch (error: any) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
  isUpdating.value = false;
}

function goBack() {
  useRouter().push({
    name: "keys-visitor",
    query: {
      site: mySite.value,
    },
  });
}
</script>
