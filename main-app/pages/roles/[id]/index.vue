<template>
  <div no-gutter class="pa-4 pa-md-8">
    <v-col cols="12">
      <v-card width="100%" elevation="3" height="100%">
        <v-row no-gutters>
          <v-col cols="12" class="">
            <v-col cols="12">
              <v-row no-gutters>
                <v-col cols="6">
                  <back-button />
                  <span
                    class="text-h6 font-weight-bold ml-2 ml-md-0"
                    style="font-size: 20px"
                  >
                    Roles & Permission
                  </span>
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
            </v-col>
            <v-form v-model="isRoleValid" @submit.prevent="submit()">
              <v-table
                height="67vh"
                :style="$vuetify.display.mdAndDown ? 'font-size: 0.8rem;' : ''"
                fixed-header
              >
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
                              !$ability.can('update', 'edit-roles') ||
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
                              !$ability.can('update', 'edit-roles') ||
                              module.slug === 'dashboard' ||
                              module.slug === 'profile'
                            "
                            v-model="create.isEnabled"
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
                              !$ability.can('update', 'edit-roles') ||
                              module.slug === 'dashboard' ||
                              module.slug === 'profile'
                            "
                            v-model="update.isEnabled"
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
                              !$ability.can('update', 'edit-roles') ||
                              module.slug === 'dashboard' ||
                              module.slug === 'profile'
                            "
                            v-model="del.isEnabled"
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
                            !$ability.can('update', 'edit-roles') ||
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
                        v-model="roleName"
                        placeholder="Enter roles & permission name"
                        label="Roles & Permission Name"
                        :persistent-hint="false"
                        density="comfortable"
                        :rules="[requiredInput]"
                        :readonly="!$ability.can('update', 'edit-roles')"
                        :clearable="$ability.can('update', 'edit-roles')"
                      >
                      </v-text-field>
                    </v-col>
                    <v-spacer></v-spacer>

                    <v-col
                      cols="2"
                      md="4"
                      lg="3"
                      v-if="$ability.can('update', 'edit-roles')"
                    >
                      <v-btn
                        block
                        :disabled="!isRoleValid"
                        type="submit"
                        color="primary"
                        size="large"
                        class="ml-2"
                      >
                        <v-icon class="mr-md-2"> mdi-update </v-icon>
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
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["secure"],
});
const { $ability } = useNuxtApp();
const id = computed(() => useRoute().params.id);
const { requiredInput } = useUtils();
const {
  setRole,
  role,
  updateRole,
  isRoleValid,
  permissionById,
  permissionFilter,
  getRoleById,
  roleName,
} = useRole();

onMounted(async () => {
  setRole();
  await getRoleById(id.value);
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

const filteredPermissions = computed(() => {
  if (permissionFilter.value === "All") {
    return permissionById.value;
  }
  return permissionById.value.filter(
    (module) => module.application === permissionFilter.value.toLowerCase(),
  );
});

const { setSnackbar } = useLocal();
async function submit() {
  try {
    const payload = {
      ...role.value,
      name: roleName.value,
      permissions: JSON.parse(JSON.stringify(permissionById.value)),
    };
    await updateRole(id.value, payload);
    setSnackbar({
      text: "Role updated successfully",
      type: "success",
      modal: true,
    });
    goBack();
  } catch (error) {
    setSnackbar({ text: error.message, type: "error", modal: true });
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
