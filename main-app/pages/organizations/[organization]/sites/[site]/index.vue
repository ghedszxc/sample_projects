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
                  {{ site.name }}
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

        <v-col
          cols="12"
          md="4"
          v-for="(item, itemIndex) in currentUser.type != 'service-provider'
            ? items
            : items.filter(
                (find) =>
                  find.text != 'Service Providers' && find.text != 'Residents',
              )"
          :key="item.text"
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
      </v-row>
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
          <v-toolbar-title>{{ site.name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text>
          <v-row class="h-100 align-center">
            <v-form
              v-model="isSiteValid"
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
                  <div class="text-subtitle-1 text-medium-emphasis">
                    {{ dialogData.label }}
                  </div>
                  <template v-if="dialogData.type == 'phone'">
                    <v-row>
                      <v-col cols="4" class="mb-4 pr-2">
                        <v-select
                          v-model="prefix"
                          :items="prefixes"
                          item-title="country"
                          item-value="dial_code"
                          hide-details
                          menu-icon="mdi-chevron-down"
                          chips
                          label="Dial Code"
                          density="comfortable"
                          :rules="[requiredInput]"
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
                      <v-col cols="8" class="mb-4">
                        <v-text-field
                          v-model="primaryPhone"
                          label="Phone Number"
                          hide-details
                          density="comfortable"
                          :rules="[requiredInput]"
                          @input="filterNumericInput"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-else-if="dialogData.type == 'text'">
                    <v-text-field
                      v-model="dialogData.inputVal"
                      :rules="[requiredInput]"
                      item-title="text"
                      item-value="value"
                      density="comfortable"
                      hint=""
                      :persistent-hint="false"
                    ></v-text-field>
                  </template>

                  <template v-else>
                    <v-select
                      v-model="dialogData.inputVal"
                      :rules="[requiredInput]"
                      :items="dialogData.options"
                      item-title="text"
                      item-value="value"
                      density="comfortable"
                      hint=""
                      :persistent-hint="false"
                    ></v-select>
                  </template>

                  <v-btn
                    color="#1867C0"
                    :disabled="!isSiteValid"
                    type="submit"
                    class="py-4 w-100 rounded-lg"
                    height="52px"
                  >
                    Update
                  </v-btn>
                </v-responsive>
              </v-col>
            </v-form>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import phoneCode from "@/components/phone-code.json";
const prefixes = phoneCode;
definePageMeta({
  middleware: ["secure", "organization", "site"],
});
const prefix = ref("+65");
const primaryPhone = ref("");
const fullPhoneNumber = ref("");

watch([prefix, primaryPhone], ([newPrefix, newPrimaryPhone]) => {
  if (!newPrefix || !newPrimaryPhone) {
    fullPhoneNumber.value = ""; // Handle null or undefined values
  } else {
    fullPhoneNumber.value = `${newPrefix}${newPrimaryPhone}`;
  }
  // Update the contact information in props
  dialogData.value.inputVal = fullPhoneNumber.value;
});
const { requiredInput } = useUtils();
const { organization } = useOrganization();
const {
  site,
  isSiteValid,
  setSite,
  updateSiteNameById,
  updateSiteEmailById,
  updateSiteContactById,
  updateSiteStatusById,
  getSiteById,
} = useSite();

const orgId = computed(() => useRoute().params.organization as string);
const siteId = computed(() => useRoute().params.site as string);
const params = computed(() => ({ id: orgId.value }));

const { currentUser } = useLocalAuth();

const actionMenu = ref(false);
const dialog = ref(false);
const dialogData = ref({
  img: "",
  inputVal: "",
  type: "",
  label: "",
  options: [],
  action: () => {},
});
const filterNumericInput = (event) => {
  const value = event.target.value;
  primaryPhone.value = value.replace(/\D/g, "");
};
const actions = computed(() => {
  return [
    {
      text: "Suspend Site",
      to: "team-id-suspend",
      params: params.value,
      disabled: false,
    },
    {
      text: "Activate Site",
      to: "team-id-activate",
      params: params.value,
      disabled: false,
    },
    {
      text: "Delete Site",
      to: "team-id-delete",
      params: params.value,
      disabled: false,
    },
  ];
});

const nav = computed(() => {
  return [
    {
      title: "Sites",
      to: {
        name: "organizations-organization-sites",
        params: {
          organization: orgId.value,
        },
      },
    },
    {
      title: site.value.name,
    },
  ];
});

onMounted(() => {
  Promise.all([getSite()]);
});

const itemParams = computed(() => ({
  organization: orgId.value,
  site: site.value._id,
}));

const items = computed(() => {
  return [
    {
      text: "Dashboards",
      img: "/images/sites/dashboard.svg",
      isLink: true,
      to: "organizations-organization-sites-site-dashboard",
      params: itemParams.value,
      class: "text-center",
    },
    {
      text: "Site Name",
      value: site.value.name,
      img: "/images/sites/name.svg",
      isLink: false,
      dialogData: {
        type: "text",
        label: "Site Name",
        action: async () => {
          await updateSiteNameById({
            _id: site.value._id as string,
            name: dialogData.value.inputVal,
          });
          dialog.value = false;
          site.value.name = dialogData.value.inputVal;
          setSite(site.value);
        },
      },
      class: "text-center",
    },
    {
      text: "Team",
      value: site.value.team,
      img: "/images/sites/team.svg",
      isLink: true,
      to: "organizations-organization-sites-site-team",
      params: itemParams.value,
      class: "text-center",
    },
    {
      text: "Service Providers",
      value: site.value.serviceProviders,
      img: "/images/sites/service.svg",
      isLink: true,
      to: "organizations-organization-sites-site-service-providers",
      params: itemParams.value,
      class: "text-center",
    },
    {
      text: "Residents",
      value: site.value.residents,
      img: "/images/sites/residents.svg",
      isLink: true,
      to: "organizations-organization-sites-site-residents",
      params: itemParams.value,
      class: "text-center",
    },
    {
      text: "Email",
      value: site.value.email,
      img: "/images/sites/email.svg",
      isLink: false,
      dialogData: {
        type: "text",
        label: "Site Email",
        action: async () => {
          await updateSiteEmailById({
            _id: site.value._id as string,
            email: dialogData.value.inputVal,
          });
          dialog.value = false;
          site.value.email = dialogData.value.inputVal;
          setSite(site.value);
        },
      },
      class: "text-center",
    },
    {
      text: "Contact Number",
      value: site.value.contactNumber,
      img: "/images/sites/contact.svg",
      isLink: false,
      dialogData: {
        type: "phone",
        label: "Contact Number",
        action: async () => {
          await updateSiteContactById({
            _id: site.value._id as string,
            contactNumber: dialogData.value.inputVal,
          });
          dialog.value = false;
          site.value.contactNumber = dialogData.value.inputVal;
          setSite(site.value);
        },
      },
      class: "text-center",
    },
    {
      text: "Status",
      value: site.value.status,
      img: "/images/sites/status.svg",
      isLink: false,
      dialogData: {
        text: "select",
        options: [
          { text: "Active", value: "active" },
          { text: "Inactive", value: "inactive" },
        ],
        label: "Status",
        action: async () => {
          console.log(dialogData.value.inputVal);
          await updateSiteStatusById({
            _id: site.value._id as string,
            status: dialogData.value.inputVal,
          });
          dialog.value = false;
          site.value.status = dialogData.value.inputVal;
          setSite(site.value);
        },
      },
      class: "text-center",
    },
  ];
});

async function getSite() {
  const result = await getSiteById(siteId.value);

  if (result) setSite(result);
}

function goBack() {
  useRouter().back();
}

function openDialog(data: any) {
  dialog.value = true;
  dialogData.value = data;
}
</script>
