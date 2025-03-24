<script setup lang="ts">
defineProps({
  name: String,
  phone: String,
  email: String,
  officeHours: String,
  rejectionSerialNumber: String,
  purposeOfVisit: String,
});

const { theme } = useLocal();

onMounted(async () => {
  if (!theme.value) theme.value = "light";
});

const textColor = computed(() =>
  theme.value === "dark" ? "#FFFFFF" : "#0F131C",
);
</script>
<template>
  <v-row no-gutters class="pa-6" justify="center">
    <v-col cols="12" class="mb-4">
      <p class="text-heading text-center pa-4" :style="{ color: textColor }">
        Hey {{ $props.name?.split(" ")[0] }},
      </p>
      <p class="text-content text-center" :style="{ color: textColor }">
        Registration Error: Access Denied
      </p>
    </v-col>

    <v-col cols="12" class="mt-4 pa-4 message-box">
      <v-col cols="12" class="mt-4 pa-4 cta-button">
        <p class="text-white text-center">
          #{{ $props.rejectionSerialNumber }}
        </p>
      </v-col>

      <div class="mt-4">
        <p class="reason-text text-white">Purpose of visit</p>
      </div>
      <div class="">
        <p class="text-style-visit text-white">{{ $props.purposeOfVisit }}</p>
      </div>

      <div class="mt-4">
        <p class="reason-text-body text-white">
          We regret to inform you that your registration could not be completed
          as the information provided matches an entry in our restricted access
          list. If you believe this is a mistake or if you have any concerns
          regarding this matter, please contact the building management directly
          to discuss and potentially resolve the issue. We appreciate your
          understanding and cooperation.
        </p>
      </div>

      <div class="mt-4">
        <v-text-field class="text-field-style mb-6 mt-3" readonly hide-details>
          <span> Phone: {{ $props.phone ?? "[Insert phone number]" }} </span>
        </v-text-field>
        <v-text-field class="text-field-style mb-6" readonly hide-details>
          Email: {{ $props.email ?? "[Insert email address]" }}
        </v-text-field>
        <v-text-field class="text-field-style mb-6" readonly hide-details>
          Office Hours: {{ $props.officeHours ?? "[Insert office hours]" }}
        </v-text-field>
      </div>

      <div class="mt-4">
        <p class="reason-text-body" style="color: #eb261e">
          Thank you for your attention to this matter.
        </p>
      </div>
    </v-col>
  </v-row>
</template>
<style scoped>
.text-heading {
  color: #052439;
  font-weight: 600;
  font-size: 32px;
  line-height: 30px; /* 150% */
}

.text-content {
  color: #052439;
  font-weight: 400;
  font-size: 16px;
  font-style: normal;
  line-height: 30px; /* 150% */
}
.reason-text {
  color: #fff;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px; /* 190% */
}
.reason-text-body {
  font-weight: 300;
  font-size: 14px;
  font-style: normal;
  line-height: 24px; /* 150% */
}
.cta-button {
  background-color: #eb261e;
  border-radius: 16px;
}
.cta-text {
  font-weight: 300;
  font-size: 16px;
  font-style: normal;
  line-height: 24px; /* 150% */
}
.message-box {
  border-top: 1px solid var(--dark-grey-border, #343a45);
  border-bottom: 1px solid var(--dark-grey-border, #343a45);
  background: var(--Corporate-blue, #111723);
  box-shadow: 0px 0px 14px 0px rgba(255, 255, 255, 0.1);
  background-color: #111723;
  border-radius: 16px;
}

.text-field-style {
  border-radius: 4px;
  border: 2px solid var(--dark-grey-border, #343a45);
  background: var(--Corporate-blue, #111723);

  /* card-ds */
  box-shadow: 0px 0px 14px 0px rgba(255, 255, 255, 0.1);
  color: #fff;
  text-align: right;
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  line-height: 24px; /* 171.429% */
}

.text-style-visit {
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px; /* 118.75% */
}
</style>
