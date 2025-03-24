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
                  {{ theSite.name }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row no-gutters justify="end" align-content="end"> </v-row>
            </v-col>
          </v-row>
        </v-col>

        <v-col
          cols="12"
          md="4"
          v-for="(item, itemIndex) in items"
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
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure", "site"],
});

const { requiredInput } = useUtils();
const {
  site,
  isSiteValid,
  setSite,
  updateSiteNameById,
  updateSiteEmailById,
  updateSiteContactById,
  updateSiteStatusById,
} = useSite();

const siteId = computed(() => useRoute().params.site as string);
const theSite = computed(() => site.value);
const params = computed(() => ({ id: orgId.value }));

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

const actions = computed(() => {
  return [
    {
      text: "Suspend Site",
      to: "team-id-suspend",
      params: params.value,
      disabled: true,
    },
    {
      text: "Activate Site",
      to: "team-id-activate",
      params: params.value,
      disabled: true,
    },
    {
      text: "Delete Site",
      to: "team-id-delete",
      params: params.value,
      disabled: true,
    },
  ];
});

const nav = computed(() => {
  return [
    {
      title: "Site Invitation",
      to: {
        name: "collaboration",
      },
    },

    {
      title: theSite.value.name,
    },
  ];
});

const items = computed(() => {
  return [
    {
      text: "Dashboards",
      img: "/images/sites/dashboard.svg",
      isLink: false,
      dialogData: {},
      class: "text-center",
    },
    {
      text: "Site Name",
      value: theSite.value.name,
      img: "/images/sites/name.svg",
      isLink: false,
      dialogData: {},
      class: "text-center",
    },
    {
      text: "Team",
      value: theSite.value.team,
      img: "/images/sites/team.svg",
      isLink: false,
      dialogData: {},
      class: "text-center",
    },

    {
      text: "Residents",
      value: theSite.value.residents,
      img: "/images/sites/residents.svg",
      isLink: false,
      dialogData: {},
      class: "text-center",
    },
    {
      text: "Email",
      value: theSite.value.email,
      img: "/images/sites/email.svg",
      isLink: false,
      dialogData: {},
      class: "text-center",
    },
    {
      text: "Contact Number",
      value: theSite.value.contactNumber,
      img: "/images/sites/contact.svg",
      isLink: false,
      dialogData: {},
      class: "text-center",
    },
    {
      text: "Status",
      value: theSite.value.status,
      img: "/images/sites/status.svg",
      isLink: false,
      dialogData: {},
      class: "text-center",
    },
  ];
});

function goBack() {
  useRouter().back();
}

function openDialog(data: any) {
  dialog.value = true;
  dialogData.value = data;
}
</script>
