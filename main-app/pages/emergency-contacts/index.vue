<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card
        width="100%"
        elevation="3"
        height="100%"
        :loading="isEmergencyContactLoaded"
      >
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            color="deep-purple"
            height="4"
            indeterminate
          ></v-progress-linear>
        </template>

        <v-row no-gutters>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12">
                <v-data-iterator
                  :items="emergencyContacts"
                  :items-per-page="itemsPerPage"
                  :search="search"
                >
                  <template v-slot:header>
                    <v-row no-gutters class="pa-4 fill-height" align="center">
                      <v-col cols="12" md="6">
                        <v-row>
                          <v-col cols="12" v-if="$vuetify.display.smAndDown">
                            <span class="font-weight-bold text-h6">
                              Emergency Contacts
                            </span>
                          </v-col>

                          <v-col
                            cols="12"
                            md="11"
                            :class="`d-flex ${$vuetify.display.smAndDown && 'mb-4'}`"
                          >
                            <span
                              class="font-weight-bold text-h6 mr-3 pt-1"
                              v-if="$vuetify.display.mdAndUp"
                            >
                              Emergency Contacts
                            </span>

                            <v-text-field
                              v-model="search"
                              placeholder="Search"
                              hide-details
                              density="compact"
                              @input="searchEmergencyContact"
                              append-inner-icon="mdi-magnify"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-row>
                          <v-col cols="6" md="6">
                            <v-btn
                              color="blue-darken-3"
                              block
                              variant="flat"
                              size="small"
                              style="height: 40px"
                              @click="manageEmergencyContacts"
                            >
                              <span v-if="$vuetify.display.smAndUp"
                                >Manage</span
                              >
                              Categories
                            </v-btn>
                          </v-col>

                          <v-col cols="6" md="6">
                            <v-btn
                              color="blue-darken-3"
                              block
                              variant="flat"
                              size="small"
                              style="height: 40px"
                              @click="addEmergencyContact"
                            >
                              Add
                              <span v-if="$vuetify.display.mdAndUp"
                                >Emergency Contact</span
                              >
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>

                    <v-divider />

                    <v-list
                      class="pa-0"
                      density="compact"
                      v-if="$vuetify.display.smAndUp"
                    >
                      <v-list-item class="px-8">
                        <v-list-item-title>
                          <v-row no-gutters>
                            <v-col cols="1">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Icon
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Title
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Contact Number
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="2">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Category
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Date
                                </span>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider />
                    </v-list>
                  </template>

                  <template #default="{ items }">
                    <v-list class="pa-0">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="itemIndex"
                      >
                        <v-list-item class="pt-2 pb-1 px-8">
                          <v-list-item-title>
                            <v-row no-gutters align="center">
                              <v-col cols="15" sm="1" class="mb-2 mb-sm-0">
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  <v-icon size="x-large">
                                    <v-img
                                      :src="`/icons/emergency-contact/${theme === 'dark' ? 'dark' : 'light'}/${item.raw.icon}`"
                                      cover
                                    ></v-img>
                                  </v-icon>
                                </v-row>
                              </v-col>

                              <v-col cols="15" sm="3" class="mb-2 mb-sm-0">
                                <v-row
                                  no-gutters
                                  class="fill-height mr-1"
                                  align-content="center"
                                >
                                  <span
                                    class="d-flex align-center text-truncate text-capitalize text-body-2"
                                  >
                                    <v-icon class="mr-1" color="red"
                                      >mdi-bullhorn-outline</v-icon
                                    >
                                    <span class="text-truncate">
                                      {{ item.raw.title }}
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col cols="15" sm="3" class="mb-2 mb-sm-0">
                                <v-row
                                  no-gutters
                                  class="fill-height mr-1"
                                  align-content="center"
                                >
                                  <span
                                    class="d-flex align-center text-truncate text-capitalize text-body-2"
                                  >
                                    <v-icon class="mr-1">mdi-cellphone</v-icon>
                                    <span class="text-truncate">
                                      {{ item.raw.phoneNumber }}
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col cols="15" sm="2" class="mb-2 mb-sm-0">
                                <v-row
                                  no-gutters
                                  class="fill-height mr-1"
                                  align-content="center"
                                >
                                  <span
                                    class="d-flex align-center text-truncate text-capitalize text-body-2"
                                  >
                                    <v-icon class="mr-1" color="primary"
                                      >mdi-sign-text</v-icon
                                    >
                                    <span class="text-truncate">
                                      {{ item.raw.categoryName }}
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col cols="15" sm="3" class="mb-2 mb-sm-0">
                                <v-row
                                  no-gutters
                                  class="fill-height text-truncate mr-4"
                                  align-content="center"
                                >
                                  <span
                                    class="d-flex align-center text-truncate text-capitalize text-body-2"
                                  >
                                    <v-icon class="mr-1" color="green"
                                      >mdi-calendar-range</v-icon
                                    >
                                    <span class="text-truncate">
                                      {{
                                        standardFormatDateTime(
                                          new Date(item.raw.createdAt),
                                        )
                                      }}
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>
                            </v-row>
                          </v-list-item-title>

                          <template v-slot:append>
                            <v-menu location="bottom">
                              <template #activator="{ props }">
                                <v-btn
                                  v-bind="props"
                                  icon
                                  flat
                                  size="x-small"
                                  class="border-md"
                                  style="position: absolute; right: 10px"
                                >
                                  <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                              </template>

                              <v-card>
                                <v-list density="compact" class="pa-0">
                                  <v-list-item
                                    class="text-caption"
                                    @click="viewEmergencyContact(item.raw)"
                                  >
                                    View
                                  </v-list-item>
                                  <v-list-item
                                    class="text-caption"
                                    @click="editEmergencyContact(item.raw)"
                                  >
                                    Edit
                                  </v-list-item>
                                  <v-list-item
                                    class="text-caption"
                                    @click="deleteEmergencyContact(item.raw)"
                                  >
                                    Delete
                                  </v-list-item>
                                </v-list>
                              </v-card>
                            </v-menu>
                          </template>
                        </v-list-item>

                        <v-divider v-if="itemIndex + 1 !== items.length" />
                      </template>
                    </v-list>
                  </template>

                  <template #no-data>
                    <v-row no-gutters justify="center" class="pa-16">
                      <v-col cols="12">
                        <v-row no-gutters justify="center">
                          <v-img
                            src="/empty.svg"
                            width="100px"
                            height="100px"
                          ></v-img>
                        </v-row>
                      </v-col>

                      <v-col cols="12">
                        <v-row no-gutters justify="center">
                          <span class="font-weight-bold">
                            You don't have any emergency contact yet.
                          </span>
                        </v-row>
                      </v-col>
                    </v-row>
                  </template>
                </v-data-iterator>
              </v-col>
            </v-row>
          </v-col>

          <v-divider></v-divider>

          <v-col cols="12" class="pa-4">
            <v-row no-gutters justify="end" align-content="center">
              <span>{{ pageRange }}</span>
              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="canPrevPage"
                @click="
                  prevPage({
                    site: mySite,
                    organization: currentUser.organization,
                  })
                "
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="!canNextPage"
                @click="
                  nextPage({
                    site: mySite,
                    organization: currentUser.organization,
                  })
                "
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>

  <EmergencyContactsCategoryManage />
  <EmergencyContactsAdd />
  <EmergencyContactsDelete />
  <EmergencyContactsEdit />
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

