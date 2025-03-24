<template>
  <v-dialog
    v-model="assignMultipleDialog"
    transition="dialog-right-transition"
    fullscreen
    :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
    :persistent="false"
  >
    <v-card>
      <v-toolbar
        class="d-flex align-center px-4"
        :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`"
      >
        <span class="font-weight-bold pl-2 text-capitalize text-body-1">
          Assign {{ props.type }} Access Card
        </span>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text>
        <v-text-field
          v-model="search"
          placeholder="Search name, id"
          hide-details
          density="compact"
          append-inner-icon="mdi-magnify"
        ></v-text-field>

        <v-data-iterator :page="1" :items="users" :items-per-page="10">
          <template v-slot:header><v-divider class="mt-4" /></template>
          <template #default="{ items }">
            <v-list class="pa-0 mt-2 height-fill">
              <template v-for="(item, itemIndex) in items" :key="itemIndex">
                <v-list-item
                  class="rounded-sm my-2"
                  :style="{
                    border: $vuetify.display.mdAndUp
                      ? theme == 'light'
                        ? '1px solid #E0E0E0'
                        : '1px solid #424242'
                      : '',
                  }"
                >
                  <v-list-item-title>
                    <v-row no-gutters align="center">
                      <v-col cols="12" class="text-capitalize">
                        <v-row no-gutters align="center">
                          <v-checkbox
                            density="compact"
                            class="text-body-2 align-center d-flex shrink h-25 mr-2"
                            color="primary"
                            @update:modelValue="
                              onSelectUser($event, item.raw._id)
                            "
                          ></v-checkbox>
                          <span
                            class="text-capitalize text-body-2"
                            style="word-break: break-word; white-space: normal"
                          >
                            <v-avatar
                              size="small"
                              :color="stringToColor(`${item.raw.givenName}`)"
                              class="mr-2 text-body-2"
                            >
                              {{ getInitial(`${item.raw.givenName}`) }}
                            </v-avatar>

                            {{ `${item.raw.givenName} ${item.raw.surname}` }}
                          </span>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-list-item-title>
                </v-list-item>

                <v-divider v-if="itemIndex + 1 !== items.length"></v-divider>
              </template>
            </v-list>
            <v-btn
              color="primary"
              block
              variant="flat"
              size="small"
              style="height: 45px"
              class="my-4"
              @click="emit('onAssign', selected)"
              :disabled="selected.length < 1"
              :loading="isAssigningNFC"
              >Assign</v-btn
            >
          </template>

          <template #no-data>
            <v-row no-gutters justify="center" class="pa-16">
              <v-col cols="12">
                <v-row no-gutters justify="center">
                  <v-img src="/empty.svg" width="150px" height="150px"></v-img>
                </v-row>
              </v-col>

              <v-col cols="12" class="mt-10">
                <v-row no-gutters justify="center">
                  <span class="font-weight-bold text-body-1">
                    Assign {{ props.type }} Access Card
                  </span>
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-row no-gutters justify="center">
                  <span class="text-disabled text-body-2">
                    You don't have list of users.
                  </span>
                </v-row>
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import debounce from "lodash/debounce";

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  users: {
    type: [],
    default: [],
  },
});

type _TUser = {
  _id: string;
  givenName: string;
  surname: string;
};

const emit = defineEmits(["onAssign"]);

const { theme } = useLocal();
const { assignMultipleDialog, isAssigningNFC } = useEntryPass();
const { getInitial, stringToColor } = useUtils();

const search = ref("");
const selected = ref<string[]>([]);
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

watch(search, (newValue: string) => {
  debouncedSearch(newValue);
});

const debouncedSearch = debounce(async (value: string) => {}, 500);
const onSelectUser = (value: any, id: string) => {
  if (value) {
    selected.value.push(id);
  } else {
    selected.value = selected.value.filter((item: string) => item !== id);
  }
};
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
</style>
