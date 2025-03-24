<template>
  <v-row no-gutters class="pa-8" justify="center">
    <v-col cols="12" class="fill-height mb-5" align-content="center">
      <v-breadcrumbs class="pa-0" :items="nav">
        <template #item="{ item }">
          <v-breadcrumbs-item :to="item.to">
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </v-col>

    <v-col cols="12">
      <v-row no-gutters>
        <v-col cols="12">
          <v-row no-gutters class="fill-height" align="center">
            <v-col cols="6">
              <v-row no-gutters>
                <v-col
                  cols="12"
                  class="text-h5 font-weight-bold text-capitalize"
                  style="letter-spacing: 2px !important"
                >
                  {{ theProvider.name }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row no-gutters justify="end" align-content="end">
                <v-menu v-model="actionMenu" location="bottom">
                  <template #activator="{ props }">
                    <v-btn variant="text" v-bind="props">
                      <template #append>
                        <v-icon>{{
                          props["aria-expanded"] === "false"
                            ? "mdi-chevron-down"
                            : "mdi-chevron-up"
                        }}</v-icon>
                      </template>
                      Options
                    </v-btn>
                  </template>

                  <v-card>
                    <v-list density="compact" class="pa-0">
                      <template
                        v-for="(actionItem, actionIndex) in actions"
                        :key="actionItem.text"
                      >
                        <v-list-item
                          v-if="actionItem.link"
                          :to="{
                            name: actionItem.to,
                            params: actionItem.params,
                          }"
                          :disabled="actionItem.disabled"
                        >
                          <template #title>
                            <span class="text-caption">
                              {{ actionItem.text }}
                            </span>
                          </template>
                        </v-list-item>

                        <v-list-item v-else @click="actionItem.action">
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
                  </v-card>
                </v-menu>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>

    <v-col
      cols="12"
      md="4"
      v-for="(item, itemIndex) in items"
      :key="itemIndex"
      class="my-3"
    >
      <template v-if="item.isLink">
        <div class="px-2">
          <v-card
            class="w-100 pa-8"
            elevation="1"
            style="border-radius: 24px"
            height="368px"
            link
            :to="{
              name: item.to,
              params: item.params,
            }"
          >
            <v-row no-gutters class="fill-height" align-content="center">
              <v-col cols="12">
                <v-row no-gutters justify="center">
                  <v-img
                    :src="item.img"
                    style="width: 187.533px; height: 120px; flex-shrink: 0"
                  ></v-img>
                </v-row>
              </v-col>

              <v-col
                cols="12"
                class="text-caption text-center mt-5"
                style="font-size: 14px"
              >
                {{ item.text }}
              </v-col>
              <v-col cols="12" :class="item.class" style="font-size: 20px">
                {{ item.value }}
              </v-col>
            </v-row>
          </v-card>
        </div>
      </template>

      <template v-else>
        <div class="px-2">
          <v-card
            elevation="1"
            style="border-radius: 24px"
            height="368px"
            class="pa-8 w-100"
            @click="
              openDialog({
                img: item.img,
                inputVal: item.value,
                ...item.dialogData,
              })
            "
          >
            <v-row no-gutters class="fill-height" align-content="center">
              <v-col cols="12">
                <v-row no-gutters justify="center">
                  <v-img
                    :src="item.img"
                    style="width: 119.538px; height: 91.2px; flex-shrink: 0"
                  ></v-img>
                </v-row>
              </v-col>

              <v-col
                cols="12"
                class="text-caption text-center mt-5"
                style="font-size: 14px"
              >
                {{ item.text }}
              </v-col>
              <v-col cols="12" :class="item.class" style="font-size: 20px">
                {{ item.value }}
              </v-col>
            </v-row>
          </v-card>
        </div>
      </template>
    </v-col>

    <v-dialog
      v-model="dialog"
      transition="dialog-right-transition"
      fullscreen
      :style="{
        'margin-left': 'auto',
        'margin-right': '0',
        'max-width': '551px',
      }"
    >
      <v-card class="px-3 h-100">
        <v-toolbar color="white">
          <v-btn icon="mdi-arrow-left" @click="dialog = false"></v-btn>
          <v-toolbar-title>{{ theProvider.name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text>
          <v-row class="h-100 align-center">
            <v-form
              v-model="isServiceProviderValid"
              @submit.prevent="dialogData.action"
              class="w-100"
            >
              <v-col cols="12">
                <v-row class="justify-center mb-7">
                  <v-img
                    :src="dialogData.img"
                    width="190px"
                    height="190px"
                  ></v-img>
                </v-row>

                <v-responsive class="mx-auto">
                  <div class="text-subtitle-1 text-medium-emphasis py-4">
                    {{ dialogData.label }}
                  </div>
                  <template v-if="dialogData.type == 'text'">
                    <v-row>
                      <v-col
                        v-if="dialogData.prefix"
                        cols="4"
                        class="mb-4 pr-2"
                      >
                        <v-select
                          v-model="dialogData.prefix"
                          :items="prefixes"
                          item-title="country"
                          item-value="dial_code"
                          hide-details
                          menu-icon="mdi-chevron-down"
                          chips
                          label="Dial Code"
                          density="comfortable"
                          :rules="[requiredInput]"
                          readonly
                        >
                          <template v-slot:chip="{ props, item }">
                            <v-row no-gutters v-bind="props">
                              <v-col cols="6">
                                <v-avatar
                                  size="20"
                                  :image="item.raw.flag"
                                  class="mr-3"
                                ></v-avatar>
                              </v-col>
                              <v-spacer></v-spacer>
                              <v-col cols="6">
                                {{ item.raw.dial_code }}
                              </v-col>
                            </v-row>
                          </template>
                          <template v-slot:item="{ props, item }">
                            <v-row no-gutters v-bind="props" class="px-3">
                              <v-col cols="auto">
                                <v-avatar
                                  size="30"
                                  :image="item.raw.flag"
                                  class="mr-4"
                                ></v-avatar>
                              </v-col>
                              <v-col>
                                <span>{{ item.raw.dial_code }}</span>
                              </v-col>
                              <v-col class="text-center">
                                <v-chip color="primary">{{
                                  item.raw.country
                                }}</v-chip>
                              </v-col>
                            </v-row>
                          </template>
                        </v-select>
                      </v-col>
                      <v-col class="mb-4">
                        <v-text-field
                          v-model="dialogData.inputVal"
                          :label="dialogData.label"
                          hide-details
                          density="comfortable"
                          :rules="[requiredInput]"
                          @input="filterNumericInput"
                          readonly
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-else-if="dialogData.type == 'select'">
                    <v-select
                      :rules="[requiredInput]"
                      :items="dialogData.options"
                      v-model="dialogData.inputVal"
                      item-value="value"
                      item-title="text"
                      density="comfortable"
                      hint=""
                      :persistent-hint="false"
                      readonly
                    ></v-select>
                  </template>
                  <template v-else>
                    <v-combobox
                      v-model="theProvider.services"
                      :items="dialogData.options"
                      multiple
                      chips
                      density="comfortable"
                      readonly
                      hide-details="true"
                    >
                      <template v-slot:no-data>
                        <v-list-item>
                          <v-list-item-title>
                            No results matching "<strong>{{
                              serviceProviderSearch
                            }}</strong
                            >". Press <kbd>enter</kbd> to create a new one
                          </v-list-item-title>
                        </v-list-item>
                      </template>
                    </v-combobox>
                  </template>

                  <!-- <v-btn
                    color="#1867C0"
                    :disabled="!isServiceProviderValid"
                    type="submit"
                    class="py-4 w-100 rounded-lg"
                    height="52px"
                  >
                    Update
                  </v-btn> -->
                </v-responsive>
              </v-col>
            </v-form>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog max-width="700" v-model="dialogDelete" persistent>
      <v-card elevation="2" class="rounded-xl" max-height="500px">
        <v-toolbar color="white">
          <v-spacer></v-spacer>
          <v-btn
            class="mt-3 mr-3"
            icon="mdi-close"
            @click="dialog = false"
          ></v-btn>
        </v-toolbar>

        <v-card-text>
          <v-row class="align-center justify-center">
            <v-col cols="12">
              <v-img src="/images/service_provider/cancel.svg" height="190px" />
            </v-col>

            <v-col cols="12" class="text-center">
              <h3 class="pt-3">Delete Service Provider</h3>
            </v-col>

            <v-col cols="8" class="mx-auto">
              <v-row>
                <v-col cols="6">
                  <v-btn
                    class="py-4 w-100 rounded-lg px-3"
                    height="52px"
                    @click="dialogDelete = false"
                  >
                    No
                  </v-btn>
                </v-col>

                <v-col>
                  <v-btn
                    color="#1867C0"
                    :loading="deleteLoading"
                    type="submit"
                    class="py-4 w-100 rounded-lg px-3"
                    height="52px"
                    @click="deleteProvider"
                  >
                    Yes
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import organization from "~/middleware/organization";
import phoneCode from "@/components/phone-code.json";
const prefixes = phoneCode;

