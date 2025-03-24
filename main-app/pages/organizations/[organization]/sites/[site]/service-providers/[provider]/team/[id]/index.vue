<template>
  <v-row no-gutters class="pa-8" justify="center">
    <v-col cols="12" xxl="4" xl="8" lg="8">
      <v-row no-gutters>
        <v-col cols="12">
          <v-row no-gutters class="fill-height" align="end">
            <v-col cols="6">
              <v-row no-gutters>
                <v-col
                  cols="12"
                  class="text-h6 font-weight-bold"
                  style="letter-spacing: 2px !important"
                >
                  {{ user.givenName }} {{ user.surname }}
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
        <v-col cols="12" class="font-weight-light mt-4">
          <v-card
            width="100%"
            elevation="0"
            style="border-width: thin"
            min-height="368px"
            class="d-flex justify-center align-center"
          >
            <v-row no-gutters>
              <v-col cols="12" class="font-weight-light">
                <v-card width="100%" elevation="0">
                  <v-list class="pa-0" density="compact">
                    <template
                      v-for="(item, itemIndex) in items"
                      :key="item.text"
                    >
                      <v-list-item
                        :prepend-icon="item.icon"
                        class="py-6"
                        density="compact"
                      >
                        <v-list-item-title class="text-subtitle-1">
                          {{ item.text }}
                        </v-list-item-title>
                        <v-list-item-subtitle
                          v-if="item.subtitle"
                          class="text-subtitle-2"
                        >
                          {{ item.subtitle }}
                        </v-list-item-subtitle>
                      </v-list-item>
                      <v-divider
                        v-if="itemIndex + 1 !== items.length"
                      ></v-divider>
                    </template>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

const { getUserById, setUser, user } = useUser();

const id = computed(() => useRoute().params.id as string);

const { setSnackbar } = useLocal();

onMounted(async () => {
  try {
    const _user = (await getUserById(id.value)) as TUser;
    if (_user) {
      setUser(_user);
    }
  } catch (error) {
    setSnackbar({ text: "Failed to load user data.", modal: true, type: "error" });
  }
});

const actionMenu = ref(false);
const params = ref({
  id: id.value,
});
const actions = computed(() => {
  return [
    {
      text: "Suspend User",
      to: "team-id-suspend",
      params: params.value,
      disabled: true,
    },
    {
      text: "Activate User",
      to: "team-id-activate",
      params: params.value,
      disabled: true,
    },
    {
      text: "Delete User",
      to: "team-id-delete",
      params: params.value,
      disabled: true,
    },
  ];
});

const address = computed(() => user.value.address);

const items = computed(() => {
  return [
    {
      text: "Full Name",
      to: "profile-name",
      icon: "mdi-account-circle-outline",
      subtitle: `${user.value.givenName} ${user.value.surname}`,
    },
    {
      text: "Address",
      to: "profile-address",
      icon: "mdi-map-marker",
      subtitle: `${
        address.value.address1 ? address.value.address1 + ", " : ""
      } ${address.value.city ? address.value.city + ", " : ""} ${
        address.value.postalCode
      }`,
    },
    // {
    // 	text: "Organization",
    // 	to: "profile-organization",
    // 	icon: "mdi-briefcase-variant",
    // },
    {
      text: "Email",
      to: "profile-email",
      icon: "mdi-email",
      subtitle: user.value.email,
    },
    {
      text: "Primary Number",
      to: "profile-home-phone",
      icon: "mdi-phone",
      subtitle: user.value.primaryPhone,
    },
    {
      text: "Mobile Number",
      to: "profile-contact",
      icon: "mdi-cellphone",
      subtitle: user.value.mobilePhone,
    },
  ];
});
</script>
