<template>
  <v-row no-gutters justify="center" class="py-md-8 h-100">
    <v-col cols="12" xxl="6" xl="6" lg="6" class="font-weight-light mt-md-4">
      <v-card
        width="100%"
        height="100%"
        elevation="0"
        style="border-width: thin"
      >
        <v-form v-model="isWorkOrderValid" @submit.prevent="submit()">
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
                />
                <span
                  class="ml-2 text-h6 font-weight-bold text-capitalize"
                  style="letter-spacing: 2px !important"
                >
                  Work Orders
                </span>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-divider />
            </v-col>

            <v-col cols="12">
              <v-row no-gutters class="pa-8">
                <v-col cols="12" class="text-center">
                  <UtilsCarousel
                    v-if="fileUploaded && fileUploaded.length > 0"
                    :urls="fileUploaded.map((i) => i.url)"
                    :img-editable="false"
                  />
                  <span v-else class="font-weight-bold text-subtitle-1">
                    No Attach Image(s) found.
                  </span>
                </v-col>

                <v-col cols="12" class="mt-6">
                  <UtilsFileInputWithList
                    :init-files="fileUploaded.map((file) => file)"
                    @update:files="handleFileUpdate"
                    @onFileRemoved="handleFileRemoved"
                    @on-clear="fileUploaded = []"
                  />
                </v-col>

                <!-- is high priority -->
                <v-col cols="12" class="mt-6">
                  <v-checkbox v-model="isHighPriority">
                    <template v-slot:label>
                      <span class="font-weight-bold">
                        Set work order as High Priority (Optional)
                      </span>
                    </template>
                  </v-checkbox>
                </v-col>

                <v-col cols="12" class="mb-2">
                  <div class="text-subtitle-1 text-medium-emphasis">
                    Subject
                  </div>
                  <v-combobox
                    v-model="workOrder.subject"
                    :items="subjectOptions"
                    density="comfortable"
                    placeholder="Enter subject"
                    :rules="[requiredInput]"
                    clearable
                    :filter-keys="['title', 'description']"
                    :persistent-hint="false"
                    hide-details
                  >
                    <template v-slot:item="{ props, item }">
                      <v-row no-gutters v-bind="props" class="px-3">
                        <v-col cols="12" class="pa-2">
                          <span class="font-weight-bold">
                            {{ item.raw.title }}
                          </span>
                          <span
                            class="d-flex align-center flex-wrap mx-auto px-4 text-caption"
                          >
                            {{ item.raw.description }}
                          </span>
                        </v-col>
                      </v-row>
                    </template>
                  </v-combobox>
                </v-col>

                <v-col cols="12" class="mb-2">
                  <div class="text-subtitle-1 text-medium-emphasis">
                    Location
                  </div>
                  <v-text-field
                    v-model="workOrder.location"
                    density="comfortable"
                    placeholder="Enter location"
                    :rules="[requiredInput]"
                    clearable
                    :persistent-hint="false"
                  />
                </v-col>

                <v-col cols="12" class="mb-4">
                  <div class="text-subtitle-1 text-medium-emphasis">
                    Description
                  </div>
                  <v-textarea
                    v-model="workOrder.description"
                    density="comfortable"
                    placeholder="Enter description"
                    :rules="[requiredInput]"
                    clearable
                    :persistent-hint="false"
                    no-resize
                  />
                </v-col>

                <v-col cols="12">
                  <v-row no-gutters>
                    <v-btn
                      block
                      class="font-weight-bold"
                      :disabled="!isWorkOrderValid"
                      type="submit"
                      color="primary"
                    >
                      submit
                    </v-btn>
                  </v-row>
                </v-col>
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

const { requiredInput } = useUtils();
const { setSnackbar } = useLocal();
const { currentUser } = useLocalAuth();
const { setUser } = useUser();
const { workOrder, addWorkOrder, setWorkOrder, isWorkOrderValid } =
  useWorkOrder();
