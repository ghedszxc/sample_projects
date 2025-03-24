<template>
  <v-row no-gutters>
    <!-- go back -->
    <v-col cols="12" class="mt-4 px-3">
      <v-row no-gutters @click="goBack()">
        <v-col cols="12" class="header mt-6 pa-0 ma-0">
          <v-icon style="position: relative; right: 2px" start size="x-large">
            <v-img
              class="pl-0 ml-0 mt-1"
              src="/dark-mode/utility-all/right-arrow.svg"
              cover
            ></v-img>
          </v-icon>
          <span style="position: relative; right: 10px; bottom: 1px">
            Management Feedback</span
          >
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12" class="text-right pr-5 mb-0 pb-0">
      <span class="text-body-2" :class="textColor">
        <span style="color: red">*</span> are required fields
      </span>
    </v-col>
    <!-- form -->
    <v-col cols="12" class="font-weight-light px-5">
      <v-form v-model="isFeedbackValid" @submit.prevent="submit()">
        <v-row no-gutters justify="center" class="mt-2">
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12">
                <v-combobox
                  :base-color="baseColor"
                  :bg-color="bgColor"
                  v-model:model-value="feedbackInputTitle"
                  :items="subjectOptions"
                  density="comfortable"
                  placeholder="Subject of the feedback"
                  :rules="[requiredInput]"
                  clearable
                  :filter-keys="['title', 'description']"
                  :persistent-hint="false"
                  hide-details
                  @input="onSubjectInput"
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
              <v-col cols="12" class="mt-6">
                <v-text-field
                  :base-color="baseColor"
                  :bg-color="bgColor"
                  v-model="feedback.location"
                  density="comfortable"
                  placeholder="e.g. Lobby, Hallway"
                  :rules="[requiredInput]"
                  clearable
                  :persistent-hint="false"
                  hide-details
                >
                  <template v-slot:label>
                    <span>Location </span><span class="required">*</span>
                  </template>
                </v-text-field>
              </v-col>

              <v-col cols="12" class="mt-6">
                <v-textarea
                  :base-color="baseColor"
                  :bg-color="bgColor"
                  label="Feedback Description"
                  v-model="feedback.description"
                  density="comfortable"
                  placeholder="e.g. Light bulbs are defective"
                  :rules="[requiredInput]"
                  clearable
                  :persistent-hint="false"
                  no-resize
                  auto-grow
                  hide-details
                >
                  <template v-slot:label>
                    <span>Feedback Description </span
                    ><span class="required">*</span>
                  </template>
                </v-textarea>
              </v-col>

              <!-- attachment -->
              <v-col cols="12" class="mt-6">
                <Carousel
                  v-if="uploadedAttachments && uploadedAttachments.length > 0"
                  :urls="uploadedAttachments.map((e) => e.url)"
                />
              </v-col>
              <v-col cols="12" class="mt-6">
                <div class="text-subtitle-1 text-medium-emphasis">
                  Attach Image(s)
                </div>
                <v-file-input
                  :base-color="baseColor"
                  :bg-color="bgColor"
                  v-model="files"
                  accept="image/*"
                  label="Select file"
                  variant="plain"
                  prepend-icon=""
                  @change="onFileSelect()"
                  :clearable="false"
                  multiple
                >
                  <template v-slot:prepend-inner>
                    <div style="width: 40px" class="pl-3">
                      <v-img
                        style="
                          margin: auto 0;
                          filter: drop-shadow(
                            0px 12px 14px rgba(233, 38, 30, 0.3)
                          );
                        "
                        max-height="60"
                        max-width="60"
                        src="/icons/resident/home/paperclip.svg"
                      />
                    </div>
                  </template>
                </v-file-input>
              </v-col>

              <!-- send feedback button -->
              <v-col cols="12">
                <v-row no-gutters>
                  <v-btn
                    block
                    style="
                      display: flex;
                      height: 52px;
                      padding: 0px 16px;
                      justify-content: center;
                      align-items: center;
                      align-self: stretch;
                      border-radius: 8px;
                      box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
                    "
                    color="#EB261E"
                    type="submit"
                    :disabled="!isFeedbackValid"
                    :loading="isLoadingUpload || isLoading"
                  >
                    Send Feedback
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});

const { theme } = useLocal();
const config = useRuntimeConfig();

