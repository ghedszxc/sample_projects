<template>
  <v-dialog max-width="1500" v-model="isShowDialog" persistent>
    <v-card class="rounded-xl" min-height="600px">
      <v-toolbar>
        <v-toolbar-title>
          <span class="text-h6 d-none d-md-inline-flex">
            Pending Invited Members
          </span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-row align="center" justify="end" class="w-100 w-md-auto">
          <v-col cols="12" md="6" lg="6">
            <search-text-field
              @on-search="onSearch($event)"
              @clear-search="callItBack"
            ></search-text-field>
          </v-col>
        </v-row>
        <v-btn icon="mdi-close" @click="emit('onHideDialog')"></v-btn>
      </v-toolbar>
      <v-divider></v-divider>

      <v-card-text class="py-0 px-1 overflow-auto" style="max-height: 800px">
        <g-card :loading="isLoading" :elevation="0">
          <v-divider></v-divider>
          <v-row class="my-1">
            <v-col cols="12" class="px-4">
              <v-data-iterator
                :items="verifications"
                :items-per-page="itemsPerPage"
              >
                <template v-slot:header>
                  <v-list density="compact" v-if="$vuetify.display.mdAndUp">
                    <v-list-item class="px-8">
                      <v-list-item-title>
                        <v-row no-gutters class="pb-4">
                          <v-col
                            v-for="(col, idx) in columnHeader"
                            :key="idx"
                            cols="12"
                            :md="col.md"
                            class="text-capitalize white--text text"
                          >
                            <v-row
                              no-gutters
                              class="fill-height"
                              align-content="center"
                            >
                              <span
                                class="d-inline-block text-truncate text-capitalize font-weight-bold"
                                :class="`text-${col.align}`"
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

                <template #default="{ items }">
                  <v-list class="pa-0">
                    <template
                      v-for="(item, itemIndex) in items"
                      :key="item.raw._id"
                    >
                      <v-list-item class="py-4 px-8">
                        <v-list-item-title>
                          <v-row no-gutters>
                            <v-col cols="12" md="4" class="text mb-2 mb-md-0">
                              <v-row
                                no-gutters
                                class="fill-height text-truncate"
                                align-content="center"
                                align="center"
                                :justify="
                                  $vuetify.display.smAndDown
                                    ? 'space-between'
                                    : 'start'
                                "
                              >
                                <span
                                  class="mr-2 d-flex d-md-none font-weight-bold"
                                  >Email:
                                </span>
                                <span
                                  style="
                                    display: block;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                  "
                                  :style="
                                    $vuetify.display.smAndDown
                                      ? 'font-size: .8rem;'
                                      : ''
                                  "
                                >
                                  <v-icon color="red" class="ml-1 mr-1 mr-md-6">
                                    mdi-at
                                  </v-icon>
                                  {{ item.raw.email || "N/A" }}
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              md="4"
                              class="text text-capitalize mb-2 mb-md-0"
                            >
                              <v-row
                                no-gutters
                                class="fill-height text-truncate"
                                align-content="center"
                                align="center"
                                :justify="
                                  $vuetify.display.smAndDown
                                    ? 'space-between'
                                    : 'start'
                                "
                              >
                                <span
                                  class="mr-2 d-flex d-md-none font-weight-bold"
                                  >Status:
                                </span>
                                <v-chip color="primary">Pending</v-chip>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              md="3"
                              class="text text-capitalize mb-2 mb-md-0"
                            >
                              <v-row
                                no-gutters
                                class="fill-height text-truncate"
                                align-content="center"
                                align="center"
                                :justify="
                                  $vuetify.display.smAndDown
                                    ? 'space-between'
                                    : 'start'
                                "
                              >
                                <span
                                  class="mr-2 d-flex d-md-none font-weight-bold"
                                  >Date Invited:
                                </span>
                                <span>
                                  {{
                                    standardFormatDate(item.raw.createdAt || "")
                                  }}
                                </span>
                              </v-row>
                            </v-col>
                            <v-col
                              cols="12"
                              md="1"
                              class="text text-capitalize"
                            >
                              <v-row
                                no-gutters
                                class="fill-height text-truncate"
                                align-content="center"
                                align="center"
                                :justify="
                                  $vuetify.display.mdAndDown ? 'end' : 'start'
                                "
                              >
                                <v-menu>
                                  <template v-slot:activator="{ props }">
                                    <v-icon
                                      density="compact"
                                      v-bind="props"
                                      class="border-md rounded-xl pa-4"
                                    >
                                      mdi-dots-vertical
                                    </v-icon>
                                  </template>
                                  <v-list>
                                    <v-list-item
                                      @click="
                                        onResendInvite(item.raw.email || '')
                                      "
                                    >
                                      <template #title>
                                        <span class="text-caption">
                                          Resend Invite
                                        </span>
                                      </template>
                                    </v-list-item>
                                  </v-list>
                                </v-menu>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider></v-divider>
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
                          No invited group members yet.
                        </span>
                      </v-row>
                    </v-col>
                  </v-row>
                </template>
              </v-data-iterator>

              <v-row class="my-1">
                <!-- <v-col cols="12" class="pa-4">
                  <FooterPagination
                    @next-page="nextPage()"
                    @prev-page="prevPage()"
                    :pageRange="pageRange"
                    :page="page"
                    :pages="pages"
                  />
                </v-col> -->
                <v-col cols="12" class="pa-4">
                  <v-row no-gutters justify="end" align-content="center">
                    <span>{{ pageRange }}</span>
                    <v-btn
                      density="compact"
                      variant="text"
                      icon
                      class="mx-2"
                      :disabled="canPrevPage"
                      @click="onPrevPage()"
                    >
                      <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn
                      density="compact"
                      variant="text"
                      icon
                      class="mx-2"
                      :disabled="!canNextPage"
                      @click="onNextPage()"
                    >
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </g-card>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";
const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();
const { getSitesOptionsForFiltering, mySite, myOrg, myProvider } = useFilter();
const { standardFormatDate } = useUtils();
const {
  page,
  pages,
  pageRange,
  itemsPerPage,
  isLoading,
  verifications,
  searchVerification,
  nextPage,
  prevPage,
  setVerifications,
  resendVerificationEmail,

  canNextPage,
  canPrevPage,
} = useVerificationInvites();

