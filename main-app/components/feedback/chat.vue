<template>
  <v-row no-gutters class="fill-height py-1 row-height" align="center">
    <div
      class="messages px-2 chat-content"
      ref="chatContent"
      @scroll="handleScroll"
    >
      <v-row dense>
        <v-col
          v-for="(message, itemIndex) in comments"
          :key="itemIndex"
          cols="12"
          :class="message.justify === 'end' ? 'text-end' : 'text-start'"
        >
          <v-card
            color="cardBackground"
            class="d-inline-block rounded-xl border-md"
            :width="$vuetify.display.xs ? 320 : 300"
          >
            <v-row no-gutters class="pa-3 align-items-center">
              <v-col
                v-if="message.justify === 'start'"
                cols="auto"
                class="pr-2"
              >
                <v-avatar size="small" :color="materialColors[itemIndex]">
                  {{ message?.createdByName ? message.createdByName[0] : "" }}
                </v-avatar>
              </v-col>

              <v-col v-if="message.justify === 'end'" cols="12" class="pl-2">
                <v-row no-gutters class="justify-end align-center">
                  <v-col cols="auto">
                    <v-row no-gutters>
                      <v-col cols="12" class="pb-0">
                        <span class="font-weight-bold">
                          {{ message.createdByName }}
                        </span>
                      </v-col>
                      <v-col cols="12" class="pt-0 text-subtitle-2">
                        {{ message.createdByType }}
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-avatar
                    size="small"
                    :color="materialColors[itemIndex]"
                    class="ml-1"
                  >
                    {{ message?.createdByName ? message.createdByName[0] : "" }}
                  </v-avatar>
                </v-row>
              </v-col>

              <v-col>
                <v-row v-if="message.justify === 'start'" no-gutters>
                  <v-col cols="12" class="pb-0">
                    <span class="font-weight-bold">
                      {{ message.createdByName }}
                    </span>
                  </v-col>
                  <v-col cols="12" class="pt-0 text-subtitle-2">
                    {{ message.createdByType }}
                  </v-col>
                </v-row>

                <v-row no-gutters class="pt-2 d-flex">
                  <v-col cols="auto" class="pa-0 ma-0 rounded-xl">
                    <v-card elevation="0">
                      <v-slide-group
                        show-arrows
                        v-if="
                          Array.isArray(message.attachments) &&
                          message.attachments.length > 0
                        "
                      >
                        <v-slide-group-item
                          v-for="(attachment, idx) in message.attachments"
                          :key="idx"
                        >
                          <v-card
                            class="ma-2 rounded-lg border-thin"
                            elevation="0"
                            width="80"
                            height="80"
                            @click="showImagePreview(attachment.id)"
                            border=" opacity-50 thin "
                          >
                            <v-img
                              :src="`/api/files/${attachment.id}`"
                              cover
                              height="100%"
                              width="100%"
                              class="rounded-lg"
                            >
                              <template v-slot:placeholder>
                                <div
                                  class="d-flex align-center justify-center fill-height"
                                >
                                  <v-progress-circular
                                    color="grey-lighten-4"
                                    indeterminate
                                  />
                                </div> </template
                            ></v-img>
                          </v-card>
                        </v-slide-group-item>
                      </v-slide-group> </v-card
                  ></v-col>
                </v-row>

                <div
                  :class="
                    message.justify === 'end'
                      ? ' text-body-2 mb-1 pt-2 '
                      : 'text-body-2 mb-1 pt-2'
                  "
                >
                  {{ message.comment }}
                </div>

                <v-row no-gutters class="pt-2 d-flex align-center">
                  <template v-if="message.justify === 'end'">
                    <div class="text-caption">
                      {{ standardFormatDateTime(message.createdAt) }}
                    </div>
                    <div
                      :class="message.justify === 'end' ? 'ml-auto ' : ''"
                      @click="toggleSeenList(itemIndex)"
                    >
                      <v-icon icon="mdi-eye-outline pr-2"></v-icon>
                      <span class="text-caption font-weight-regular">Seen</span>
                    </div>
                  </template>
                  <template v-else>
                    <div class="mr-auto" @click="toggleSeenList(itemIndex)">
                      <v-icon icon="mdi-eye-outline pr-2"></v-icon>
                      <span class="text-caption font-weight-regular">Seen</span>
                    </div>
                    <div class="text-caption pl-4">
                      {{ standardFormatDateTime(message.createdAt) }}
                    </div>
                  </template>
                  <v-col cols="12" class="pa-0 ma-0">
                    <v-expand-transition>
                      <!-- <div
                        v-if="expandedMessages[itemIndex]"
                        class="text-caption top-100 end-0 mt-2 rounded"
                        style="z-index: 1"
                      > -->
                      <div
                        v-if="expandedMessages[itemIndex]"
                        :class="
                          message.justify === 'end'
                            ? 'text-caption top-100 end-0 mt-2 rounded pr-8'
                            : 'text-caption top-100 end-0 mt-2 rounded'
                        "
                        style="z-index: 1"
                      >
                        <span v-if="message.seenByNames.length > 0">
                          <!-- <v-icon icon="mdi-eye-outline pr-2"></v-icon> -->
                          <strong>Seen</strong> by:
                        </span>
                        <span
                          v-for="(person, index) in message.seenByNames"
                          :key="index"
                        >
                          {{ person.givenName }} {{ person.surname }}
                          <span
                            v-if="index !== message.seenByNames.length - 1"
                            class=""
                            >,</span
                          >
                        </span>
                      </div>
                    </v-expand-transition>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-btn
        v-if="showScrollButton"
        color="primary"
        elevation="2"
        @click="scrollToLatest"
        class="scroll-to-latest"
        icon="mdi-arrow-down"
      >
      </v-btn>
    </div>

    <v-card
      class="input-area pt-4"
      elevation="4"
      color="white"
      :style="{ marginTop: '120px' }"
    >
      <v-row no-gutters class="mb-4">
        <v-col cols="12">
          <UtilsSlideCardGroup
            v-if="fileUploaded && fileUploaded.length > 0"
            :data-files="fileUploaded.map((i) => i)"
            :img-editable="true"
            @onFileRemove="handleFileRemove"
          />
        </v-col>
      </v-row>

      <v-row no-gutters align="center">
        <v-col :cols="$vuetify.display.smAndUp ? 10 : 8">
          <v-textarea
            v-model="comment.comment"
            rows="3"
            hide-details
            variant="plain"
            placeholder="Type a message..."
            no-resize
            class="message-input"
          />
        </v-col>

        <v-col
          :cols="$vuetify.display.smAndUp ? 2 : 4"
          class="d-flex justify-end pr-3"
        >
          <v-btn color="baseButton" size="large" @click="sendMessage">
            send
          </v-btn>
        </v-col>
        <v-col cols="12"> <v-divider /> </v-col>
        <v-col cols="12" class="mt-3">
          <v-row no-gutters>
            <UtilsFileInputWithList
              :init-files="fileUploaded.map((file) => file)"
              @update:files="handleFileUpdate"
              :hasLabel="false"
              :hasHideInput="true"
            />

            <div class="text-center">
              <v-menu transition="fade-transition">
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" class="ml-2 cursor-pointer">
                    mdi-comment-outline
                  </v-icon>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(reply, index) in quickReplies"
                    :key="index"
                    @click="selectQuickReply(reply)"
                  >
                    <v-list-item-title>{{ reply }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div></v-row
          >
        </v-col>
      </v-row>
    </v-card>
    <v-dialog
      v-model="openImageDialog"
      width="50vw"
      @update:modelValue="imageDialogClosed"
    >
      <div style="max-height: 90vh; overflow: auto">
        <v-img :src="`/api/files/${selectedImage}`" />
      </div>
    </v-dialog>
  </v-row>
</template>
<script setup lang="ts">
const { standardFormatDateTime, materialColors, getInitial } = useUtils();
const {
  getCommentsByFeedBackId,
  addComment,
  comment,
  setComments,
  comments,
  updateSeenBy,
} = useComment();
const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();

const idFeedback = computed(() => useRoute().params.id as string);
const fileUploaded = ref([]);
const showScrollButton = ref(false);
const chatContent = ref(null);

onMounted(async () => {
  await setComments(idFeedback.value);
});

async function sendMessage() {
  if (comment.value.comment) {
    comment.value._id = idFeedback.value;
    comment.value.createdBy = currentUser.value._id;
    comment.value.feedback = idFeedback.value;
    comment.value.attachments = comment.value.attachments?.map(
      (id: TAttachment) => ({
        id,
      }),
    );
    // comment.value.attachments = (comment.value.attachments ?? []).map(
    //   (attachment: TAttachment) => attachment,
    // );

    await addComment(comment.value);
    comment.value.attachments = [];
    fileUploaded.value = [];
    comment.value.comment = "";
    await setComments(idFeedback.value);
    scrollToLatest();
  }
}

function scrollToLatest() {
  const container = chatContent.value;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
  showScrollButton.value = false;
}

function handleScroll() {
  const container = chatContent.value;
  if (container) {
    showScrollButton.value =
      container.scrollHeight - container.scrollTop >
      container.clientHeight + 100;
  }
}

const expandedMessages: any = ref({});

const toggleSeenList = (index: number) => {
  expandedMessages.value[index] = !expandedMessages.value[index];
};

const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`;
};

const quickReplies = ref([
  "This is all noted, thank you",
  "Ok, we are working on it.",
  "Thank you, we are on the way.",
  "Yes, we will do it as soon as possible.",
  "Sorry, we cannot make it this time.",
  "We are here to help.",
]);

const selectQuickReply = (reply: string) => {
  comment.value.comment += ` ${reply}`;
};

const openImageDialog = ref(false);
const selectedImage = ref("");
function showImagePreview(id: string) {
  openImageDialog.value = true;
  selectedImage.value = id;
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
          const progress = Math.round((event.loaded / event.total) * 100);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);

          comment.value.attachments.push(response.id);

          fileUploaded.value.push({
            name: file.name,
            url: file.url,
            id: response.id,
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

const handleFileRemove = (removedFile: File) => {
  const index = comment.value.attachments.findIndex(
    (id) => id === removedFile.id,
  );

  if (index !== -1) {
    fileUploaded.value.splice(index, 1);
    comment.value.attachments.splice(index, 1);
  }
};
</script>

<style scoped>
.sent-message {
  border-radius: 15px 15px 0 15px;
  max-width: 80%;
  border-radius: 16px;
  border: 1px solid var(--dark-grey-border, #343a45);

  /* icon-glow-light-mode */
  box-shadow: 0px 5px 10px 0px rgba(19, 18, 24, 0.1);
}

.received-message {
  border-radius: 15px 15px 15px 0;
  max-width: 80%;
  border-radius: 16px;
  border: 1px solid var(--dark-grey-border, #343a45);

  /* icon-glow-light-mode */
  box-shadow: 0px 5px 10px 0px rgba(19, 18, 24, 0.1);
}

.text-end {
  text-align: right;
}

.text-start {
  text-align: left;
}

.message-input {
  border-radius: 15px;
}

/* @media (max-width: 600px) {
  .sent-message,
  .received-message {
    max-width: 90%;
  }
} */

.chat-content {
  padding-bottom: 200px;
}

.input-area {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  z-index: 10;
  padding: 1rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
/* .input-area {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 1rem;
  z-index: 10;
  padding: 1rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
} */
.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: -1;
  margin: 1rem;
  z-index: 10;
  padding: 1rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

/* .input-area {
  position: fixed;
  bottom: 16px;
  left: 16px;
  right: 16px;
  z-index: 10;
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
} */

.scroll-to-latest {
  position: fixed;
  bottom: 250px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 40;
}
/* .scroll-to-latest {
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 40;
} */

/* .row-height {
  max-height: calc(100vh - (152px));
} */

.carousel-container {
  position: relative;
  max-height: 200px; /* Adjust this value based on your needs */
  overflow-y: auto;
  margin-bottom: 1rem;
}
</style>