definePageMeta({
  middleware: ["secure", "organization", "site", "service-provider"],
});
/* watch([prefix, primaryPhone], ([newPrefix, newPrimaryPhone]) => {
  if (!newPrefix || !newPrimaryPhone) {
    fullPhoneNumber.value = ""; // Handle null or undefined values
  } else {
    fullPhoneNumber.value = `${newPrefix}${newPrimaryPhone}`;
  }
  // Update the contact information in props
  dialogData.value.inputVal = fullPhoneNumber.value;
});
const filterNumericInput = (event) => {
  const value = event.target.value;
  primaryPhone.value = value.replace(/\D/g, "");
}; */
const { requiredInput } = useUtils();

const { site, setSite } = useSite();

const {
  isServiceProviderValid,
  serviceProvider,
  deleteLoading,
  setServiceProvider,
  updateServiceProviderNameById,
  updateServiceProviderEmailById,
  updateServiceProviderContactById,
  updateServiceProviderStatusById,
  updateServiceProviderServicesById,
  deleteServiceProviderById,
  search: serviceProviderSearch,
} = useServiceProvider();

const orgId = computed(() => useRoute().params.organization as string);
const siteId = computed(() => useRoute().params.site as string);
const providerId = computed(() => useRoute().params.provider as string);

const theSite = computed(() => site.value);
const theProvider = computed(() => serviceProvider.value);
const params = computed(() => ({ id: orgId.value }));