definePageMeta({
  middleware: "secure",
});

const { theme } = useLocal();

const { currentUser } = useLocalAuth();
const { getInitial, materialColors, standardFormatDateTime } = useUtils();
const { organizations, setOrganizations } = useOrganization();
const { sites, setSites } = useSite();
const {
  isEmergencyContactLoaded,
  setEmergencyContact,
  setEmergencyContacts,
  emergencyContacts,
  itemsPerPage,
  // page,
  pageRange,
  canNextPage,
  nextPage,
  canPrevPage,
  prevPage,
  searchEmergencyContacts,
  addEmergencyContactDialog,
  deleteEmergencyContactDialog,
  editEmergencyContactDialog,
  getAllEmergencyCategories,
  manageEmergencyContactCategories,
} = useEmergencyContact();
const { getSitesOptionsForFiltering, siteOptions, filterSite, mySite } =
  useFilter();

const search = ref("");

async function searchEmergencyContact() {
  debouncedSearch();
}
const debouncedSearch = debounce(async () => {
  await searchEmergencyContacts({
    search: search.value,
    site: mySite.value!,
  });
}, 1000);

onMounted(async () => {
  setEmergencyContact();
  emergencyContacts.value = [];
  await getAllEmergencyCategories(mySite.value);
  await setEmergencyContacts(mySite.value);
});

function addEmergencyContact() {
  addEmergencyContactDialog.value = true;
  setEmergencyContact();
}

async function viewEmergencyContact(data: TEmergencyContact) {
  addEmergencyContactDialog.value = true;
  setEmergencyContact(data);
}

async function editEmergencyContact(data: TEmergencyContact) {
  editEmergencyContactDialog.value = true;
  setEmergencyContact(data);
}

async function deleteEmergencyContact(data: TEmergencyContact) {
  deleteEmergencyContactDialog.value = true;
  setEmergencyContact(data);
}

async function manageEmergencyContacts() {
  manageEmergencyContactCategories.value = true;
}
</script>

<style scoped>
:deep() .v-text-field input {
  font-size: 13px;
}

:deep() .v-field__field {
  font-size: 13px;
}

.text {
  text-align: start;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
}

.rows-per-page :deep() .v-field__outline {
  --v-field-border-width: 0;
  --v-field-border-opacity: 0;
  border-bottom: 0.1px solid;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  width: 50px;
  margin-left: 16px;
}
</style>
