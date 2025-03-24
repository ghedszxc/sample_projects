<template>
  <v-row no-gutters class="pa-8 h-100">
    <g-card :loading="isTableLoading">
      <v-row no-gutters>
        <v-col cols="12">
          <v-row no-gutters class="pa-4" justify="space-between">
            <v-col cols="12" md="6" lg="7">
              <v-row no-gutters align="center">
                <v-col cols="12" md="8" v-if="$vuetify.display.smAndDown">
                  <span class="font-weight-bold text-h6">
                    DOB Subject Configuration
                  </span>
                </v-col>

                <v-col cols="12" md="8" class="d-flex">
                  <span
                    class="font-weight-bold text-h6 mr-6 pt-1"
                    v-if="$vuetify.display.mdAndUp"
                  >
                    DOB Subject Configuration
                  </span>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" md="6" lg="5">
              <v-row align="center" justify="end">
                <v-col
                  cols="12"
                  md="8"
                  lg="8"
                  :class="{ 'mb-5': $vuetify.display.smAndDown }"
                >
                  <search-text-field
                    @on-search="onSearch($event)"
                    @clear-search="callItBack"
                  ></search-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>

        <v-divider></v-divider>
        <!-- form -->
        <v-col cols="12">
          <v-row no-gutters style="min-height: 700px">
            <v-col
              cols="12"
              md="4"
              class="border-e-sm"
              v-if="$ability.can('create', 'create-dob-service-config')"
            >
              <v-row no-gutters class="mt-4 h-100 border-e-sm">
                <v-card class="px-3 w-100" elevation="0">
                  <v-card-text>
                    <v-row no-gutters class="h-100 align-center">
                      <v-form
                        class="w-100"
                        v-model="isSubjectValid"
                        @submit.prevent="submit()"
                      >
                        <v-col cols="12">
                          <v-row class="justify-center mb-7 mr-3">
                            <v-img
                              src="/images/log-subject/to-do.svg"
                              width="180px"
                              height="190px"
                            ></v-img>
                          </v-row>

                          <v-responsive class="mx-auto">
                            <v-col
                              cols="12"
                              class="font-weight-bold text-h5 mb-3"
                            >
                              <v-row no-gutters> Add Subjects </v-row>
                            </v-col>

                            <v-col cols="12">
                              <v-text-field
                                v-model="logSubject.subject"
                                density="comfortable"
                                hint=""
                                label="Subject Title"
                                :rules="[requiredInput]"
                                placeholder="Enter subject title"
                                :persistent-hint="false"
                              ></v-text-field>
                            </v-col>

                            <v-col
                              cols="12"
                              v-if="
                                $ability.can(
                                  'create',
                                  'create-dob-service-config',
                                )
                              "
                            >
                              <v-row no-gutters justify="center">
                                <v-col cols="12">
                                  <v-btn
                                    color="#1867C0"
                                    type="submit"
                                    class="py-4 w-100 rounded-lg"
                                    height="52px"
                                    :disabled="!isSubjectValid"
                                  >
                                    Add Subject
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-responsive>
                        </v-col>
                      </v-form>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-row>
            </v-col>

            <v-col
              cols="12"
              :md="
                $ability.can('create', 'create-dob-service-config') ? '8' : '12'
              "
            >
              <v-data-iterator :items="logSubjects" :items-per-page="-1">
                <template v-slot:header>
                  <v-list density="compact" v-if="$vuetify.display.mdAndUp">
                    <v-list-item class="pt-4 px-8">
                      <v-list-item-title>
                        <v-row no-gutters class="pb-4">
                          <v-col
                            v-for="(col, idx) in columnHeader"
                            :key="idx"
                            cols="12"
                            :md="col.md"
                            :class="
                              col.class
                                ? col.class
                                : 'text-capitalize white--text text'
                            "
                          >
                            <v-row
                              no-gutters
                              class="fill-height"
                              align-content="center"
                            >
                              <span
                                class="d-inline-block text-truncate text-capitalize"
                              >
                                {{ col.title }}
                              </span>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-list-item-title>
                    </v-list-item>
                    <v-divider />
                  </v-list>
                </template>

                <template v-if="$vuetify.display.mdAndUp" #default="{ items }">
                  <v-list class="pa-0">
                    <template
                      v-for="(item, itemIndex) in items"
                      :key="item.raw._id"
                    >
                      <v-list-item class="py-4 px-8">
                        <v-list-item-title>
                          <v-row no-gutters>
                            <v-col
                              cols="12"
                              md="3"
                              class="text-capitalize white--text text d-flex align-center"
                            >
                              {{ item.raw.subject }}
                            </v-col>

                            <v-col
                              cols="12"
                              md="4"
                              class="text-capitalize white--text"
                            >
                              <v-row
                                no-gutters
                                class="fill-height d-flex justify-left"
                              >
                                <v-avatar
                                  size="small"
                                  :color="
                                    stringToColor(
                                      typeof item.raw.addedBy === 'object'
                                        ? `${item.raw.addedBy?.givenName} ${item.raw.addedBy?.surname}`
                                        : '',
                                    )
                                  "
                                  class="mr-4"
                                >
                                  {{ getInitial(item.raw.addedBy.givenName) }}
                                </v-avatar>
                                <span
                                  class="text-truncate mt-1"
                                  :style="{
                                    maxWidth: $vuetify.display.lgAndUp
                                      ? '180px'
                                      : '160px',
                                  }"
                                >
                                  {{ item.raw.addedBy.givenName }}
                                  {{ item.raw.addedBy.surname }}
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              md="3"
                              class="text-capitalize white--text text d-flex align-center"
                            >
                              {{
                                formatDateAndTimeSG(item.raw.createdAt, true)
                              }}
                            </v-col>

                            <v-col
                              cols="12"
                              md="2"
                              class="text-capitalize white--text text text-left"
                              v-if="
                                $ability.can(
                                  'delete',
                                  'delete-dob-service-config',
                                )
                              "
                            >
                              <v-btn
                                variant="plain"
                                @click="showDeleteModal(item.raw)"
                              >
                                <v-icon color="red"
                                  >mdi-trash-can-outline</v-icon
                                >
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider
                        v-if="itemIndex + 1 !== items.length"
                      ></v-divider>
                    </template>
                  </v-list>
                </template>

                <template v-else #default="{ items }">
                  <v-list class="pa-0">
                    <template
                      v-for="(item, itemIndex) in items"
                      :key="item.raw._id"
                    >
                      <v-list-item class="py-4 px-8">
                        <v-list-item-title>
                          <v-row no-gutters>
                            <v-col
                              cols="6"
                              md="2"
                              class="pa-2 text-capitalize white--text font-weight-bold"
                            >
                              <span>Title</span>
                            </v-col>
                            <v-col
                              cols="6"
                              md="10"
                              class="pa-2 text-capitalize white--text d-flex justify-start pl-4"
                            >
                              <span>{{ item.raw.subject }}</span>
                            </v-col>
                          </v-row>
                          <v-row no-gutters>
                            <v-col
                              cols="6"
                              md="2"
                              class="pa-2 text-capitalize white--text text font-weight-bold"
                            >
                              <span>Added By</span>
                            </v-col>
                            <v-col
                              cols="6"
                              md="10"
                              class="pa-2 text-capitalize white--text text d-flex justify-start"
                            >
                              <div class="fill-height d-flex align-center">
                                <span
                                  class="d-flex align-center"
                                  style="
                                    white-space: normal;
                                    overflow-wrap: break-word;
                                    text-align: center;
                                    margin: auto;
                                  "
                                  :style="{
                                    maxWidth: $vuetify.display.lgAndUp
                                      ? '180px'
                                      : '160px',
                                  }"
                                  ><v-avatar
                                    size="small"
                                    :color="
                                      stringToColor(
                                        typeof item.raw.addedBy === 'object'
                                          ? `${item.raw.addedBy?.givenName} ${item.raw.addedBy?.surname}`
                                          : '',
                                      )
                                    "
                                    class="mr-2"
                                  >
                                    {{ getInitial(item.raw.addedBy.givenName) }}
                                  </v-avatar>
                                  {{ item.raw.addedBy.givenName }}
                                  {{ item.raw.addedBy.surname }}
                                </span>
                              </div>
                            </v-col>
                          </v-row>
                          <v-row no-gutters>
                            <v-col
                              cols="6"
                              md="2"
                              class="pa-2 text-bold text font-weight-bold"
                            >
                              <span>Date Created</span>
                            </v-col>
                            <v-col
                              cols="6"
                              md="10"
                              class="pa-2 text-capitalize white--text text d-flex justify-start pl-4"
                            >
                              <span
                                style="
                                  white-space: normal;
                                  overflow-wrap: break-word;
                                "
                              >
                                {{ formatDateAndTimeSG(item.raw.createdAt) }}
                              </span>
                            </v-col>
                          </v-row>
                          <v-row no-gutters>
                            <v-col
                              cols="6"
                              md="2"
                              class="pa-2 text-capitalize white--text text font-weight-bold"
                            >
                            </v-col>
                            <v-col
                              cols="6"
                              md="10"
                              class="text-capitalize white--text d-flex justify-start px-0"
                            >
                              <v-btn
                                variant="plain"
                                @click="showDeleteModal(item.raw)"
                                class="d-flex justify-start"
                              >
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon color="red" v-bind="attrs" v-on="on"
                                      >mdi-trash-can-outline</v-icon
                                    >Delete
                                  </template>
                                  <span>Delete Item</span>
                                </v-tooltip>
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider
                        v-if="itemIndex + 1 !== items.length"
                      ></v-divider>
                    </template>
                  </v-list>
                </template>
              </v-data-iterator>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </g-card>

    <v-dialog max-width="500" v-model="isShowDeleteModal" persistent>
      <v-card class="rounded-xl">
        <v-toolbar color="white">
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" @click="isShowDeleteModal = false"></v-btn>
        </v-toolbar>

        <v-card-text>
          <v-row class="justify-center mb-7 mt-3">
            <v-img
              src="/images/log-subject/to-do.svg"
              width="150px"
              height="150px"
            ></v-img>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" class="text-center">
              <span class="font-weight-bold"
                >Are you sure you want to <br />delete this subject</span
              >
            </v-col>

            <v-col cols="12" class="text-center">
              <v-btn
                color="#1867C0"
                type="submit"
                class="my-4 w-100 rounded-lg"
                height="40px"
                @click="_deleteSubject()"
              >
                Confirm
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

