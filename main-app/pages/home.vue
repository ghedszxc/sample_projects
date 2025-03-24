<template>
  <v-row no-gutters class="fill-height pa-2 d-flex">
    <v-col cols="12" class="mt-2">
      <v-row no-gutters>
        <template v-for="menuItem in menu" :key="menuItem.icon">
          <v-col cols="6" class="pa-2">
            <v-card class="pa-4" :to="{ name: menuItem.to }">
              <v-row no-gutters>
                <v-col cols="12">
                  <v-icon>{{ menuItem.icon }}</v-icon>
                </v-col>
                <v-col cols="12"> {{ menuItem.title }} </v-col>
              </v-row>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup>
definePageMeta({
  layout: "resident",
  middleware: "secure",
});
const { currentUser } = useLocalAuth();

const menu = [
  {
    title: "Listings",
    icon: "mdi-bulletin-board",
    to: "listings",
  },
  {
    title: "Notice Board",
    icon: "mdi-bulletin-board",
    to: "notice-board",
  },
  {
    title: "Forms",
    icon: "mdi-note-text-outline",
    to: "forms",
  },
  {
    title: "Contacts",
    icon: "mdi-phone-in-talk-outline",
    to: "contacts",
  },
  {
    title: "Neighbours",
    icon: "mdi-account-group",
    to: "neighbours",
  },
  {
    title: "Access",
    icon: "mdi-key",
    to: "access",
  },
  {
    title: "Feedback",
    icon: "mdi-comment-quote",
    to: "feedbacks",
  },
];
</script>