const { getSitesOptionsForFiltering, mySite, myOrg } = useFilter();
const { uploadFileUtil, isFileUploading } = useUploadFiles();
const fileUploaded = ref([]);
const subjectOptions = computed(() => {
  return [
    {
      title: "Maintenance and Upkeep",
      description:
        "WorkOrder on the regularity, quality, and responsiveness of maintenance services.",
    },
    {
      title: "Safety and Security",
      description:
        "WorkOrder on the effectiveness of security measures, such as surveillance systems, guards, and access controls.",
    },
    {
      title: "Cleanliness",
      description:
        "WorkOrder on the cleanliness of common areas, such as lobbies, hallways, elevators, and parking lots.",
    },
    {
      title: "Noise Levels",
      description:
        "WorkOrder on noise insulation, quiet hours enforcement, and noise from neighboring units or the surrounding area.",
    },
    {
      title: "Amenities and Facilities",
      description:
        "WorkOrder on the availability, quality, and maintenance of amenities like gyms, swimming pools, parks, and lounges.",
    },
    {
      title: "Community Management",
      description:
        "WorkOrder on the management team's communication, conflict resolution, and handling of community events or issues.",
    },
    {
      title: "Parking",
      description:
        "WorkOrder on the availability, organization, safety, and accessibility of parking spaces.",
    },
    {
      title: "Utilities Management",
      description:
        "WorkOrder on water supply, electricity, heating, cooling, and garbage disposal services.",
    },
    {
      title: "Building Accessibility",
      description:
        "WorkOrder on the accessibility features for people with disabilities, such as ramps, elevators, and handrails.",
    },
    {
      title: "Pest Control",
      description:
        "WorkOrder on the effectiveness and frequency of pest control measures.",
    },
    {
      title: "Communication and Updates",
      description:
        "WorkOrder on how well residents are informed about important updates, events, or repairs.",
    },
    {
      title: "Move-in/Move-out Process",
      description:
        "WorkOrder on the smoothness, clarity, and support during the moving in or out process.",
    },
    {
      title: "Common Area Usage",
      description:
        "WorkOrder on the management and booking process of common areas like party rooms, meeting rooms, or rooftops.",
    },
    {
      title: "Rent and Fees",
      description:
        "WorkOrder on rent pricing, fee structures, transparency, and value for money.",
    },
    {
      title: "Overall Satisfaction",
      description:
        "General workOrder on the living experience and overall satisfaction with the residential building.",
    },
    {
      title: "Office Space Layout and Design",
      description:
        "WorkOrder on the flexibility, efficiency, and design of office spaces.",
    },
    {
      title: "Internet and IT Infrastructure",
      description:
        "WorkOrder on the reliability, speed, and availability of internet and other technological services.",
    },
    {
      title: "HVAC Systems",
      description:
        "WorkOrder on heating, ventilation, and air conditioning systems, including their efficiency and comfort.",
    },
    {
      title: "Emergency Preparedness",
      description:
        "WorkOrder on fire safety measures, emergency exits, drills, and preparedness plans.",
    },
    {
      title: "Building Management and Administration",
      description:
        "WorkOrder on the responsiveness, professionalism, and efficiency of the building management team.",
    },
    {
      title: "Accessibility for Clients and Employees",
      description:
        "WorkOrder on public transport links, parking availability, and building accessibility for both clients and employees.",
    },
    {
      title: "Elevator and Escalator Services",
      description:
        "WorkOrder on the reliability, speed, and safety of elevators and escalators.",
    },
    {
      title: "Lighting and Ambience",
      description:
        "WorkOrder on the adequacy of lighting, ambiance, and energy efficiency measures.",
    },
    {
      title: "Cleaning and Janitorial Services",
      description:
        "WorkOrder on the frequency, thoroughness, and quality of cleaning services in common areas and private offices.",
    },
    {
      title: "Energy Efficiency",
      description:
        "WorkOrder on green building practices, energy consumption, and sustainability initiatives.",
    },
    {
      title: "Lease Terms and Conditions",
      description:
        "WorkOrder on the flexibility, clarity, and fairness of lease agreements.",
    },
    {
      title: "Signage and Way Finding",
      description:
        "WorkOrder on the ease of navigation, clarity of signage, and overall way finding within the building.",
    },
    {
      title: "Tenant Communication",
      description:
        "WorkOrder on how effectively management communicates with tenants about building policies, repairs, or any changes.",
    },
  ].sort((a, b) => {
    return a.title.localeCompare(b.title);
  });
});

const isHighPriority = ref<boolean>(false);

onMounted(async () => {
  setUser();
  await getSitesOptionsForFiltering();

  //clear form
  workOrder.value.description = "";
  workOrder.value.location = "";
  workOrder.value.subject = null;
  workOrder.value.attachments = [];
});

function goBack() {
  useRouter().back();
}

const handleFileUpdate = async (files: Array<{ data: File; url: string }>) => {
  for (const file of files) {
    const formData = new FormData();

    try {
      formData.append("file", file.data);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/files/upload?status=draft");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          // You can handle progress here if needed
          const progress = Math.round((event.loaded / event.total) * 100);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          // Add the file ID to workOrder attachments
          workOrder.value.attachments.push(response.id);
          // Update fileUploaded with the new file
          fileUploaded.value.push({
            name: file.name,
            url: file.url, // Keep the URL for displaying in UtilsCarousel
            id: response.id, // Optional if you need to track it
          });
        }
      };

      xhr.onerror = () => {
        setSnackbar({
          text: "Error uploading file",
          modal: true,
          type: "error",
        });
      };

      xhr.send(formData);
    } catch (e) {
      setSnackbar({
        text: "Error uploading file",
        modal: true,
        type: "error",
      });
    }
  }
};

const handleFileRemoved = ({ index, file }: { index: number; file: File }) => {
  fileUploaded.value = fileUploaded.value.filter((_, i) => i !== index);
};

async function submit() {
  try {
    await addWorkOrder({
      createdBy: currentUser.value._id,
      description: workOrder.value.description,
      attachments: workOrder.value.attachments,
      isHighPriority: isHighPriority.value,
      site: String(mySite.value),
      organization: String(myOrg.value),
      subject: workOrder.value.subject?.title || workOrder.value.subject,
      location: workOrder.value.location,
      app: "Service365 Main",
    });

    setSnackbar({
      text: "Work order successfully created!",
      modal: true,
      type: "success",
    });

    goBack();
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}
</script>
