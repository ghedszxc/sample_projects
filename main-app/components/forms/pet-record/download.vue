<template>
  <v-row no-gutters justify="center" class="pa-md-8">
    <v-col cols="12">
      <v-card v-if="!isLoading" width="100%" height="100%" variant="flat">
        <div class="px-10">
          <div class="align-start text-h4 pt-6 pb-10 font-weight-bold">
            {{ item.typeOfForm }}
          </div>
          <!-- Management & Date -->
          <div class="mb-5">
            <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-50 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Management</div>
                <div>{{ item.management }}</div>
              </div>
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-50 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Date</div>
                <div>
                  {{ formatStandardDate(item.date || item.createdAt || "") }}
                </div>
              </div>
            </div>
          </div>

          <v-divider></v-divider>

          <div class="align-start text-h5 pt-6 pb-2 font-weight-bold">
            Name of Pet/s:
          </div>

          <div class="mb-5">
            <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-50 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Name of Pet/s</div>
                <div>{{ item.nameOfPet }}</div>
              </div>
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-50 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Type of Pet/s</div>
                <div>{{ item.typeOfPet }}</div>
              </div>
            </div>
            <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-50 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Breed</div>
                <div>{{ item.breed }}</div>
              </div>
              <div
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-50 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">License No.</div>
                <div>{{ item.licenseNumber }}</div>
              </div>
            </div>
          </div>

          <v-divider></v-divider>

          <div class="align-start text-h5 pt-6 pb-2 font-weight-bold">
            Owner's Particulars:
          </div>

          <div class="mb-5">
            <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
              <div
                class="border"
                :class="
                  $vuetify.display.mdAndUp
                    ? 'w-50 pa-3'
                    : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Name</div>
                <div>{{ item.nameOfOwner }}</div>
              </div>
              <div
                class="border"
                :class="
                  $vuetify.display.mdAndUp
                    ? 'w-50 pa-3'
                    : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Unit No.</div>
                <div>{{ item.unitNumber }}</div>
              </div>
              <div
                class="border"
                :class="
                  $vuetify.display.mdAndUp
                    ? 'w-50 pa-3'
                    : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Contact No.</div>
                <div>{{ item.contactNumber }}</div>
              </div>
            </div>
            <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
              <div
                class="border"
                :class="
                  $vuetify.display.mdAndUp
                    ? 'w-50 pa-3'
                    : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Email</div>
                <div>{{ item.email }}</div>
              </div>
              <div
                class="border"
                :class="
                  $vuetify.display.mdAndUp
                    ? 'w-50 pa-3'
                    : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Correspondence Address</div>
                <div>{{ item.correspondenceAddress }}</div>
              </div>
            </div>
          </div>

          <div class="mb-5">
            <div class="text-body">
              <v-container>
                <v-row class="text-h6" align="start" justify="space-between">
                  <v-col cols="auto" class="pa-0">
                    <v-icon icon="mdi-check-circle" color="green" />
                  </v-col>
                  <v-col class="pa-0 ml-10">
                    <span
                      v-if="
                        configForm &&
                        configForm.firstLabel &&
                        configForm.firstLabel.trim() !== `<p></p>`.trim()
                      "
                      v-html="configForm.firstLabel"
                    >
                    </span>
                    <span v-else>
                      I / We agree to provide my personal information as
                      indicated and understand that it is solely to be used by
                      the Management for management purposes only. The personal
                      data shall not be used for other purposes.
                    </span>
                  </v-col>
                </v-row>
              </v-container>
            </div>
            <div class="d-flex" v-if="$vuetify.display.mdAndUp">
              <div class="align-start text-h5 pt-6 font-weight-bold">
                Declaration from Subsidiary Proprietor / Tenant:
              </div>
            </div>
            <div class="text-body mb-5">
              <span
                v-if="
                  configForm &&
                  configForm.secondLabel &&
                  configForm.secondLabel.trim() !== `<p></p>`.trim()
                "
                v-html="configForm.secondLabel"
              >
              </span>
              <span v-else>
                I declare that I am residing at (Site Property) and that all the
                above particulars given by me are true and correct.
              </span>
            </div>
            <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
              <div
                class="border"
                :class="
                  $vuetify.display.mdAndUp
                    ? 'w-50 pa-3'
                    : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Site Property</div>
                <div>{{ item.siteName }}</div>
              </div>
              <div
                class="border"
                :class="
                  $vuetify.display.mdAndUp
                    ? 'w-50 pa-3'
                    : 'w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Attach Files</div>
                <div
                  v-if="
                    Array.isArray(item.attachments) &&
                    item.attachments.length > 0
                  "
                >
                  {{ item.attachments }}
                </div>
                <div v-else>No Attachments</div>
              </div>
            </div>
          </div>
          <div class="signature-container mb-5">
            <div class="text-h6 mr-4">Signature</div>
            <v-img
              :src="item.signature"
              alt="Signature"
              class="custom-height-md"
            />
            <div class="text-h6 mt-4">
              Signature Date: {{ formatStandardDate(item.signedDate) }}
            </div>
          </div>
        </div>
      </v-card>
      <div v-else>
        <p>Loading...</p>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const { item, isLoading, isValid, setItem, getItemById } = usePetRecords();
const { formatStandardDate } = useUtils();
const { configForm, getSelectedFormByType } = useSiteSettings();
const { setSnackbar } = useLocal();
const route = useRoute();

const statusSelection = ref("");

const routeId = computed(() =>
  route.params.id ? String(route.params.id) : "",
);

onMounted(async () => {
  try {
    setItem(await getItemById(routeId.value));
    statusSelection.value = "Approved";
    await getSelectedFormByType("Pet Record Form");
  } catch (error: any) {
    setSnackbar({
      text: error.message || error,
      modal: true,
      type: "error",
    });
  }
});
</script>

<style scoped>
.signature-container {
  text-align: left; /* Aligns text and images to the left */
}

.signature-container div,
.signature-container v-img {
  display: block; /* Ensures elements stack vertically */
}
.stepper-height {
  min-height: 80px;
}
.h-container {
  border-bottom-width: 3px;
  border-bottom-style: solid;
  border-bottom-color: rgb(206, 206, 206);
}

.h-container-bottom {
  border-bottom-color: rgb(42, 42, 254) !important;
  transition: all 0.2s;
}

.h-container:hover {
  background-color: rgb(189, 189, 189);
  transition: ease 0.2s;
  cursor: pointer;
}

.font-small {
  font-size: 13.5px;
}

.btn-w {
  min-width: 100px;
  min-height: 60px;
}
.custom-height-md {
  height: 300px; /* Set the exact height for mdAndUp */
}
@media (max-width: 600px) {
  .small-font {
    font-size: 13px; /* Adjust this value as needed */
  }
}
</style>
