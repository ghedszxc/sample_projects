<template>
  <v-row
    no-gutters
    justify="center"
    align-content="center"
    class="fill-height py-8"
  >
    <v-col cols="8" class="font-weight-light mt-4">
      <v-card width="100%" elevation="0" style="border-width: thin">
        <v-row no-gutters class="pa-8" justify="center">
          <v-col
            cols="12"
            class="text-h4 font-weight-bold mb-4 text-center"
            style="letter-spacing: 2px !important"
          >
            {{ visitor.name }}
          </v-col>

          <v-col cols="12" class="text-center">
            Are you sure you want to delete this visitor record?
          </v-col>

          <v-col cols="12" class="mt-4">
            <v-row no-gutters justify="center">
              <v-btn theme="dark" class="font-weight-bold" @click="submit">
                Yes
              </v-btn>
              <v-btn
                variant="text"
                class="font-weight-bold"
                :to="{
                  name: 'feedbacks',
                  query: {
                    site: mySite,
                  },
                }"
              >
                No
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

const id = computed(() => useRoute().params.id as string);
const { deleteVisitor, getVisitorById, setVisitor, visitor } = useVisitor();
const { getSitesOptionsForFiltering, mySite } = useFilter();

onMounted(async () => {
  const [result] = await Promise.all([
    getVisitorById(id.value),
    getSitesOptionsForFiltering(),
  ]);
  setVisitor(result as TVisitor | undefined);
});

async function submit() {
  const router = useRouter();

  await deleteVisitor(id.value);
  await router.push({
    name: "visitors",
    query: {
      site: mySite.value,
    },
  });
}
</script>
