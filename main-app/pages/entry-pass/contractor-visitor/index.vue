<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card
        width="100%"
        elevation="3"
        height="100%"
        :loading="isAccessCardLoading"
      >
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            color="deep-purple"
            height="4"
            indeterminate
          ></v-progress-linear>
        </template>

        <v-row no-gutters>
          <v-col cols="12">
            <v-row no-gutters class="px-4 pa-4" align="center">
              <v-col cols="12" md="5">
                <v-row no-gutters align="center">
                  <v-col
                    cols="12"
                    sm="6"
                    :class="$vuetify.display.xs ? 'pb-2' : ''"
                  >
                    <span class="font-weight-bold">
                      Contractor / Visitor NFC Card
                    </span></v-col
                  >
                  <v-col cols="12" sm="6"
                    ><v-text-field
                      v-model="search"
                      placeholder="Search name, id"
                      hide-details
                      density="compact"
                      append-inner-icon="mdi-magnify"
                    >
                    </v-text-field
                  ></v-col>
                </v-row>
              </v-col>
              <v-col cols="12" md="7">
                <v-row
                  no-gutters
                  align="center"
                  :class="`${$vuetify.display.smAndDown ? 'pt-4 px-2' : 'justify-end'}`"
                >
                  <v-col cols="12" sm="4"
                    ><span class="text-body-2">
                      Available Physical Access Card
                      <span class="text-body-1 ml-2">
                        {{ 200 }}
                        <v-icon
                          class="ml-2 pb-1 cursor-pointer"
                          color="primary"
                          size="medium"
                          @click="assignedAccessCardDialog = true"
                        >
                          mdi-eye
                        </v-icon>
                      </span>
                    </span></v-col
                  >
                  <v-col cols="12" sm="4"
                    ><span class="text-body-2">
                      Available QR Codes
                      <span class="text-body-1 ml-2">
                        {{ 100 }}
                        <v-icon
                          class="ml-2 pb-1 cursor-pointer"
                          color="primary"
                          size="medium"
                          @click="availableAccessCardDialog = true"
                        >
                          mdi-eye
                        </v-icon>
                      </span>
                    </span></v-col
                  >
                  <v-col cols="12" sm="4" md="3">
                    <v-btn
                      color="blue-darken-3"
                      block
                      variant="flat"
                      size="small"
                      style="height: 40px"
                      :class="$vuetify.display.xs ? 'mt-4' : ''"
                      @click="onShowAddAccessCardDialog()"
                    >
                      Add Access Card
                    </v-btn>
                    <entry-pass-add-nfc-access-card-dialog
                      @on-submit="submit($event)"
                    ></entry-pass-add-nfc-access-card-dialog>
                    <entry-pass-available-access-card-dialog></entry-pass-available-access-card-dialog>
                    <entry-pass-assigned-access-card-dialog></entry-pass-assigned-access-card-dialog>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-divider></v-divider>
          <v-col cols="12">
            <v-tabs
              grow
              v-model="tab"
              color="#0077b6"
              height="60px"
              :disabled="isAccessCardLoading"
            >
              <v-tab value="contractors"
                ><span class="font-weight-bold">Contractor</span></v-tab
              >
              <v-tab value="visitors"
                ><span class="font-weight-bold">Visitor</span></v-tab
              ></v-tabs
            >
          </v-col>
          <v-col cols="12">
            <v-tabs-window v-model="tab">
              <!-- Contractor tab -->
              <v-tabs-window-item value="contractors">
                <EntryPassNfcCardsTable
                  @next-page="onNext"
                  @prev-page="onPrev"
                />
              </v-tabs-window-item>
              <!-- Visitor tab -->
              <v-tabs-window-item value="visitors"
                ><EntryPassNfcCardsTable
                  @next-page="onNext"
                  @prev-page="onPrev"
                />
              </v-tabs-window-item>
            </v-tabs-window>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import debounce from "lodash/debounce";

const {
  page,
  search,
  openDialog,
  isAccessCardDialog,
  getAccessCards,
  isAccessCardLoading,
  assignedAccessCardDialog,
  availableAccessCardDialog,
  addNonPhysicalAccessCard,
  isAssigningNFC,
} = useEntryPass();
const { mySite } = useFilter();

const { setSnackbar } = useLocal();

const tab = ref("contractors");
const contractorsPage = ref(1);
const visitorsPage = ref(1);

onMounted(async () => {
  await getAccessCards({
    page: page.value,
    site: mySite.value,
    type: tab.value,
  });
});

watch(search, (newValue: string) => {
  debouncedSearch(newValue);
});

watch(tab, (value) => {
  page.value =
    value === "contractors" ? contractorsPage.value : visitorsPage.value;
  search.value = "";

  getAccessCards({
    page: page.value,
    site: mySite.value,
    type: value,
  });
});

const debouncedSearch = debounce(async (value: string) => {
  page.value = 1;
  await getAccessCards({
    page: page.value,
    site: mySite.value,
    type: tab.value,
    search: value,
  });
}, 500);

async function submit(payload: any) {
  if (payload.typeAccessCard === "Non Physical Access Card") {
    try {
      isAssigningNFC.value = true;
      const result = await addNonPhysicalAccessCard({
        site: mySite.value,
        quantity: payload.quantity,
        accessLevels: payload.accessLevels,
        userType: payload.userType,
      });

      if (result && result.status == "error") {
        setSnackbar({
          text: result.message,
          type: result.status,
          modal: true,
        });
      }
      setSnackbar({
        text: `Access Cards added successfully!`,
        type: "success",
        modal: true,
      });

      isAssigningNFC.value = false;
      isAccessCardDialog.value = false;
    } catch (error: any) {
      isAssigningNFC.value = false;
      setSnackbar({
        text: error,
        type: "error",
        modal: true,
      });
    }
  }
}

async function onShowAddAccessCardDialog() {
  isAccessCardDialog.value = true;
  openDialog.value = "Contractor/Visitor";
}

function onPrev() {
  contractorsPage.value =
    tab.value === "contractors"
      ? contractorsPage.value - 1
      : contractorsPage.value;
  visitorsPage.value =
    tab.value === "visitors" ? visitorsPage.value - 1 : visitorsPage.value;
  page.value =
    tab.value === "contractors" ? contractorsPage.value : visitorsPage.value;

  getAccessCards({
    page: page.value,
    site: mySite.value,
    type: tab.value,
  });
}

function onNext() {
  contractorsPage.value =
    tab.value === "contractors"
      ? contractorsPage.value + 1
      : contractorsPage.value;
  visitorsPage.value =
    tab.value === "visitors" ? visitorsPage.value + 1 : visitorsPage.value;
  page.value =
    tab.value === "contractors" ? contractorsPage.value : visitorsPage.value;

  getAccessCards({
    page: page.value,
    site: mySite.value,
    type: tab.value,
  });
}
</script>

<style scoped>
:deep() .v-slide-group__content {
  border-bottom: 2px #e0e0e0 solid;
}
</style>
