<template>
  <v-row no-gutters class="pa-8" justify="center">
    <v-col cols="12">
      <v-row no-gutters>
        <v-col cols="12">
          <v-row no-gutters class="fill-height" align="center">
            <v-col cols="6">
              <v-row no-gutters>
                <v-col cols="12">
                  <back-button />
                  <span
                    class="ml-3 text-h6 font-weight-bold text-capitalize"
                    style="letter-spacing: 2px !important"
                  >
                    {{ organization.name }}
                  </span>
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
                        v-for="(actionItem, actionIndex) in filteredActions"
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
          v-for="(item, itemIndex) in items"
          :key="item.text"
          class="my-3"
        >
          <v-card
            width="95%"
            elevation="1"
            style="border-radius: 24px"
            height="368px"
            link
            :to="{
              name: item.to,
              params: item.params,
            }"
            class="pa-8"
          >
            <v-row no-gutters class="fill-height" align-content="center">
              <v-col cols="12">
                <v-row no-gutters justify="center">
                  <v-img
                    :src="item.imageUrl"
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
                {{ item.subtitle }}
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
  middleware: ["secure", "organization"],
});
const { $ability } = useNuxtApp();
const { organization } = useOrganization();

const id = computed(() => useRoute().params.organization as string);

const actionMenu = ref(false);
const params = ref({
  organization: id.value,
});
const actions = [
  {
    text: "Suspend Organization",
    to: "organizations-organization-suspend",
    params: params.value,
    disabled: true,
    action: "update",
    subject: "organizations",
  },
  {
    text: "Activate Organization",
    to: "organizations-organization-activate",
    params: params.value,
    disabled: true,
    action: "update",
    subject: "organizations",
  },
  {
    text: "Delete Organization",
    to: "organizations-organization-delete",
    params: params.value,
    disabled: true,
    action: "delete",
    subject: "organizations",
  },
];

const filteredActions = computed(() => {
  return actions.filter((action) =>
    $ability.can(action.action, action.subject),
  );
});

function goBack() {
  useRouter().back();
}
const org = computed(() => organization.value);

const items = computed(() => {
  return [
    {
      text: "Organization Name",
      to: "organizations-organization-name",
      params: params.value,
      imageUrl: "/organization-name.svg",
      subtitle: org.value.name,
      class: "text-center",
    },
    {
      text: "Team",
      to: "organizations-organization-team",
      params: params.value,
      imageUrl: "/organization-team.svg",
      subtitle: `${org.value.team || 0}`,
      class: "text-center",
    },
    {
      text: "Sites",
      to: "organizations-organization-sites",
      params: params.value,
      imageUrl: "/organization-sites.svg",
      subtitle: `${org.value.sites || 0}`,
      class: "text-center",
    },
    {
      text: "Email",
      to: "organizations-organization-email",
      params: params.value,
      imageUrl: "/organization-email.svg",
      subtitle: org.value.email,
      class: "text-center",
    },
    {
      text: "Contact Number",
      to: "organizations-organization-contact",
      params: params.value,
      imageUrl: "/organization-contact-number.svg",
      subtitle: org.value.contactNumber,
      class: "text-center",
    },
    {
      text: "Status",
      to: "organizations-organization-activate",
      params: params.value,
      imageUrl: "/organization-status.svg",
      subtitle: org.value.status,
      class: "text-capitalize text-center",
    },
  ];
});
</script>
