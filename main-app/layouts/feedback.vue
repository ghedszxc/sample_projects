<template>
  <v-app :theme="theme">
    <v-app-bar>
      <template #prepend>
        <v-btn icon :to="{ name: 'home' }">
          <v-icon size="30">mdi-arrow-left</v-icon>
        </v-btn>
      </template>

      <template #default>
        <span class="font-weight-bold text-h6">My feedbacks</span>
      </template>

      <template #append>
        <v-btn icon>
          <v-icon size="30">mdi-help-circle-outline</v-icon>
        </v-btn>
      </template>

      <template #extension>
        <v-tabs align-tabs="center" grow stacked hide-slider>
          <template v-for="feedStatusItem in feedStatus">
            <v-tab stacked :to="{ name: feedStatusItem.to }">
              <v-icon>
                {{ feedStatusItem.icon }}
              </v-icon>
              {{ feedStatusItem.title }}
            </v-tab>
          </template>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-main>
      <slot />
    </v-main>

    <v-footer app>
      <v-btn
        block
        variant="tonal"
        size="x-large"
        :to="{ name: 'feedbacks-create' }"
      >
        create new feedback
      </v-btn>
    </v-footer>
  </v-app>
</template>

<script setup>
const { theme } = useUtils();
const feedStatus = [
  {
    title: "Sent",
    to: "feedbacks",
    icon: "mdi-send",
  },
  {
    title: "in progress",
    to: "feedbacks-in-progress",
    icon: "mdi-clock-outline",
  },
  {
    title: "history",
    to: "feedbacks-history",
    icon: "mdi-history",
  },
];
</script>
