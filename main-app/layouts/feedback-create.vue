<template>
  <v-app :theme="theme">
    <v-app-bar>
      <template #prepend>
        <v-btn icon :to="{ name: 'feedbacks' }">
          <v-icon size="30">mdi-arrow-left</v-icon>
        </v-btn>
      </template>

      <template #default>
        <v-row no-gutters>
          <v-col cols="12" class="font-weight-bold text-h6 text-center">
            Feedback
          </v-col>
          <v-col cols="12" class="text-center"> to the management </v-col>
        </v-row>
      </template>

      <template #append>
        <v-btn icon>
          <v-icon size="30">mdi-help-circle-outline</v-icon>
        </v-btn>
      </template>
    </v-app-bar>
    <v-main>
      <slot />
    </v-main>

    <v-footer app>
      <v-btn block variant="tonal" size="x-large" :disabled="!feedbackIsValid">
        send feedback
      </v-btn>
    </v-footer>
  </v-app>
</template>

<script setup>
const { theme } = useUtils();

const { feedbackIsValid } = useFeedback();
</script>
