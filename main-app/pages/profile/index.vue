<template>
  <div>
    <div style="height: 347px; position: relative; margin-bottom: -280px">
      <v-img
        v-if="backgroundImage"
        :src="`/api/files/${backgroundImage}`"
        cover
      ></v-img>
      <v-img
        v-else
        :src="`${useRuntimeConfig().public.S3_BUCKET}/images/bg/condo.jpg`"
        cover
      >
      </v-img>
    </div>
    <v-row no-gutters class="pa-6 mb-1 profile-card" justify="center">
      <v-col cols="12" md="10" xxl="10" xl="10" lg="10">
        <ProfileFormProfile :userId="currentUser._id" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure", "role", "user"],
});
const { currentUser } = useLocalAuth();
const { user, updateUserRole, updateUserProfile } = useUser();
const address = currentUser.value.address;

const readOnlyCondition = ref(true);
const isLoading = ref(false);

const permissions = ref(["View Only"]);
const backgroundImage = ref<string | null>(null);

const { getSiteSettingsById } = useSiteSettings();
const { mySite } = useFilter();

onMounted(async () => {
  permissions.value = [user.value.role?.roleName];
  const result: any = await getSiteSettingsById(mySite.value);
  if (result?.siteInformation?.bgImage) {
    backgroundImage.value = result.siteInformation.bgImage as string | null;
  }
});
</script>
<style scoped>
.pill {
  height: 35px;
  width: 100%;
  border-radius: 100px;
}
</style>
