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
            src="/images/throw.svg"
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
            {{ roleName }}
          </v-col>

          <v-col cols="12" class="text-center">
            Are you sure you want to delete this role?
          </v-col>

          <v-col cols="12" class="mt-4">
            <v-row no-gutters justify="center">
              <v-btn
                theme="dark"
                class="font-weight-bold"
                variant="elevated"
                color="red darken-2"
                @click="submit"
              >
                Yes
              </v-btn>
              <v-btn
                variant="outlined"
                class="font-weight-bold ml-4"
                color="accent-4"
                :to="{
                  name: 'roles',
                  params: { id },
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
const { deleteRole, roleName } = useRole();
const { setSnackbar } = useLocal();

function goBack() {
  useRouter().back();
}

async function submit() {
  try {
    await deleteRole(id.value);
    setSnackbar({ text: "Successfully Deleted", modal: true, type: "success" });
    goBack();
  } catch (error: any) {
    setSnackbar({ text: error.message, type: "error", modal: true });
  }
}
</script>
