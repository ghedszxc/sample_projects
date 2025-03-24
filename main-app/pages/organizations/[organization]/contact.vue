<template>
  <v-row no-gutters justify="center" class="py-8">
    <v-col cols="12" xxl="4" xl="4" lg="5" class="font-weight-light mt-4">
      <v-card width="100%" elevation="0" style="border-width: thin">
        <v-form v-model="isOrganizationValid" @submit.prevent="submit()">
          <v-row no-gutters justify="center">
            <v-col cols="12" class="pa-4">
              <v-row no-gutters class="fill-height" align-content="center">
                <v-btn
                  fav
                  density="compact"
                  icon="mdi-chevron-left"
                  size="small"
                  variant="text"
                  class="mt-2"
                  @click="goBack()"
                >
                </v-btn>
                <span
                  class="ml-3 text-h6 font-weight-bold text-capitalize"
                  style="letter-spacing: 2px !important"
                >
                  {{ organization.name }}
                </span>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>

            <v-col cols="12">
              <v-row no-gutters class="pa-8">
                <v-col cols="12" class="mb-8">
                  <v-img
                    src="/images/organization-phone.svg"
                    height="150px"
                  ></v-img>
                </v-col>
                <v-col cols="12" class="mb-4">
                  <div class="text-subtitle-1 text-medium-emphasis">
                    Contact Number
                  </div>
                  <v-text-field
                    placeholder="Enter valid contact number"
                    :persistent-hint="false"
                    :readonly="
                      $ability.can('read', 'view-organizations') &&
                      !$ability.can('update', 'edit-organizations')
                    "
                    v-model="contactNumber"
                    density="comfortable"
                    :rules="[requiredInput]"
                    :clearable="$ability.can('update', 'edit-organizations')"
                  >
                    <template v-slot:prepend-inner>
                      <v-menu location="bottom">
                        <template #activator="{ props }">
                          <v-btn v-bind="props" flat size="small">
                            {{ contactCountryCode }}
                            <v-icon class="ml-2">mdi-chevron-down</v-icon>
                          </v-btn>
                        </template>

                        <v-list
                          class="pa-0"
                          density="compact"
                          :style="{
                            height: !searchCountryCode ? '300px' : 'auto',
                          }"
                        >
                          <v-list-item>
                            <v-text-field
                              v-model="searchCountryCode"
                              density="compact"
                              label="Search by country name"
                              class="my-3"
                              hide-details
                              @click.stop=""
                            ></v-text-field>
                            <v-divider></v-divider>
                          </v-list-item>

                          <template
                            v-for="(item, key) in countryCodes.filter((find) =>
                              searchCountryCode
                                ? find.name
                                    .toLocaleLowerCase()
                                    .includes(
                                      searchCountryCode.toLocaleLowerCase(),
                                    )
                                : find,
                            )"
                            :key="key"
                          >
                            <v-list-item
                              @click="onSelectCountryCode(item)"
                              :subtitle="item.name"
                            >
                              {{ item.code }}
                            </v-list-item>
                          </template>
                        </v-list>
                      </v-menu>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  v-if="$ability.can('update', 'edit-organizations')"
                >
                  <v-row no-gutters>
                    <v-btn
                      block
                      class="font-weight-bold"
                      :disabled="!isOrganizationValid"
                      type="submit"
                      color="primary"
                    >
                      Update
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
  middleware: ["secure", "organization"],
});
const { $ability } = useNuxtApp();
const { requiredInput, searchCountryCode, selectedCountryCode, countryCodes } =
  useUtils();
const { organization, isOrganizationValid, updateOrgContactById } =
  useOrganization();

const org = computed(() => organization.value);
const contactNumber = ref<string>("");
const contactCountryCode = ref<string>("");

const removeCountryCodeAndFirstDigit = (number: string): string => {
  for (const country of countryCodes) {
    const countryCodeWithoutSpaces = country.code.replace(/\s+/g, "");
    const regex = new RegExp(`^${escapeRegExp(countryCodeWithoutSpaces)}`);
    if (regex.test(number)) {
      contactCountryCode.value = country.code;
      const withoutCountryCode = number.replace(regex, "");
      const finalNumber = withoutCountryCode;
      return finalNumber;
    }
  }
  return number;
};
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
onMounted(async () => {
  const fullContactNumber = (org.value.contactNumber || "").replace(/\s+/g, "");
  contactNumber.value = removeCountryCodeAndFirstDigit(fullContactNumber);
});

function goBack() {
  useRouter().back();
}

async function submit() {
  const finalContactNumber = `${selectedCountryCode.value} ${contactNumber.value}`;
  await updateOrgContactById({
    _id: organization.value._id as string,
    contactNumber: finalContactNumber,
  });
  goBack();
}

async function onSelectCountryCode(data: any) {
  selectedCountryCode.value = data.code;
  contactCountryCode.value = data.code;
  searchCountryCode.value = "";
}
</script>
