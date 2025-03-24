<template>
  <v-row
    no-gutters
    class="fill-height"
    align-content="center"
    style="position: relative; height: 100vh"
  >
    <v-col cols="12" lg="3">
      <v-card
        :width="$vuetify.display.mobile ? '95%' : '450'"
        elevation="4"
        color="navigationDrawer"
        class="pa-8 text-center"
        rounded="xl"
        :style="{
          position: 'fixed',
          zIndex: '1',
          top: '30vh',
          left: $vuetify.display.mobile ? '2.5%' : '37vw',
        }"
      >
        <v-row
          no-gutters
          class="fill-height text-center"
          align-content="center"
        >
          <v-col cols="12">
            <v-img src="/images/log_out.png" height="130px"></v-img>
          </v-col>
          <v-col cols="12" class="my-5">
            <h2
              :class="`font-weight-light ${$vuetify.display.mobile && 'text-body-1'}`"
            >
              You have been logout
            </h2>
            <div :class="`${$vuetify.display.mobile && 'text-body-2 mt-1'}`">
              Due to inactivity
            </div>
          </v-col>
          <v-col cols="12">
            <v-btn
              :to="{ name: 'login' }"
              class="rounded-lg px-12"
              color="primary"
              size="large"
            >
              Log In
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-img
        :src="`${useRuntimeConfig().public.S3_BUCKET}/images/bg/city.jpg`"
        cover
        height="100vh"
      />
    </v-col>
  </v-row>
</template>

<script setup>
definePageMeta({
  layout: "plain",
});
const { logout } = useLocalAuth();
onMounted(() => {
  logout();
});
</script>

<style scoped>
.overlay-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.dark-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}
</style>
