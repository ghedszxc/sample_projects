<template>
  <v-row no-gutters justify="center" class="py-lg-8 mobile-max-height">
    <v-row no-gutters justify="center" class="py-lg-8">
      <v-col cols="12" xxl="4" xl="4" lg="5" class="font-weight-light mt-lg-4">
        <v-card
          width="100%"
          elevation="0"
          style="border-width: thin"
          class="mobile-max-height"
        >
          <v-form v-model="isOrganizationValid" @submit.prevent="submit()">
            <v-row no-gutters justify="center">
              <v-col cols="12" class="pa-4">
                <v-row no-gutters class="fill-height" align-content="center">
                  <v-btn
                    fav
                    density="compact"
                    icon="mdi-arrow-left"
                    variant="text"
                    class="mt-1"
                    @click="goBack()"
                  ></v-btn>
                  <span
                    class="ml-2 text-h6 font-weight-bold text-capitalize"
                    style="letter-spacing: 2px !important"
                  >
                    {{ organization.name }}
                  </span>
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-divider></v-divider>
              </v-col>

              <v-col cols="12">
                <v-row no-gutters class="pa-8">
                  <v-col cols="12" class="mb-8">
                    <v-img
                      src="/organization-update-status.svg"
                      height="150px"
                    ></v-img>
                  </v-col>
                  <v-col cols="12" class="mb-4">
                    <div
                      class="text-subtitle-1 text-medium-emphasis text-center"
                    >
                      Are you sure you want to delete this Organization?
                    </div>
                  </v-col>

                  <v-col
                    cols="12"
                    v-if="$ability.can('delete', 'delete-organizations')"
                  >
                    <v-row no-gutters justify="center" class="align-center">
                      <v-col cols="12" lg="6" md="6" sm="6" xs="6">
                        <v-btn
                          theme="dark"
                          class="font-weight-bold w-100"
                          type="submit"
                          color="red"
                        >
                          Yes
                        </v-btn>
                      </v-col>

                      <v-col
                        cols="12"
                        lg="6"
                        md="6"
                        sm="6"
                        xs="6"
                        class="pa-0 pl-lg-4 pl-md-4"
                      >
                        <v-btn
                          variant="outlined"
                          class="font-weight-bold w-100 mt-4 mt-sm-0"
                          :to="{ name: 'organizations' }"
                        >
                          No
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure", "organization"],
});

const { organization, deleteOrgById } = useOrganization();
const { setSnackbar } = useLocal();

function goBack() {
  useRouter().back();
}

async function submit() {
  try {
    const deletion = await deleteOrgById(organization.value._id as string);
    setSnackbar({
      text: deletion,
      modal: true,
      type: "success",
    });
    setTimeout(() => goBack(), 2000);
  } catch (err) {
    setSnackbar({ text: err as string, modal: true, type: "error" });
  }
}
</script>
<style>
@media (max-width: 600px) {
  .mobile-max-height {
    height: 100%;
  }
}
</style>
