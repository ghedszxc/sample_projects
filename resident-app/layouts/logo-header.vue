<script setup lang="ts"></script>
<template>
  <v-app>
    <div>
      <v-col cols="12">
        <v-row align-content="center" justify="center">
          <v-img src="/seven365.png" style="width: 50px; height: 50px"></v-img>
        </v-row>
      </v-col>
    </div>
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
<style scoped>
div {
  background-color: #052439;
  height: 12vh;
}
</style>
