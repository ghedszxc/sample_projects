<template>
  <g-card :loading="isLoading" :elevation="2">
    <v-data-iterator :items="users" :items-per-page="itemsPerPage">
      <template v-slot:header>
        <v-row no-gutters class="pa-2 pa-md-4">
          <v-col cols="12">
            <v-row no-gutters class="align-center">
              <v-col cols="12" md="5">
                <span class="font-weight-bold text-h5 mr-4">
                  <v-btn
                    icon="mdi-arrow-left"
                    elevation="0"
                    class="mr-2"
                    @click="useRouter().back()"
                  ></v-btn
                  >{{ spGroup.groupName }}
                </span>
              </v-col>
              <v-col cols="12" md="4" class="mb-2 mb-md-0 pr-md-2">
                <search-text-field
                  @on-search="onSearch($event)"
                  @clear-search="callItBack"
                ></search-text-field>
              </v-col>
              <v-col cols="12" md="2" class="mb-2 mb-md-0">
                <v-btn
                  variant="outlined"
                  color="#1867C0"
                  class="w-100 w-md-auto"
                  @click="emit('onOpenPendingMember')"
                >
                  Pending Members
                </v-btn>
              </v-col>
              <v-col cols="12" md="1">
                <v-btn
                  color="#1867C0"
                  @click="onInviteDialog"
                  class="w-100 w-md-auto"
                >
                  Invite
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider></v-divider>

        <v-row
          no-gutters
          class="pa-4 px-6 d-none d-md-flex"
          align-content="center"
          col="12"
        >
          <v-col cols="3">
            <span class="font-weight-bold"> Name </span>
          </v-col>
          <v-col cols="3">
            <span class="font-weight-bold"> Email </span>
          </v-col>
          <v-col cols="3" class="">
            <span class="font-weight-bold"> Role & Permission </span>
          </v-col>
          <v-col cols="2">
            <span class="font-weight-bold"> Status </span>
          </v-col>
          <v-col cols="1" class="text-right">
            <span class="font-weight-bold"> Action </span>
          </v-col>
        </v-row>

        <v-divider></v-divider>
      </template>

      <!-- rows  -->
      <template #default="{ items }">
        <v-list class="pa-0">
          <template v-for="(item, itemIndex) in items" :key="item.raw._id">
            <v-list-item class="py-4 px-8">
              <v-list-item-title>
                <v-row no-gutters>
                  <v-col
                    cols="12"
                    md="3"
                    class="text-capitalize white--text text text-truncate"
                  >
                    <v-row
                      no-gutters
                      class="fill-height"
                      align-content="center"
                    >
                      <v-avatar
                        size="small"
                        :color="
                          stringToColor(
                            `${item.raw.givenName} ${item.raw.surname}`,
                          )
                        "
                        class="mr-4"
                      >
                        {{ getInitial(item.raw.givenName) }}
                      </v-avatar>
                      <span
                        class="text-truncate mt-1"
                        :style="{
                          maxWidth: $vuetify.display.lgAndUp
                            ? '180px'
                            : '160px',
                        }"
                      >
                        {{ item.raw.givenName }}
                        {{ item.raw.surname }}
                      </span>
                    </v-row>
                  </v-col>

                  <v-col cols="12" md="3" class="text my-1 text-truncate">
                    <v-row
                      no-gutters
                      class="fill-height"
                      align-content="center"
                    >
                      <v-icon
                        color="red"
                        class="ml-1"
                        :class="{
                          'mr-5': $vuetify.display.mdAndDown,
                          'mr-3': !$vuetify.display.mdAndDown,
                        }"
                      >
                        mdi-at
                      </v-icon>
                      <span
                        :style="{
                          maxWidth: $vuetify.display.lgAndUp
                            ? '180px'
                            : '160px',
                        }"
                      >
                        {{ item.raw.email }}
                      </span>
                    </v-row>
                  </v-col>

                  <v-col cols="12" md="3" class="text text-capitalize">
                    <v-row
                      no-gutters
                      class="fill-height text-truncate"
                      align-content="center"
                    >
                      <v-icon color="blue" class="ml-1 mr-5">
                        mdi-account-cog-outline
                      </v-icon>

                      {{ item.raw.role?.roleName }}
                    </v-row>
                  </v-col>

                  <v-col cols="12" md="2" class="text text-capitalize">
                    <v-row
                      no-gutters
                      class="fill-height"
                      align-content="center"
                    >
                      <svg
                        class="mr-6"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M5.85 17.1C6.7 16.45 7.65 15.9375 8.7 15.5625C9.75 15.1875 10.85 15 12 15C13.15 15 14.25 15.1875 15.3 15.5625C16.35 15.9375 17.3 16.45 18.15 17.1C18.7333 16.4167 19.1875 15.6417 19.5125 14.775C19.8375 13.9083 20 12.9833 20 12C20 9.78333 19.2208 7.89583 17.6625 6.3375C16.1042 4.77917 14.2167 4 12 4C9.78333 4 7.89583 4.77917 6.3375 6.3375C4.77917 7.89583 4 9.78333 4 12C4 12.9833 4.1625 13.9083 4.4875 14.775C4.8125 15.6417 5.26667 16.4167 5.85 17.1ZM12 13C11.0167 13 10.1875 12.6625 9.5125 11.9875C8.8375 11.3125 8.5 10.4833 8.5 9.5C8.5 8.51667 8.8375 7.6875 9.5125 7.0125C10.1875 6.3375 11.0167 6 12 6C12.9833 6 13.8125 6.3375 14.4875 7.0125C15.1625 7.6875 15.5 8.51667 15.5 9.5C15.5 10.4833 15.1625 11.3125 14.4875 11.9875C13.8125 12.6625 12.9833 13 12 13ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C12.8833 20 13.7167 19.8708 14.5 19.6125C15.2833 19.3542 16 18.9833 16.65 18.5C16 18.0167 15.2833 17.6458 14.5 17.3875C13.7167 17.1292 12.8833 17 12 17C11.1167 17 10.2833 17.1292 9.5 17.3875C8.71667 17.6458 8 18.0167 7.35 18.5C8 18.9833 8.71667 19.3542 9.5 19.6125C10.2833 19.8708 11.1167 20 12 20ZM12 11C12.4333 11 12.7917 10.8583 13.075 10.575C13.3583 10.2917 13.5 9.93333 13.5 9.5C13.5 9.06667 13.3583 8.70833 13.075 8.425C12.7917 8.14167 12.4333 8 12 8C11.5667 8 11.2083 8.14167 10.925 8.425C10.6417 8.70833 10.5 9.06667 10.5 9.5C10.5 9.93333 10.6417 10.2917 10.925 10.575C11.2083 10.8583 11.5667 11 12 11Z"
                          fill="#1867C0"
                        />
                      </svg>

                      {{ item.raw.status }}
                    </v-row>
                  </v-col>

                  <v-col cols="12" md="1" class="text-caption">
                    <v-row
                      no-gutters
                      class="fill-height"
                      justify="end"
                      align-content="center"
                    >
                      <v-menu>
                        <template v-slot:activator="{ props }">
                          <v-icon density="compact" v-bind="props"
                            >mdi-dots-vertical</v-icon
                          >
                        </template>
                        <v-list>
                          <template
                            v-for="(actionItem, actionIndex) in actions"
                            :key="actionItem.text"
                          >
                            <v-list-item
                              @click="actionItem.dialogData.action(item.raw)"
                              :disabled="actionItem.disabled"
                            >
                              <template #title>
                                <span class="text-caption">
                                  {{ actionItem.text }}
                                </span>
                              </template>
                            </v-list-item>

                            <v-divider
                              v-if="actionIndex + 1 !== actions.length"
                            ></v-divider>
                          </template>
                        </v-list>
                      </v-menu>
                    </v-row>
                  </v-col>
                </v-row>
              </v-list-item-title>
            </v-list-item>
            <v-divider v-if="itemIndex + 1 !== items.length"></v-divider>
          </template>
        </v-list>
      </template>

      <!-- row without data -->
      <template #no-data>
        <v-row no-gutters justify="center" class="pa-16">
          <v-col cols="12">
            <v-row no-gutters justify="center">
              <v-img src="/empty.svg" width="100px" height="100px"></v-img>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-row no-gutters justify="center">
              <span class="font-weight-bold">
                You don't have any team member yet.
              </span>
            </v-row>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>

    <v-divider></v-divider>
    <v-row class="my-1">
      <v-col cols="12" class="pa-4">
        <FooterPagination
          @next-page="_nextPage()"
          @prev-page="_prevPage()"
          :pageRange="pageRange"
          :page="page"
          :pages="pages"
        />
      </v-col>
    </v-row>
  </g-card>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (event: "onInvite"): void;
  (event: "onOpenPendingMember"): void;
}>();
const props = defineProps<{
  actions: {
    text: string;
    disabled: boolean;
    isLink: boolean;
    dialogData: {
      action: (value: any) => Promise<void>;
    };
  }[];
}>();

