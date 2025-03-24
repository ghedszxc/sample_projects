<template>
  <v-row no-gutters justify="center" class="py-8">
    <v-col cols="6" class="font-weight-light mt-4">
      <v-card
        width="100%"
        elevation="0"
        style="border-width: thin"
        min-height="368px"
      >
        <v-form v-model="isInviteValid" @submit.prevent="submit()">
          <v-row no-gutters class="pa-8" justify="center">
            <v-col
              cols="12"
              class="text-h4 font-weight-bold mb-7 text-capitalize"
              style="letter-spacing: 2px !important"
            >
              Invite Site Team Member
            </v-col>

            <v-col>
              <span class="font-weight-bold">Email</span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="profile.email"
                density="comfortable"
                :rules="[requiredInput, validEmail]"
                clearable
              ></v-text-field>
            </v-col>

            <v-col>
              <span class="font-weight-bold">Given Name</span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="12" class="mb-4">
              <v-text-field
                v-model="user.givenName"
                density="comfortable"
                :rules="[requiredInput]"
                clearable
              ></v-text-field>
            </v-col>

            <v-col>
              <span class="font-weight-bold">Surname</span>
              <span class="text-red mx-1 mb-2">*</span>
            </v-col>
            <v-col cols="12" class="mb-8">
              <v-text-field
                v-model="user.surname"
                density="comfortable"
                :rules="[requiredInput]"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-row no-gutters>
                <v-btn
                  theme="dark"
                  class="font-weight-bold"
                  :disabled="!isInviteValid"
                  type="submit"
                >
                  submit
                </v-btn>
                <v-btn
                  variant="text"
                  class="font-weight-bold"
                  @click="cancel()"
                >
                  cancel
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

const { requiredInput, validEmail } = useUtils();
const { profile, inviteUser } = useLocalAuth();
const { user, isInviteValid, setUser } = useUser();
const route = useRoute();

onMounted(() => {
  setUser();
});

function goBack() {
  useRouter().back();
}

async function cancel() {
  goBack();
}

const { setSnackbar } = useLocal();

async function submit() {
  const orgId = route.params.organization as string;
  const siteId = route.params.site as string;
  const data = {
    givenName: user.value.givenName,
    surname: user.value.surname,
    email: profile.value.email,
    type: "site",
    organization: orgId,
    site: siteId,
    sites: [],
    role: "",
  };
  try {
    const result = await inviteUser(data);
    setSnackbar({ text: result.message, modal: true, type: "success" });
    goBack();
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  } finally {
    user.value.givenName = "";
    user.value.surname = "";
    profile.value.email = "";
  }
}
</script>