const baseColor = computed(() => (theme.value === "dark" ? "red" : "red"));

const bgColor = computed(() =>
  theme.value === "dark" ? "#111723" : "#FAFAFAFA",
);
const feedbackInputTitle = ref();
const { requiredInput } = useUtils();
const { currentUser } = useLocalAuth();
const { isLoading, feedback, addFeedback, setFeedback, isFeedbackValid } =
  useFeedback();

const isLoadingUpload = ref<boolean>(false);

// onMounted(async () => {
//   feedbackInputTitle.value = "";
// });

const subjectOptions = computed(() => {
  return [
    {
      title: "Maintenance and Upkeep",
      description:
        "Feedback on the regularity, quality, and responsiveness of maintenance services.",
    },
    {
      title: "Safety and Security",
      description:
        "Feedback on the effectiveness of security measures, such as surveillance systems, guards, and access controls.",
    },
    {
      title: "Cleanliness",
      description:
        "Feedback on the cleanliness of common areas, such as lobbies, hallways, elevators, and parking lots.",
    },
    {
      title: "Noise Levels",
      description:
        "Feedback on noise insulation, quiet hours enforcement, and noise from neighboring units or the surrounding area.",
    },
    {
      title: "Amenities and Facilities",
      description:
        "Feedback on the availability, quality, and maintenance of amenities like gyms, swimming pools, parks, and lounges.",
    },
    {
      title: "Community Management",
      description:
        "Feedback on the management team's communication, conflict resolution, and handling of community events or issues.",
    },
    {
      title: "Parking",
      description:
        "Feedback on the availability, organization, safety, and accessibility of parking spaces.",
    },
    {
      title: "Utilities Management",
      description:
        "Feedback on water supply, electricity, heating, cooling, and garbage disposal services.",
    },
    {
      title: "Building Accessibility",
      description:
        "Feedback on the accessibility features for people with disabilities, such as ramps, elevators, and handrails.",
    },
    {
      title: "Pest Control",
      description:
        "Feedback on the effectiveness and frequency of pest control measures.",
    },
    {
      title: "Communication and Updates",
      description:
        "Feedback on how well residents are informed about important updates, events, or repairs.",
    },
    {
      title: "Move-in/Move-out Process",
      description:
        "Feedback on the smoothness, clarity, and support during the moving in or out process.",
    },
    {
      title: "Common Area Usage",
      description:
        "Feedback on the management and booking process of common areas like party rooms, meeting rooms, or rooftops.",
    },
    {
      title: "Rent and Fees",
      description:
        "Feedback on rent pricing, fee structures, transparency, and value for money.",
    },
    {
      title: "Overall Satisfaction",
      description:
        "General feedback on the living experience and overall satisfaction with the residential building.",
    },
    {
      title: "Office Space Layout and Design",
      description:
        "Feedback on the flexibility, efficiency, and design of office spaces.",
    },
    {
      title: "Internet and IT Infrastructure",
      description:
        "Feedback on the reliability, speed, and availability of internet and other technological services.",
    },
    {
      title: "HVAC Systems",
      description:
        "Feedback on heating, ventilation, and air conditioning systems, including their efficiency and comfort.",
    },
    {
      title: "Emergency Preparedness",
      description:
        "Feedback on fire safety measures, emergency exits, drills, and preparedness plans.",
    },
    {
      title: "Building Management and Administration",
      description:
        "Feedback on the responsiveness, professionalism, and efficiency of the building management team.",
    },
    {
      title: "Accessibility for Clients and Employees",
      description:
        "Feedback on public transport links, parking availability, and building accessibility for both clients and employees.",
    },
    {
      title: "Elevator and Escalator Services",
      description:
        "Feedback on the reliability, speed, and safety of elevators and escalators.",
    },
    {
      title: "Lighting and Ambience",
      description:
        "Feedback on the adequacy of lighting, ambiance, and energy efficiency measures.",
    },
    {
      title: "Cleaning and Janitorial Services",
      description:
        "Feedback on the frequency, thoroughness, and quality of cleaning services in common areas and private offices.",
    },
    {
      title: "Energy Efficiency",
      description:
        "Feedback on green building practices, energy consumption, and sustainability initiatives.",
    },
    {
      title: "Lease Terms and Conditions",
      description:
        "Feedback on the flexibility, clarity, and fairness of lease agreements.",
    },
    {
      title: "Signage and Way Finding",
      description:
        "Feedback on the ease of navigation, clarity of signage, and overall way finding within the building.",
    },
    {
      title: "Tenant Communication",
      description:
        "Feedback on how effectively management communicates with tenants about building policies, repairs, or any changes.",
    },
  ].sort((a, b) => {
    return a.title.localeCompare(b.title);
  });
  // .filter(
  //   (item) =>
  //     item.title
  //       .toLowerCase()
  //       .includes(
  //         feedbackInputTitleComputed.value
  //           ? feedbackInputTitleComputed.value.toLowerCase()
  //           : undefined,
  //       ) ||
  //     item.description
  //       .toLowerCase()
  //       .includes(
  //         feedbackInputTitleComputed.value
  //           ? feedbackInputTitleComputed.value.toLowerCase()
  //           : undefined,
  //       ),
  // );
});