const { currentUser } = useLocalAuth();
const { getSitesOptionsForFiltering, mySite, myOrg, myProvider } = useFilter();
const { getInitial, stringToColor } = useUtils();
const {
  users,
  search,
  setUsers,
  itemsPerPage,
  pageRange,
  page,
  pages,
  nextPage,
  prevPage,
  getAllGroupMemberSP,
} = useUser();
const { spGroup, getSPGroupById, isLoading } = useSPGroup();

const onInviteDialog = () => {
  emit("onInvite");
};
const route = useRoute();
const groupId = computed(() => String(route.params.group)).value;

onMounted(async () => {
  await getSitesOptionsForFiltering();
  await getSPGroupById(groupId);
});

const _nextPage = async () => {
  await nextPage();
  await getAllGroupMemberSP({
    serviceProvider: String(currentUser.value.serviceProvider),
    serviceProviderGroup: String(route.params.group),
  });
};

const _prevPage = async () => {
  await prevPage();
  await getAllGroupMemberSP({
    serviceProvider: String(currentUser.value.serviceProvider),
    serviceProviderGroup: String(route.params.group),
  });
};

const onSearch = async (data: any) => {
  search.value = data;
  await getAllGroupMemberSP({
    serviceProvider: String(currentUser.value.serviceProvider),
    serviceProviderGroup: String(route.params.group),
  });
};

const callItBack = async () => {
  search.value = "";
  await setUsers({
    type: currentUser.value.type,
    organization: currentUser.value.type === "organization" ? myOrg.value : "",
    site: mySite.value,
    serviceProvider: /^(service-provider|servicer-provider-member)$/i.test(
      currentUser.value.type,
    )
      ? myProvider.value
      : "",
  });
};
</script>
