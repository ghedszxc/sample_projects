<template>
  <v-row no-gutters class="fill-height" align-content="center">
    <v-col cols="12">
      <v-row no-gutters justify="center">
        <v-card
          style="
            display: flex;
            padding: 28px 23px 32px 37px;
            justify-content: flex-end;
            align-items: center;
            border-radius: 80px;
            border: 10px solid var(--icon-gradient, #b9b8c0);
            box-shadow: 0px 10px 20px 0px rgba(201, 201, 201, 0.3);
          "
        >
          <v-img
            src="/icons/resident/home/coming-soon.svg"
            style="width: 64px; height: 64px"
          />
        </v-card>
      </v-row>
    </v-col>
    <v-col
      cols="12"
      class="text-center mt-10"
      style="
        font-size: 32px;
        font-style: normal;
        font-weight: 600;
        line-height: 48px;
      "
    >
      Coming Soon!
    </v-col>
    <v-col
      cols="12"
      class="text-center mt-6"
      style="
        font-size: 16px;
        font-style: normal;
        font-weight: normal;
        line-height: 30px;
      "
    >
      This Page is under Construction
    </v-col>
    <v-col cols="12" class="text-center mt-10 px-8">
      <v-btn
        flat
        color="#E0241C"
        style="
          height: 57px;
          width: 376px;
          font-size: 20px;
          border-radius: 8.702px;
          box-shadow: 0px 13.053px 15.229px 0px rgba(233, 38, 30, 0.1);
        "
        @click="useRouter().push('/resident')"
      >
        home
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "only-footer",
});
</script>

<style scoped></style>