const { formatDateAndTime, requiredInput, formatDateAndTimeSG, stringToColor } =
  useUtils();
const { inviteUser, currentUser } = useLocalAuth();
const { getInitial, materialColors } = useUtils();
const { setSnackbar } = useLocal();
const { $ability } = useNuxtApp();
definePageMeta({
  middleware: "secure",
});

const {
  logSubject,
  logSubjects,
  search,
  dateSelected,
  isTableLoading,
  isSubjectValid,
  addSubject,
  deleteSubject,
  setLogSubject,
  setLogSubjects,
} = useLogSubject();

const selectDateFrom = ref(new Date());
const isShowDeleteModal = ref(false);
const columnHeader = computed(() => {
  return [
    {
      md: "3",
      title: "Title",
    },
    {
      md: "4",
      title: "Added By",
    },
    {
      md: "3",
      title: "Date Created",
    },
    {
      md: "2",
      title: "Actions",
    },
  ];
});
const { getSitesOptionsForFiltering, siteOptions, filterSite, mySite } =
  useFilter();
const route = useRoute();

onMounted(async () => {
  const collabSite = await getSitesOptionsForFiltering();

  console.log($ability.can("read", "view-dob-service-config"));

  await setLogSubjects({
    site: mySite.value,
  });
});

const onSearch = async (_search: string) => {
  search.value = _search;
  await setLogSubjects({
    site: mySite.value,
  });
};

const callItBack = async () => {
  search.value = "";
  await setLogSubjects({
    site: mySite.value,
  });
};

async function submit() {
  try {
    logSubject.value.site = mySite.value;
    logSubject.value.addedBy = currentUser.value._id;
    await addSubject(logSubject.value);
    await setLogSubjects({
      site: mySite.value,
    });

    setLogSubject();
    await setSnackbar({
      text: "Successfully created subject",
      modal: true,
      type: "success",
    });
  } catch (error) {
    await setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}

async function showDeleteModal(value: any) {
  setLogSubject(value);
  isShowDeleteModal.value = true;
}

async function _deleteSubject() {
  const subjectId = logSubject.value._id;
  try {
    await deleteSubject(String(subjectId));
    setSnackbar({
      text: "Successfully deleted subject",
      modal: true,
      type: "success",
    });
    await setLogSubjects({
      site: mySite.value,
    });
  } catch (error: any) {
    setSnackbar({
      text: error || error.message || "Unable to delete subject.",
      modal: true,
      type: "error",
    });
  } finally {
    isShowDeleteModal.value = false;
  }
}
</script>

<style scoped>
.text {
  text-align: start;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
}

:deep() .v-field__field {
  font-size: 14px;
}
</style>
