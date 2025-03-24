<template>
    <v-row class="align-center text-center custom-loading">
        <v-col cols="12" class="text-h6 font-weight-bold">
            <v-progress-circular color="blue" indeterminate height="4" class="mt-4" />
            <div class="mt-4">
                Loading ...
            </div>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
// definePageMeta({
//   middleware: "secure",
// });

</script>
<style scoped>
.custom-loading {
    background-color: #FFFFFF;
    opacity: 0.5;
    position: absolute;
    height: 100%;
    width: 95%;
    z-index: 1;
}
</style>