const actionMenu = ref(false);
const dialog = ref(false);
const dialogDelete = ref(false);
const dialogData = ref({
  img: "",
  inputVal: "",
  type: "",
  label: "",
  options: [],
  action: () => {},
});

const itemParams = computed(() => ({
  organization: orgId.value,
  site: siteId.value,
  provider: providerId.value,
}));

const actions = computed(() => {
  return [
    {
      text: "Access Control",
      to: "organizations-organization-sites-site-service-providers-provider-configuration",
      link: true,
      params: itemParams.value,
      disabled: false,
    },

    {
      text: "Delete",
      link: false,
      params: params.value,
      disabled: false,
      action: async () => {
        dialogDelete.value = true;
      },
    },
  ];
});

const nav = computed(() => {
  return [
    {
      title: "Service Provider",
      to: {
        name: "organizations-organization-sites-site-service-providers",
        params: {
          organization: orgId.value,
          site: siteId.value,
        },
      },
    },

    {
      title: theProvider.value?.name,
    },
  ];
});

const items = computed(() => {
  return [
    {
      text: "Service Provider",
      value: theProvider.value.name,
      img: "/images/service_provider/ordinary_day.svg",
      isLink: false,
      dialogData: {
        type: "text",
        label: "Service Provider Name",
        action: async () => {
          await updateServiceProviderNameById({
            _id: serviceProvider.value._id as string,
            name: dialogData.value.inputVal,
          });
          dialog.value = false;
          serviceProvider.value.name = dialogData.value.inputVal;
          setServiceProvider(serviceProvider.value);
        },
      },
      class: "text-center",
    },
    {
      text: "Service Provider Team",
      value: theProvider.value.team,
      img: "/images/service_provider/work_time.svg",
      isLink: true,
      to: "organizations-organization-sites-site-service-providers-provider-team",
      params: itemParams.value,
      class: "text-center",
    },
    {
      text: "Services",
      value: theProvider.value.services?.length || 0,
      img: "/images/service_provider/under_construction.svg",
      isLink: false,
      dialogData: {
        text: "select-multiple",
        options: theProvider.value.services,
        label: "Services",
        action: async () => {
          let data = dialogData.value.inputVal;
          await updateServiceProviderServicesById({
            _id: serviceProvider.value._id as string,
            services: serviceProvider.value.services as string[],
          });
          dialog.value = false;
          serviceProvider.value.email = dialogData.value.inputVal;
          setServiceProvider(serviceProvider.value);
        },
      },
      class: "text-center",
    },
    {
      text: "Email",
      value: theProvider.value.email,
      img: "/images/service_provider/newsletter.svg",
      isLink: false,
      dialogData: {
        type: "text",
        label: "Service Provider Email",
        action: async () => {
          await updateServiceProviderEmailById({
            _id: serviceProvider.value._id as string,
            email: dialogData.value.inputVal,
          });
          dialog.value = false;
          serviceProvider.value.email = dialogData.value.inputVal;
          setServiceProvider(serviceProvider.value);
        },
      },
      class: "text-center",
    },
    {
      text: "Contact Number",
      value: theProvider.value.contactNumber,
      img: "/images/service_provider/going_offline.svg",
      isLink: false,
      dialogData: {
        type: "text",
        label: "Contact Number",
        action: async () => {
          await updateServiceProviderContactById({
            _id: serviceProvider.value._id as string,
            contactNumber: dialogData.value.inputVal,
          });
          dialog.value = false;
          serviceProvider.value.contactNumber = dialogData.value.inputVal;
          setServiceProvider(serviceProvider.value);
        },
        prefix: getPhonePrefix(theProvider.value.contactNumber),
      },
      class: "text-center",
    },
    {
      text: "Status",
      value: theProvider.value.status,
      img: "/images/service_provider/completing.svg",
      isLink: false,
      dialogData: {
        text: "select",
        type: "select",
        options: [
          { text: "Active", value: "Active" },
          { text: "Inactive", value: "Inactive" },
        ],
        label: "Status",
        action: async () => {
          await updateServiceProviderStatusById({
            _id: serviceProvider.value._id as string,
            status: dialogData.value.inputVal,
          });
          dialog.value = false;
          serviceProvider.value.status = dialogData.value.inputVal;

          setServiceProvider(serviceProvider.value);
        },
      },
      class: "text-center",
    },
  ];
});

const getPhonePrefix = (phoneNumber: string) => {
  const cleanNumber = phoneNumber.replace(/\D/g, "");
  const sortedPrefixes = [...prefixes].sort(
    (a, b) => b.dial_code.length - a.dial_code.length,
  );

  for (const prefix of sortedPrefixes) {
    if (cleanNumber.startsWith(prefix.dial_code.replace("+", ""))) {
      return prefix;
    }
  }

  return "";
};

async function deleteProvider() {
  await deleteServiceProviderById(serviceProvider.value._id as string);
  dialogDelete.value = false;

  useRouter().back();
}
function openDialog(data: any) {
  dialog.value = true;
  dialogData.value = data;
}
</script>
