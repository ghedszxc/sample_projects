<template>
  <v-dialog max-width="1500" v-model="isShowDialog" persistent>
    <v-card class="rounded-xl" min-height="600px">
      <v-toolbar color="white" class="rounded-xl">
        <v-toolbar-title>
          <v-btn
            icon="mdi-arrow-left"
            elevation="0"
            @click="emit('onHideDialog')"
          ></v-btn>

          <span class="text-h6"> Pending Invited Members </span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-row align="center" justify="end">
          <v-col
            cols="12"
            md="6"
            lg="6"
            :class="{ 'mb-5': $vuetify.display.smAndDown }"
          >
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
                            <v-col cols="12" md="4" class="text">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                {{ item.raw.email }}
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              md="4"
                              class="text text-capitalize"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <v-chip color="primary">Pending</v-chip>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              md="4"
                              class="text text-capitalize"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                {{
                                  standardFormatDate(item.raw.createdAt || "")
                                }}
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-list-item-title>
                        <template #append>
                          <v-menu>
                            <template v-slot:activator="{ props }">
                              <v-icon density="compact" v-bind="props">
                                mdi-dots-vertical
                              </v-icon>
                            </template>
                            <v-list>
                              <v-list-item
                                @click="onResendInvite(item.raw.email || '')"
                              >
                                <template #title>
                                  <span class="text-caption">
                                    Resend Invite
                                  </span>
                                </template>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </template>
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
                <v-col cols="12" class="pa-4">
                  <FooterPagination
                    @next-page="nextPage()"
                    @prev-page="prevPage()"
                    :pageRange="pageRange"
                    :page="page"
                    :pages="pages"
                  />
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
const { standardFormatDate } = useUtils();
const { setSnackbar } = useLocal();
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
} = useVerificationInvites();
const { resendVerificationEmail } = useVerificationInvites();

const route = useRoute();
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
    { md: "4", title: "Invited Date" },
  ];
});
const isShowDialog = computed(() => props.isConfirmModal);
const groupId = computed(() => String(route.params.group));

onMounted(async () => {
  await getAllVerifications();
});

async function getAllVerifications() {
  await setVerifications({
    serviceProvider: currentUser.value.serviceProvider,
    serviceProviderGroup:
      currentUser.value.serviceProviderGroup || groupId.value,
  });
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
</script>
