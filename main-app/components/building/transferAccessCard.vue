<template>
  <v-dialog
    v-model="transferAccessCardDialog"
    transition="dialog-right-transition"
    fullscreen
    persistent
    :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
  >
    <!-- :loading="isProgress" -->
    <v-card
      :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
      :class="`${theme == 'light' && 'bg-white'} px-3 h-100 ${$vuetify.display.mdAndUp && 'rounded-s-xl'}`"
      :loading="isAssigningNFC"
    >
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="orange"
          height="8"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
        <v-btn
          color="grey-darken-1"
          icon="mdi-arrow-left"
          @click="onHideDialog()"
        ></v-btn>
        <span class="font-weight-bold pt-1 text-capitalize">
          Transfer {{ props.title }} Access Card
        </span>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text>
        <v-list>
          <v-list-item class="mb-4">
            <v-text-field
              v-model="search"
              placeholder="Search name, id"
              hide-details
              density="compact"
              append-inner-icon="mdi-magnify"
            ></v-text-field>
            <v-divider class="mt-3" />
          </v-list-item>
          <template
            v-for="(data, key) in users.filter((find: any) =>
              search
                ? find.name.toLowerCase().includes(search.toLowerCase())
                : find,
            )"
            :key="key"
          >
            <v-list-item
              class="border rounded ma-4"
              @click="selectedUser = data"
            >
              <v-icon
                size="small"
                class="mr-2"
                :color="
                  selectedUser && selectedUser._id == data._id
                    ? 'green'
                    : 'grey'
                "
              >
                {{
                  `mdi-${selectedUser && selectedUser._id == data._id ? "radiobox-marked" : "radiobox-blank"}`
                }}
              </v-icon>
              {{ `${data.givenName} ${data.surname}` }}
            </v-list-item>
          </template>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-row no-gutters>
          <v-col cols="12" class="text-center pb-5">
            <v-btn
              color="blue-darken-3"
              variant="flat"
              size="small"
              style="height: 40px; width: 85%"
              @click="onAssign()"
              :loading="isAssigningNFC"
              :disabled="!selectedUser"
            >
              Transfer
            </v-btn>
          </v-col>
          <v-col cols="12" class="text-center pb-2">
            <span :class="`${$vuetify.display.mdAndUp && 'pl-4'} text-caption`">
              @ 2024 by Seven 365 Pte Ltd V1.0
            </span>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps({
  title: String,
  users: [],
});

type _TUser = {
  _id: string;
  givenName: string;
  surname: string;
};

const emit = defineEmits(["onTransfer"]);

const { transferAccessCardDialog } = useBlockLevelUnit();
const { accessCards, isAssigningNFC } = useEntryPass();
const { theme, setSnackbar } = useLocal();

const search = ref("");
const selectedUser = ref<_TUser | any>();

const users = computed(() => {
  let items = [] as _TUser[];
  let users = props.users as any;

  if (users && Array.isArray(users)) {
    items = users.map((item: any) => ({
      selected: false,
      _id: item._id,
      givenName: item.givenName,
      surname: item.surname,
    }));
  }

  return items;
});

async function onHideDialog() {
  transferAccessCardDialog.value = false;
}

async function onAssign() {
  emit("onTransfer", selectedUser);
}
</script>

<style scoped>
.dialog_desktop {
  margin: 0 0 0 auto;
  max-width: 28rem;
  border-radius: 25px 0 0 25px;

  box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: -6px 1px 5px 0px rgba(0, 0, 0, 0.1);
}

:deep() .v-field__outline {
  --v-field-border-opacity: 0.1;
}

:deep() .v-overlay__scrim {
  opacity: var(--v-overlay-opacity, 0);
}

:deep() .v-switch .v-selection-control {
  display: flex;
  flex-direction: row-reverse;
}

@media (max-width: 768px) {
  :deep(.v-autocomplete input) {
    font-size: 16px !important;
  }
  :deep() .v-text-field input {
    font-size: 16px !important;
  }
  :deep() .v-textarea .v-field__input {
    font-size: 16px !important;
  }
}

@media (min-width: 769px) {
  :deep(.v-autocomplete input) {
    font-size: 13px !important;
  }
  :deep() .v-text-field input {
    font-size: 13px !important;
  }
  :deep() .v-textarea .v-field__input {
    font-size: 13px !important;
  }

  .flash-effect {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    opacity: 0;
    transition: opacity 0.1s ease-out;
    pointer-events: none;
    border: "1px solid red";
  }

  .flash-effect.active {
    opacity: 1;
  }
}
</style>
