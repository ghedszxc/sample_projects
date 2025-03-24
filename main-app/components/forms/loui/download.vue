<template>
  <v-row no-gutters justify="center" class="pa-md-8">
    <v-col cols="12">
      <v-card v-if="!isLoading" width="100%" height="100%" variant="flat">
        <div class="px-10">
          <div class="align-start text-h4 pt-6 pb-10 font-weight-bold">
            {{ item.typeOfForm }}
          </div>
        </div>

        <div class="px-10">
          <div class="mb-5">
            <div class="align-start text-h6 font-weight-regular">
              Letter of undertaking in respect of renovation / addition &
              alteration works at unit
            </div>

            <!-- Management & Date -->
            <div class="my-5">
              <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
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
                <div
                  :class="
                    $vuetify.display.mdAndUp
                      ? 'border w-50 pa-3'
                      : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                  "
                >
                  <div class="text-h6 mr-4">To: The Management</div>
                  <div>{{ item.management }}</div>
                </div>
              </div>
            </div>
          </div>

          <v-divider></v-divider>

          <div class="mb-5">
            <p class="align-start text-body pt-6 font-weight-regular">
              I / We, Subsidiary Proprietor(s) of Unit
              <span class="text-primary">{{ item.unitNumber }}</span
              >, hereby authorize our contractor,
              <span class="text-primary text-capitalize">
                {{ item.contractorOwner }}
              </span>
              of <span class="text-primary">{{ item.createdByName }}</span> Do
              to undertake the purposes of renovation / addition & alteration
              works to the above property, such works to commence from
              <span class="text-primary">{{
                formatStandardDate(item.dateFrom || "")
              }}</span>
              to
              <span class="text-primary">{{
                formatStandardDate(item.dateTo || "")
              }}</span
              >.
            </p>
            <div
              v-if="
                configForm &&
                configForm.firstLabel &&
                configForm.firstLabel.trim() !== `<p></p>`.trim()
              "
              v-html="configForm.firstLabel"
            ></div>
            <span v-else>
              <p class="align-start text-body pt-6 font-weight-regular">
                In consideration of you at our request permitting the contractor
                to have access to the above premises, we hereby agree and
                undertake to indemnify and hold harmless the Developer, the
                appointed Managing Agent and the Management, for and against all
                actions, claims, damages, costs and expenses that may arise from
                any loss, damage, death, injury from any causes whatsoever to
                the property or persons caused by or resulting from the
                Subsidiary Proprietor(s)’ A&A works caused by any act, omission,
                neglect, default of the Subsidiary Proprietor(s), their
                servants, agents, contractors, sub-contractors, employees,
                invitees or any other persons whether or not the loss, damage
                death or injury is due to the negligence of the Developer, the
                appointed Managing Agent and the Management.
              </p>

              <p class="align-start text-body pt-6 font-weight-regular">
                We further undertake to reimburse the developer and its
                appointed managing agent for all costs involved in removing
                waste materials and debris arising from our works if they are
                not removed by our contractors, failing which the costs involved
                is to be offset from our deposit.
              </p>

              <p class="align-start text-body pt-6 font-weight-regular">
                We understand that it is our sole responsibility to consult,
                liaise directly and/or obtain the necessary approvals from the
                relevant authorities and/or our own Qualified Person before
                submitting our application to the Management. We shall not
                commence works of any nature unless we have received the
                acknowledgement letter from the Management.
              </p>

              <p class="align-start text-body pt-6 font-weight-regular">
                Enclosed herewith is our cheque of
                <span class="text-primary">S${{ item.chequeAmount || 0 }}</span>
                being the refundable deposit required to be placed with the
                Management. We shall ensure that our contractors comply with the
                following:
              </p>
            </span>

            <div
              v-if="
                configForm &&
                configForm.secondLabel &&
                configForm.secondLabel.trim() !== `<p></p>`.trim()
              "
              v-html="configForm.secondLabel"
              class="pt-10"
            ></div>
            <template v-else>
              <p class="align-start text-body pt-6 font-weight-regular">
                A. To adhere to the renovation guidelines as laid out in the
                Renovation / Addition & Alteration Guidelines.
              </p>
              <p class="align-start text-body pt-6 font-weight-regular">
                B. To keep the common property clean and remove and cart away
                waste materials and debris, arising out of works, from time to
                time and on completion of our works or as and when directed by
                the Management.
              </p>
              <p class="align-start text-body pt-6 font-weight-regular">
                C. To protect the lobby floors, wall finishes, carpets and lifts
                against damages when transporting materials.
              </p>
              <p class="align-start text-body pt-6 font-weight-regular">
                D. To note that any replacement of the existing floor finishes
                (with or without water proofing membrane) will void the
                waterproof warranty on the floor finishes.
              </p>
              <p class="align-start text-body pt-6 font-weight-regular">
                E. To strictly comply with all conditions stated in the
                application for permit to carry out Addition & Alteration works.
              </p>
            </template>
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
                        configForm.thirdLabel &&
                        configForm.thirdLabel.trim() !== `<p></p>`.trim()
                      "
                      v-html="configForm.thirdLabel"
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
          </div>

          <v-divider></v-divider>

          <div class="my-5">
            <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
              <div
                class="bg-grey-lighten-3"
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-100 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Name of Subsidiary Proprietors</div>
                <div>{{ item.nameOfSubProp }}</div>
              </div>
            </div>
            <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
              <div
                class="bg-grey-lighten-3"
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-100 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Signature</div>
                <div>
                  <v-img
                    :src="item.signature"
                    alt="Signature"
                    class="custom-height-md"
                  />
                </div>
              </div>
            </div>
            <div :class="$vuetify.display.mdAndUp ? 'd-flex' : ''">
              <div
                class="bg-grey-lighten-3"
                :class="
                  $vuetify.display.mdAndUp
                    ? 'border w-100 pa-3'
                    : 'border w-100 d-flex justify-space-between px-4 align-center flex-wrap py-4'
                "
              >
                <div class="text-h6 mr-4">Date</div>
                <div>{{ formatStandardDate(item.signedDate) }}</div>
              </div>
            </div>
          </div>
          <v-divider></v-divider>
        </div>
      </v-card>
      <div v-else>
        <p>Loading...</p>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const { item, isLoading, setItem, getItemById } = useLOUI();
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
    await getSelectedFormByType("Letter of Undertaking & Indemnity");
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
