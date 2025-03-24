<template>
  <v-row
    no-gutters
    justify="center"
    align-content="center"
    class="fill-height py-8"
  >
    <v-col cols="10" lg="8" class="font-weight-light mt-4">
      <v-card width="100%" elevation="0" style="border-width: thin">
        <v-row no-gutters class="pa-8" justify="center">
          <v-img
            src="/images/activate.svg"
            alt="User Image"
            width="12rem"
            height="15rem"
            class="mb-4"
          ></v-img>
          <v-col
            cols="12"
            class="text-h4 font-weight-bold mb-4 text-center"
            style="letter-spacing: 2px !important"
          >
            {{ feedback.subject }}
          </v-col>

          <v-col cols="12" class="text-center">
            {{
              feedback.status && feedback.status == "Pending"
                ? "Are you sure you want to assign this feedback to you?"
                : feedback.status && /^(to-do|todo)$/i.test(feedback.status)
                  ? "Are you sure you want to resolve the task for this feedback?"
                  : "Are you sure you want to complete the task for this feedback?"
            }}
          </v-col>

          <v-col cols="12" class="mt-4">
            <v-row no-gutters justify="center">
              <v-btn
                theme="dark"
                class="font-weight-bold"
                variant="elevated"
                color="green darken-2"
                @click="submit"
              >
                Yes
              </v-btn>
              <v-btn
                variant="outlined"
                class="font-weight-bold ml-4"
                color="accent-4"
                :to="{
                  name: 'feedbacks',
                  query: { site: mySite },
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
const { feedback, updateFeedback, getFeedbackById, setFeedback } =
  useFeedback();
const { currentUser } = useLocalAuth();
const { getSitesOptionsForFiltering, mySite } = useFilter();

onBeforeMount(async () => {
  const [result] = await Promise.all([
    getFeedbackById(id.value),
    getSitesOptionsForFiltering(),
  ]);
  setFeedback(result);
});

async function submit() {
  const router = useRouter();
  const payload =
    feedback.value.status == "Pending"
      ? { assignee: currentUser.value._id, status: "On Going" }
      : feedback.value.status && /^(to-do|todo)$/i.test(feedback.value.status)
        ? { status: "Resolved" }
        : { status: "Completed" };

  await updateFeedback(id.value, payload as TFeedback);
  router.push({
    path: "/feedbacks",
    query: { site: mySite.value },
  });
}
</script>
