<template>
  <v-row no-gutters justify="center" class="px-5">
    <GoBackArrow header-text="Pets Record form" @go-back="goBack" />
    <FormsUpsertPetRecords @on-submit="onSubmit" />
  </v-row>
</template>
<script setup lang="ts">
definePageMeta({
  key: "pet-record-form",
  layout: "resident-bottom-navigation",
  middleware: "secure",
});

const { addItem, updateItem } = usePetRecords();
const { updateFormStatus } = useForms();
const { currentUser } = useLocalAuth();
const router = useRouter();

const userFullName = computed(
  () => `${currentUser.value.surname}, ${currentUser.value.givenName}`,
);

async function onSubmit(data: TPetRecords, queryAction: string) {
  if (queryAction === "edit") {
    data._id ? await updateItem(data._id, data) : console.log("Unable to Edit");
  } else if (queryAction === "view") {
    const payload = {
      status: data.status || "",
      reason: `Cancelled by ${userFullName.value}`,
    };
    data._id
      ? await updateFormStatus(data._id, payload)
      : console.log("Unable to Cancel");
    goBack();
  } else {
    await addItem(data);
  }
}

const goBack = () => router.replace({ name: "online-forms" });
</script>
<style scoped></style>
