<template>
  <v-app :theme="theme">
    <v-main>
      <slot />
    </v-main>

    <v-footer app class="pa-0" style="border-width: thin">
      <v-tabs align-tabs="center" grow stacked hide-slider height="50px">
        <v-tab class="text-caption pa-0" :to="{ name: 'home' }">
          <v-icon size="30">mdi-home-outline</v-icon>
        </v-tab>

        <v-tab class="text-caption pa-0" :to="{ name: 'contacts' }">
          <v-icon size="30">mdi-phone-in-talk-outline</v-icon>
        </v-tab>

        <v-tab class="text-caption pa-0" :to="{ name: '' }">
          <v-icon size="30">mdi-plus-circle-outline</v-icon>
        </v-tab>

        <v-tab class="text-caption pa-0" :to="{ name: '' }">
          <v-icon size="30">mdi-bell-outline</v-icon>
        </v-tab>

        <v-tab class="text-caption pa-0" :to="{ name: 'menu' }">
          <v-icon size="30">mdi-menu</v-icon>
        </v-tab>
      </v-tabs>
    </v-footer>
  </v-app>
</template>

<script setup>
const { theme } = useLocal();
const { currentUser } = useLocalAuth();

theme.value = "white";
</script>

<style>
.background {
  background-size: cover;
  background-position: center;
  height: 30vh;
}
</style>