const props = defineProps<{
  isConfirmModal: boolean;
}>();
const emit = defineEmits<{
  (event: "onHideDialog"): void;
}>();

const columnHeader = computed(() => {
  return [
    { md: "4", title: "Email" },
    { md: "4", title: "Status" },
    { md: "3", title: "Invited Date" },
    { md: "1", title: "Actions" },
  ];
});
const isShowDialog = computed(() => props.isConfirmModal);

onMounted(async () => {
  page.value = 1;
  await getSitesOptionsForFiltering();
  await getAllVerifications();
});

async function getAllVerifications() {
  if (currentUser.value.type === "site") {
    await setVerifications({
      site: mySite.value,
    });
  } else if (currentUser.value.type === "organization") {
    await setVerifications({
      organization: myOrg.value,
    });
  } else if (currentUser.value.type === "service-provider") {
    await setVerifications({
      serviceProvider: myProvider.value,
    });
  } else if (currentUser.value.type === "admin") {
    await setVerifications({
      userType: "admin",
    });
  }
}

async function onResendInvite(email: string) {
  try {
    if (!email) throw new Error("No email available to resend");
    const response = await resendVerificationEmail(email);
    if (response) {
      setSnackbar({
        modal: true,
        text: "Successfully Resend email invitation.",
      });
    } else {
      setSnackbar({
        modal: true,
        text: "UnSuccessfully send a invitation again.",
        type: "error",
      });
    }
  } catch (error: any) {
    setSnackbar({
      modal: true,
      text: error || error.message,
      type: "error",
    });
  }
}

async function onSearch(keyword: string) {
  debouncedSearch(keyword);
}
const debouncedSearch = debounce(async (value: string) => {
  searchVerification.value = value;
  page.value = 1; // reset when search keywords
  await getAllVerifications();
}, 500);

async function callItBack() {
  searchVerification.value = "";
  await getAllVerifications();
}

async function onPrevPage() {
  if (currentUser.value.type === "admin") {
    return prevPage({
      userType: "admin",
    });
  }

  prevPage({
    organization: currentUser.value.type === "organization" ? myOrg.value : "",
  });
}

async function onNextPage() {
  if (currentUser.value.type === "admin") {
    return nextPage({
      userType: "admin",
    });
  }

  nextPage({
    organization: currentUser.value.type === "organization" ? myOrg.value : "",
  });
}
</script>