const files = ref<File[]>([]);
type TFile = {
  name: string;
  data: File;
  progress: number;
  id?: string;
};
const uploadedAttachments = ref<TFile[]>([]);
const uploadProgress = ref(0);
// const fileString = ref();

const onFileSelect = async () => {
  isLoadingUpload.value = true;
  const imageFiles = files.value.filter((file: any) =>
    file.type.startsWith("image/"),
  );

  if (imageFiles.length !== files.value.length) {
    setSnackbar({
      text: "The selected file type is not an image.",
      modal: true,
      type: "error",
    });
    files.value = [];
  }

  uploadedAttachments.value = imageFiles.map((file: any) => ({
    name: file.name,
    data: file,
    progress: 0,
    url: URL.createObjectURL(file),
  }));

  for (let i = 0; i < files.value.length; i++) {
    const formData = new FormData();

    try {
      formData.append("file", uploadedAttachments.value[i].data);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `/api/files/upload?status=draft`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          uploadedAttachments.value[i].progress = Math.round(
            (event.loaded / event.total) * 100,
          );
          uploadProgress.value = uploadedAttachments.value[i].progress;
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          uploadedAttachments.value[i].id = response.id;
          feedback.value.attachments?.push(response.id);
        }
        if (i === uploadedAttachments.value.length - 1) {
          isLoadingUpload.value = false;
        }
      };

      xhr.send(formData);
    } catch (e) {
      isLoadingUpload.value = false;
    }
  }
};

async function goBack() {
  await navigateTo("/feedbacks");
}

const { setSnackbar } = useLocal();

async function submit() {
  let feedstatus =
    feedbackInputTitle.value.title ||
    feedback.value.subject ||
    feedbackInputTitle.value;

  try {
    isLoading.value = true;

    const result = await addFeedback({
      createdBy: currentUser.value._id,
      location: feedback.value.location,
      description: feedback.value.description,
      organization: String(currentUser.value.organization),
      attachments: feedback.value.attachments,
      site: String(currentUser.value.site),
      subject:
        feedbackInputTitle.value.title ||
        feedback.value.subject ||
        feedbackInputTitle.value,
      app: "Service365",
    });

    setSnackbar({ text: result, modal: true, type: "success" });

    setFeedback();
    goBack();
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
  isLoading.value = false;
}

const textColor = computed(() =>
  theme.value === "dark" ? "title-dark" : "title",
);

const onSubjectInput = (value: any) => {
  if (typeof value === "string") {
    feedbackInputTitle.value = value;
  } else if (value && value.title) {
    feedbackInputTitle.value = value.title;
  }
};
</script>

<style scoped>
.chevron-icon {
  filter: drop-shadow(0px 4px 10px #d01b1b);
}
.go-back-light {
  color: var(--Secondary-Dark, #0f131c);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  margin-top: 2px;
}
.go-back-dark {
  color: #fcfcfc;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  margin-top: 2px;
}
.header-text {
  color: #052439;
  font-feature-settings:
    "clig" off,
    "liga" off;
  font-family: Roboto;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
}

.title {
  font-size: 20px;
  line-height: 32px;
  color: #052439;
}
.title-dark {
  font-size: 20px;
  line-height: 32px;
  color: #fcfcfc;
}

.required {
  color: red;
  font-size: 16px;
}
</style>
