<template>
  <v-row no-gutter class="pa-8">
    <v-col cols="12">
      <v-card width="100%" elevation="3" height="100%">
        <v-row no-gutters>
          <v-col cols="12" class="">
            <v-row no-gutters>
              <v-col cols="6">
                <v-row no-gutters class="fill-height" align-content="center">
                  <span
                    class="text-h6 font-weight-bold pa-4"
                    style="font-size: 20px"
                  >
                    Create Roles & Permission
                  </span>
                </v-row>
              </v-col>

              <v-col cols="6">
                <v-row class="d-flex justify-end pa-4">
                  <v-col cols="12" md="4">
                    <v-select
                      :items="['All', 'Main', 'Cleaning', 'Resident']"
                      label="Filter Type"
                      v-model="permissionFilter"
                      hide-details
                    ></v-select>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-form v-model="isRoleValid" @submit.prevent="submit()">
              <v-table height="67vh" fixed-header>
                <thead>
                  <tr>
                    <th class="first-column">Modules</th>
                    <th class="border-s">Read</th>
                    <th class="border-s first-column">Create</th>
                    <th class="border-s first-column">Update</th>
                    <th class="border-s border-e first-column">Delete</th>
                    <th class="text-center">All</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="first-column">Modules</td>
                    <td class="border-s">Read</td>
                    <td class="border-s first-column">Create</td>
                    <td class="border-s first-column">Update</td>
                    <td class="border-s border-e first-column">Delete</td>
                    <td class="text-center">All</td>
                  </tr>
                  <tr v-for="module in filteredPermissions" :key="module.slug">
                    <td>{{ module.name }}</td>
                    <td class="border-s first-column">
                      <div
                        v-if="module.read"
                        class="d-flex justify-space-between flex-column"
                      >
                        <div
                          v-for="read in module.read"
                          :key="read.slug"
                          class="d-flex align-center justify-space-between"
                        >
                          <span>{{ read.name }}</span>
                          <v-checkbox
                            :disabled="
                              module.slug === 'dashboard' ||
                              module.slug === 'profile'
                            "
                            v-model="read.isEnabled"
                            hide-details
                            color="success"
                          ></v-checkbox>
                        </div>
                      </div>
                    </td>
                    <td class="border-s first-column">
                      <div
                        v-if="module.create"
                        class="d-flex justify-space-between flex-column"
                      >
                        <div
                          v-for="create in module.create"
                          :key="create.slug"
                          class="d-flex align-center justify-space-between"
                        >
                          <span>{{ create.name }}</span>
                          <v-checkbox
                            :disabled="
                              module.slug === 'dashboard' ||
                              module.slug === 'profile'
                            "
                            v-model="create.isEnabled"
                            @change="ensureReadChecked(module)"
                            hide-details
                            color="success"
                          ></v-checkbox>
                        </div>
                      </div>
                    </td>
                    <td class="border-s first-column">
                      <div
                        v-if="module.update"
                        class="d-flex justify-space-between flex-column"
                      >
                        <div
                          v-for="update in module.update"
                          :key="update.slug"
                          class="d-flex align-center justify-space-between"
                        >
                          <span>{{ update.name }}</span>
                          <v-checkbox
                            :disabled="
                              module.slug === 'dashboard' ||
                              module.slug === 'profile'
                            "
                            v-model="update.isEnabled"
                            @change="ensureReadChecked(module)"
                            hide-details
                            color="success"
                          ></v-checkbox>
                        </div>
                      </div>
                    </td>
                    <td class="border-s border-e first-column">
                      <div
                        v-if="module.delete"
                        class="d-flex justify-space-between flex-column"
                      >
                        <div
                          v-for="del in module.delete"
                          :key="del.slug"
                          class="d-flex align-center justify-space-between"
                        >
                          <span>{{ del.name }}</span>
                          <v-checkbox
                            :disabled="
                              module.slug === 'dashboard' ||
                              module.slug === 'profile'
                            "
                            v-model="del.isEnabled"
                            @change="ensureReadChecked(module)"
                            hide-details
                            color="success"
                          ></v-checkbox>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex align-center justify-center">
                        <v-checkbox
                          :disabled="
                            module.slug === 'dashboard' ||
                            module.slug === 'profile'
                          "
                          :model-value="areAllEnabled(module)"
                          @update:model-value="toggleAll(module)"
                          color="success"
                          hide-details
                          class="all-checkbox"
                        ></v-checkbox>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </v-table>
              <v-row no-gutters class="border-t-md">
                <v-col cols="12">
                  <v-row no-gutters class="fill-height pa-4">
                    <v-col cols="10" md="8" lg="9">
                      <v-text-field
                        v-model="role.name"
                        placeholder="Enter roles & permission name"
                        label="Roles & Permission Name"
                        :persistent-hint="false"
                        density="comfortable"
                        :rules="[requiredInput]"
                        clearable
                      >
                      </v-text-field>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="2" md="4" lg="3">
                      <v-btn
                        block
                        :disabled="!isRoleValid"
                        type="submit"
                        color="primary"
                        size="large"
                        class="ml-2"
                      >
                        Save
                        <span v-if="$vuetify.display.mdAndUp"
                          >Roles & Permission</span
                        >
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
definePageMeta({
  middleware: ["secure"],
});
const { requiredInput } = useUtils();
const {
  setRole,
  addRole,
  role,
  isRoleValid,
  permissions,
  fetchPermissions,
  permissionFilter,
} = useRole();
const { getSitesOptionsForFiltering, mySite, myOrg, myProvider } = useFilter();

onMounted(async () => {
  setRole();
  await getSitesOptionsForFiltering();
  await fetchPermissions();
});

function ensureReadChecked(module) {
  const anyChecked =
    (module.create && module.create.some((create) => create.isEnabled)) ||
    (module.update && module.update.some((update) => update.isEnabled)) ||
    (module.delete && module.delete.some((del) => del.isEnabled));

  if (module.read) {
    module.read.forEach((read) => {
      read.isEnabled = anyChecked;
    });
  }
}

const filteredPermissions = computed(() => {
  if (permissionFilter.value === "All") {
    return permissions.value;
  }
  return permissions.value.filter(
    (module) => module.application === permissionFilter.value.toLowerCase(),
  );
});

function areAllEnabled(module) {
  const actions = ["read", "create", "update", "delete"];
  return actions.every((action) =>
    module[action] ? module[action].every((perm) => perm.isEnabled) : true,
  );
}

function toggleAll(module) {
  const allEnabled = areAllEnabled(module);
  const newState = !allEnabled;
  const actions = ["read", "create", "update", "delete"];
  actions.forEach((action) => {
    if (module[action]) {
      module[action].forEach((perm) => (perm.isEnabled = newState));
    }
  });
}
function goBack() {
  useRouter().back();
}

const { setSnackbar } = useLocal();

const { currentUser } = useLocalAuth();

async function submit() {
  try {
    if (currentUser.value.isAdmin) {
      role.value.permissions = permissions.value;
      role.value.createdBy = currentUser.value._id;
      role.value.site = mySite.value;
      role.value.serviceProvider = myProvider.value;
    } else {
      role.value.permissions = permissions.value;
      role.value.site = mySite.value;
      role.value.createdBy = currentUser.value._id;
    }
    role.value.organization = myOrg.value;
    await addRole(role.value);
    setSnackbar({
      text: "Role Created Successfully",
      type: "success",
      modal: true,
    });
    goBack();
  } catch (error) {
    setSnackbar({
      text: error || error.message || "Error: Something went wrong",
      type: "error",
      modal: true,
    });
  }
}
</script>

<style scoped>
.v-table td {
  border-top: 1px solid #d0d0d0;
  border-bottom: 1px solid #d0d0d0;
  font-size: larger;
}

.first-column {
  min-width: 250px;
  max-width: 250px;
}

.v-checkbox {
  min-width: 40px;
  max-width: 40px;
}
</style>
