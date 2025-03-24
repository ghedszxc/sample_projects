<template>
  <v-row no-gutters class="fill-height mx-2 py-1" align="center">
    <div class="row-height">
      <v-row dense>
        <v-col cols="12">
          <v-row no-gutters>
            <v-col cols="12">
              <v-row no-gutters class="mb-4">
                <v-col
                  cols="12"
                  class="text-h6 font-weight-bold mt-4"
                  style="letter-spacing: 2px !important"
                >
                  <v-btn
                    fav
                    density="compact"
                    icon="mdi-arrow-left"
                    variant="text"
                    @click="goBack()"
                  />
                  Work Order Details
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>

        <v-progress-linear
          :active="isLoadingWorkOrder"
          color="deep-purple"
          height="4"
          indeterminate
        />

        <v-col
          v-for="(section, i) in sections"
          :key="i"
          cols="12"
          :md="section == 'Chat' ? 5 : section == 'Information' ? 4 : 3"
          class="font-weight-light table-height"
        >
          <v-card class="mt-2" elevation="1">
            <!-- <v-card class="mx-auto mt-2" elevation="2" tile> -->
            <v-row no-gutters class="mt-1 px-4">
              <!-- header -->
              <v-col cols="12" class="text-h6 font-weight-bold">
                {{ section }}
              </v-col>
              <v-divider />
              <!-- section content -->
              <v-col v-if="section == 'List'" cols="12">
                <v-row no-gutters class="pt-4">
                  <v-col cols="12">
                    <!-- search -->
                    <search-text-field
                      @on-search="onSearch($event)"
                      @clear-search="
                        ((page = 1), (search = ''), updateFilter())
                      "
                    />
                    <!-- filter by status -->
                    <v-autocomplete
                      v-model="filterByStatus"
                      :items="[
                        'All',
                        'To-Do',
                        'Pending',
                        'In-Progress',
                        'Completed',
                        'Resolved',
                      ]"
                      item-title="name"
                      item-value="value"
                      hide-details
                      class="mt-4"
                      @update:modelValue="((page = 1), updateFilter())"
                      clearable
                    >
                      <template v-slot:label>
                        <span class="text-1-1rem">Filter by status</span>
                      </template>
                    </v-autocomplete>
                    <!-- date range -->
                    <base-date-filter-one-month-ago
                      class="mt-2"
                      @on-select-date-range="onSelectDateRange($event)"
                      @on-clear-date-rage="onClearDateRage($event)"
                    />
                  </v-col>
                  <!-- items -->
                  <v-col cols="12">
                    <v-progress-linear
                      v-if="isLoading"
                      :active="isLoading"
                      color="deep-purple"
                      height="4"
                      indeterminate
                    />
                    <v-list
                      v-if="!isLoading && workOrders.length"
                      class="pa-0"
                      max-height="682"
                    >
                      <template
                        v-for="(item, itemIndex) in workOrders"
                        :key="itemIndex"
                      >
                        <v-card
                          class="mt-4 border-md rounded-md"
                          style="padding: var(--f-spacing-80, 8px) 16px"
                          max-height="682"
                          :style="`background-color:
                      ${
                        item._id ==
                        (!selectedWorkOrderId ? id : selectedWorkOrderId)
                          ? '#E0E0E0'
                          : ''
                      }`"
                          @click="changeWorkOrder(item?._id)"
                        >
                          <v-list-item class="pa-0 ma-0">
                            <v-list-item-title
                              :class="
                                $vuetify.display.smAndDown ||
                                $vuetify.display.md
                                  ? 'py-2 px-2 rounded-lg mb-2 my-2'
                                  : 'py-0 px-2 mx-2 my-0'
                              "
                            >
                              <v-row no-gutters align="center">
                                <!-- created by -->
                                <v-col cols="12">
                                  <v-row
                                    no-gutters
                                    align="center"
                                    justify="start"
                                  >
                                    <span class="mr-2 d-flex font-weight-bold">
                                      Created By:
                                    </span>

                                    <span class="text-capitalize text-wrap">
                                      <v-avatar
                                        size="small"
                                        :color="materialColors[itemIndex]"
                                        class="mr-1 mb-2 text-white"
                                      >
                                        {{
                                          getInitial(
                                            `${item?.createdBy?.givenName} ${item?.createdBy?.surname}`,
                                          ) || "N/A"
                                        }}
                                      </v-avatar>
                                      {{
                                        `${item?.createdBy?.givenName} ${item?.createdBy?.surname}` ||
                                        "N/A"
                                      }}
                                    </span>
                                  </v-row>
                                </v-col>
                                <!-- subject  -->
                                <v-col cols="12" class="mb-3">
                                  <v-row
                                    no-gutters
                                    align="center"
                                    justify="start"
                                  >
                                    <span class="mr-2 d-flex font-weight-bold">
                                      Subject:
                                    </span>

                                    <span class="text-capitalize text-wrap">
                                      {{ item?.subject }}
                                    </span>
                                  </v-row>
                                </v-col>
                                <!-- status -->
                                <v-col cols="12" class="mb-3">
                                  <v-row
                                    no-gutters
                                    align="center"
                                    justify="start"
                                  >
                                    <span class="mr-2 d-flex font-weight-bold">
                                      Status:
                                    </span>

                                    <span>
                                      <v-sheet
                                        :color="`${
                                          /^(in-progress)$/i.test(item?.status)
                                            ? '#FB8C00'
                                            : item?.status &&
                                                /^(done|completed|resolved)$/i.test(
                                                  item?.status,
                                                )
                                              ? '#4CAF50'
                                              : item?.status &&
                                                  /^(pending|cancelled|deleted)$/i.test(
                                                    item?.status,
                                                  )
                                                ? 'red'
                                                : 'grey-lighten-3'
                                        }`"
                                        class="py-1 px-5 rounded-pill text-capitalize text-center text-1-1rem"
                                        :style="`${
                                          /^(in-progress)$/i.test(item?.status)
                                            ? 'max-width: 8.5rem'
                                            : item?.status &&
                                                /^(completed|resolved)$/i.test(
                                                  item?.status,
                                                )
                                              ? 'max-width: 8.5rem'
                                              : 'max-width: 6.5rem'
                                        }`"
                                      >
                                        {{ item?.status }}
                                      </v-sheet>
                                    </span>
                                  </v-row>
                                </v-col>
                                <!-- date created -->
                                <v-col cols="12" class="mb-3">
                                  <v-row
                                    no-gutters
                                    align="center"
                                    justify="start"
                                  >
                                    <span class="mr-2 d-flex font-weight-bold">
                                      Date Created:
                                    </span>

                                    <span class="text-wrap">
                                      {{ standardFormatDate(item?.createdAt) }}
                                    </span>
                                  </v-row>
                                </v-col>
                              </v-row>
                            </v-list-item-title>
                          </v-list-item>
                        </v-card>
                        <v-divider
                          v-if="
                            itemIndex + 1 !== items.length &&
                            $vuetify.display.lgAndUp
                          "
                        />
                      </template>
                    </v-list>
                    <span v-if="!workOrders.length">
                      No work order(s) found.
                    </span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col
                v-if="section == 'Chat'"
                cols="12"
                class="chat-page"
                :style="
                  (workOrder?.attachments?.length ?? 0 > 1)
                    ? ''
                    : 'margin-top: 300px'
                "
              >
                <!-- <v-col
                v-if="section == 'Chat'"
                cols="12"
                class="chat-page pa-0 ma-0"
              > -->
                <!-- messages -->

                <div class="chat-wrapper">
                  <!-- <div
                  class="chat-wrapper"
                  :style="
                    (workOrder?.attachments?.length ?? 0 > 1)
                      ? 'margin-top: 550px'
                      : ''
                  "
                > -->
                  <WorkOrderChat />
                </div>
              </v-col>
              <v-col v-if="section == 'Information'" cols="12">
                <v-row no-gutters justify="space-between" class="pa-2">
                  <!-- attached image(s) -->
                  <v-col cols="12" class="mt-6 font-weight-bold text-center">
                    <v-carousel
                      v-if="workOrder.attachments?.length"
                      height="300"
                    >
                      <v-carousel-item
                        v-for="(attachedFile, i) in workOrder.attachments"
                        :key="i"
                        :src="`/api/files/${attachedFile}`"
                        cover
                      >
                        <template v-slot:placeholder>
                          <div
                            class="d-flex align-center justify-center fill-height"
                          >
                            <v-progress-circular
                              color="grey-lighten-4"
                              indeterminate
                            />
                          </div>
                        </template>
                      </v-carousel-item>
                    </v-carousel>
                    <span v-else> No attachment(s) found.</span>
                  </v-col>
                  <!-- assignee -->
                  <v-col cols="6" class="mt-6 font-weight-bold">
                    Assignee
                  </v-col>
                  <v-col cols="6" class="mt-5 text-end">
                    <span v-if="workOrder?.assigneeName">
                      <v-avatar
                        v-if="workOrder?.assigneeName"
                        size="small"
                        color="primary"
                        class="mr-2 text-white"
                      >
                        {{ getInitial(workOrder?.assigneeName) }}
                      </v-avatar>
                      <span class="mt-1 text-wrap">
                        {{ workOrder?.assigneeName || "N/A" }}
                      </span>
                    </span>
                    <!-- <span v-else>
                      <v-btn
                        text="accept"
                        prepend-icon="mdi-handshake"
                        variant="flat"
                        color="primary"
                        @click="accept(workOrder)"
                        :disabled="isAcceptingFeedback"
                        :loading="isAcceptingFeedback"
                      />
                    </span> -->
                    <span v-else>Not Assigned</span>
                  </v-col>
                  <v-divider />
                  <!-- service provider -->
                  <v-col cols="6" class="my-3 font-weight-bold">
                    Service Provider
                  </v-col>
                  <v-col cols="6" class="my-3 text-end">
                    {{ selectedProvider || "N/A" }}
                  </v-col>
                  <v-divider />
                  <!-- location -->
                  <v-col cols="6" class="my-3 font-weight-bold">
                    Location
                  </v-col>
                  <v-col cols="6" class="my-3 text-end">
                    {{ workOrder.location }}
                  </v-col>
                  <v-divider />
                  <!-- subject description -->
                  <v-col
                    cols="6"
                    class="my-3 font-weight-bold d-flex align-center"
                  >
                    Subject
                  </v-col>
                  <v-col cols="6" class="my-3 text-end">
                    {{ workOrder.subject || "N/A" }}
                  </v-col>
                  <v-divider />
                  <!-- work order description -->
                  <v-col cols="12" class="mt-3 font-weight-bold">
                    Work Order Description
                  </v-col>
                  <v-col cols="12" class="mb-1">
                    {{ workOrder?.description || "N/A" }}
                  </v-col>
                  <v-divider />
                  <!-- status -->
                  <v-col cols="12">
                    <v-row no-gutters align="end">
                      <v-col cols="7" class="mt-6 font-weight-bold">
                        Status
                      </v-col>
                      <v-col cols="4" class="mt-6">
                        <v-sheet
                          :color="`${
                            /^(in-progress)$/i.test(workOrder.status)
                              ? '#FB8C00'
                              : workOrder.status &&
                                  /^(done|completed|resolved)$/i.test(
                                    workOrder.status,
                                  )
                                ? '#4CAF50'
                                : workOrder.status &&
                                    /^(pending|cancelled|deleted)$/i.test(
                                      workOrder.status,
                                    )
                                  ? 'red'
                                  : 'grey-lighten-3'
                          }`"
                          class="py-1 rounded-pill text-capitalize text-center"
                          :style="`${
                            /^(in-progress)$/i.test(workOrder.status)
                              ? 'max-width: 8.5rem'
                              : workOrder?.status &&
                                  /^(completed|resolved)$/i.test(
                                    workOrder?.status,
                                  )
                                ? 'max-width: 8.5rem'
                                : 'max-width: 6.5rem'
                          }`"
                        >
                          {{ workOrder?.status }}
                        </v-sheet>
                      </v-col>
                      <v-col
                        v-if="
                          Array.isArray(workOrder?.statusUpdates) &&
                          workOrder?.statusUpdates?.length > 0
                        "
                        cols="1"
                        class="mt-6 text-end"
                      >
                        <v-icon
                          class="mb-1"
                          style="cursor: pointer"
                          @click="openHistoryDialog = true"
                        >
                          mdi-update
                        </v-icon>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-divider class="my-3" />
                  <!-- change service provider -->
                  <v-col cols="12" class="mt-7">
                    <v-menu location="bottom">
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          block
                          variant="outlined"
                          text="change service provider"
                          size="large"
                          :disabled="isUpdatingProvider"
                          :loading="isUpdatingProvider"
                        />
                      </template>
                      <v-list density="compact">
                        <v-list-item
                          v-for="(item, i) in serviceProviders"
                          :key="i"
                          @click="changedProvider(item)"
                        >
                          {{ item }}
                          <v-divider
                            v-if="serviceProviders.length > 1"
                            class="my-2"
                          />
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                  <!-- mark as completed -->
                  <v-col cols="12" class="mt-5">
                    <v-btn
                      block
                      :text="`${!/^(completed)$/i.test(workOrder.status) ? 'mark as complete' : 're-open'}`"
                      size="large"
                      color="primary"
                      :prepend-icon="`mdi-${!/^(completed)$/i.test(workOrder.status) ? 'check-circle' : 'refresh'}`"
                      :disabled="isUpdatingStatus"
                      @click="
                        !/^(completed)$/i.test(workOrder.status)
                          ? openMarkAsCompleteDialog()
                          : confirmReOpenDelete('re-open')
                      "
                      :loading="isUpdatingStatus"
                    />
                  </v-col>
                  <!-- delete -->
                  <v-col cols="12" class="mt-5">
                    <v-btn
                      block
                      text="delete"
                      size="large"
                      color="red"
                      prepend-icon="mdi-delete"
                      :disabled="
                        isUpdatingStatus ||
                        /^(deleted)$/i.test(workOrder.status)
                      "
                      @click="confirmReOpenDelete('delete')"
                      :loading="isUpdatingStatus"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-row>

  <!-- history dialog -->
  <v-dialog v-model="openHistoryDialog" max-width="500" persistent>
    <v-card>
      <v-toolbar>
        <span class="ml-4 font-weight-bold" style="color: #042134">
          History
        </span>
        <v-spacer />
        <v-btn icon="mdi-close" @click="openHistoryDialog = false" />
      </v-toolbar>
      <v-row no-gutters align="center" class="pa-4">
        <v-col
          v-for="(history, i) in workOrder?.statusUpdates"
          :key="i"
          cols="12"
          class="mb-6"
        >
          <v-card class="border-sm" elevation="2">
            <v-row no-gutters class="pa-4">
              <!-- date -->
              <v-col v-if="history.updatedAt" cols="12">
                <v-row no-gutters justify="space-between">
                  <v-col cols="auto"> Date </v-col>
                  <v-col cols="auto">
                    <v-icon class="mb-1"> mdi-calendar-month-outline </v-icon>
                    {{ standardFormatDate(new Date(history.updatedAt)) }}
                  </v-col>
                  <v-divider thickness="2" class="my-4"></v-divider>
                </v-row>
              </v-col>
              <!-- updated by -->
              <v-col v-if="history?.updatedByName" cols="12">
                <v-row no-gutters justify="space-between">
                  <v-col cols="auto"> Updated By </v-col>
                  <v-col cols="auto">
                    <v-avatar
                      size="small"
                      color="primary"
                      class="mr-2 text-white"
                    >
                      {{ getInitial(history?.updatedByName) }}
                    </v-avatar>
                    <span class="mt-1 text-wrap">
                      {{ history?.updatedByName }}
                    </span>
                  </v-col>
                  <v-divider thickness="2" class="my-4"></v-divider>
                </v-row>
              </v-col>
              <!-- status -->
              <v-col v-if="history?.status" cols="12">
                <v-row no-gutters justify="space-between">
                  <v-col cols="7" class="mt-2"> Status </v-col>
                  <v-col cols="4">
                    <v-sheet
                      :color="`${
                        /^(in-progress)$/i.test(history.status)
                          ? '#FB8C00'
                          : history.status &&
                              /^(done|completed|resolved)$/i.test(
                                history.status,
                              )
                            ? '#4CAF50'
                            : history.status &&
                                /^(pending|cancelled|deleted)$/i.test(
                                  history.status,
                                )
                              ? 'red'
                              : 'grey-lighten-3'
                      }`"
                      class="py-1 rounded-pill text-capitalize text-center"
                    >
                      {{ history?.status }}
                    </v-sheet>
                  </v-col>
                  <v-divider thickness="2" class="my-4" />
                </v-row>
              </v-col>
              <!-- work order -->
              <v-col v-if="history.workOrder" cols="12">
                <v-row no-gutters justify="space-between">
                  <v-col cols="auto"> Work Order </v-col>
                  <v-col cols="auto">
                    <span class="font-weight-bold">
                      {{ `#${history.workOrder?.slice(-6).toUpperCase()}` }}
                      <v-icon
                        v-if="history.isHighPriority"
                        color="red"
                        class="mb-1"
                      >
                        mdi-alert-circle-outline
                      </v-icon>
                    </span>
                  </v-col>
                  <v-divider thickness="2" class="my-4"></v-divider>
                </v-row>
              </v-col>
              <!-- provider -->
              <v-col v-if="history.providerName" cols="12">
                <v-row no-gutters justify="space-between">
                  <v-col cols="auto"> Provider </v-col>
                  <v-col cols="auto">
                    {{ history.providerName }}
                  </v-col>
                  <v-divider thickness="2" class="my-4" />
                </v-row>
              </v-col>
              <!-- signature -->
              <v-col v-if="history.signature" cols="12">
                <v-row no-gutters justify="space-between">
                  <v-col cols="12"> Signature </v-col>
                  <v-col cols="12">
                    <v-img
                      :src="history.signature"
                      class="border-md"
                      contain
                      style="width: 100%; height: 100%"
                    />
                  </v-col>
                  <v-divider thickness="2" class="my-4" />
                </v-row>
              </v-col>
              <!-- attached image(s) -->
              <v-col cols="12" class="mt-5">
                <v-row
                  v-if="
                    Array.isArray(history.attachments) &&
                    history.attachments?.length > 0
                  "
                  no-gutters
                >
                  <v-col cols="12">
                    Attached Images ({{ history.attachments?.length }})
                  </v-col>
                  <v-col cols="12">
                    <v-carousel height="300">
                      <v-carousel-item
                        v-for="(attachedFile, i) in history.attachments"
                        :key="i"
                        :src="`/api/files/${attachedFile}`"
                        cover
                      >
                        <template v-slot:placeholder>
                          <div
                            class="d-flex align-center justify-center fill-height"
                          >
                            <v-progress-circular
                              color="grey-lighten-4"
                              indeterminate
                            />
                          </div>
                        </template>
                      </v-carousel-item>
                    </v-carousel>
                  </v-col>
                </v-row>
                <v-row v-else no-gutters justify="center">
                  No attachment(s) found.
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>

  <!-- mark as complete dialog -->
  <v-dialog
    v-model="isMarkAsCompleteDialog"
    transition="dialog-bottom-transition"
    style="max-width: 650px"
  >
    <v-card
      color="cardBackground"
      style="
        border-radius: 24px;
        box-shadow: 0px 16px 30px 0px rgba(0, 0, 0, 0.3);
      "
    >
      <v-toolbar color="background">
        <span class="ml-6 font-weight-bold text-1-4rem">
          Work Order Completion
        </span>
        <v-spacer />
        <v-btn @click="onCloseMarkAsCompleteDialog()">
          <v-icon size="40">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-col cols="12" class="px-4 mb-0pb-0">
        <v-row class="justify-center pa-5">
          <UtilsCarousel
            v-if="attachedFiles && attachedFiles.length > 0"
            :urls="attachedFiles.map((file) => file.url)"
            :img-editable="true"
            @on-image-edit="onImageEditedMarkAsComplete"
          />
          <v-img v-else src="/icons/placeholder-image.svg" />
        </v-row>
        <v-row no-gutters class="d-flex">
          <v-col cols="12">
            <UtilsFileInput
              label="Attach File (Required)"
              :init-files="attachedFiles.map((file) => file.data)"
              @on-file-attach="onFileAttach($event)"
              @on-clear="attachedFiles = []"
              @onFileRemoved="handleFileRemovedMarkAsComplete"
            />
          </v-col>
        </v-row>
        <v-divider class="mt-3"></v-divider>
      </v-col>

      <v-col cols="12" class="px-4">
        <v-btn
          color="primary"
          block
          size="large"
          @click="updateStatus('Completed')"
          :loading="isUpdatingStatus"
          :disabled="isUpdatingStatus"
        >
          Submit
        </v-btn>
      </v-col>
    </v-card>
  </v-dialog>

  <!-- delete/re-open -->
  <v-dialog
    v-model="openConfirmReOpenDeleteDialog"
    transition="dialog-bottom-transition"
    max-width="500"
  >
    <v-card>
      <v-toolbar>
        <span class="ml-6 font-weight-bold"> Update Status </span>
        <v-spacer />
        <v-btn @click="openConfirmReOpenDeleteDialog = false">
          <v-icon size="40">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-row no-gutters class="pa-8">
        <v-card-text class="text-center text-h6">
          Are you sure you want to {{ statusUpdateAction }} this work order?
        </v-card-text>
        <v-col cols="12" class="mt-5 mb-2 text-center">
          <v-btn
            color="primary"
            size="large"
            @click="updateStatus(statusUpdateAction)"
            :loading="isUpdatingStatus"
            :disabled="isUpdatingStatus"
          >
            confirm
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

definePageMeta({
  middleware: ["secure"],
});

const { currentUser } = useLocalAuth();

const sections = ["List", "Chat", "Information"];

const openHistoryDialog = ref<boolean>(false);

const openConfirmReOpenDeleteDialog = ref<boolean>(false);

const {
  //standardFormatDateTime,
  standardFormatDate,
  materialColors,
  getInitial,
} = useUtils();

const { attachedFiles, uploadFileUtil, isFileUploading } = useUploadFiles();

const {
  setWorkOrders,
  workOrders,
  workOrder,
  getWorkOrderById,
  setWorkOrder,
  //updateGeneralWorkOrder,
  updateWorkOrderStatus,
  //updateStatusWorkOrder,
  //updateWorkOrderAssignee,
  //updateWorkOrderProvider,
  search,
  page,
  isLoading,
} = useWorkOrder();
const {
  getCommentsByFeedBackId,
  addComment,
  comment,
  setComments,
  comments,
  updateSeenBy,
} = useComment();
const { getAllServicesAvailable, getSitesCollabByPageSearch } = useSiteCollab();
const { siteOptions, filterSite, getSitesOptionsForFiltering, mySite, myOrg } =
  useFilter();
// const { setWorkOrder, workOrder, addWorkOrder } = useWorkOrder();
const { setSnackbar } = useLocal();

const services = ref<string[]>([]);
const serviceProviders = ref<TServiceProvider[]>([]);
const isFetchingServiceProviders = ref(false);

const isUpdatingStatus = ref<boolean>(false);

const id = computed(() => useRoute().params.id as string);
const pageQuery: any = computed(() => useRoute().query.page);
//const editingDescription = ref<boolean>(false);
// const actionMenu = ref<boolean>(false);
const params = ref({
  id: id.value,
});

// let providerName = ref("");
let selectedProvider = ref<string>("");
//let selectedProviderWorkOrder = ref<string>("");
let providersArray = ref<string[]>([]);

const filterByStatus = ref("All");
const filters = ref({
  from: new Date().toLocaleDateString(),
  to: new Date().toLocaleDateString(),
});

const isLoadingWorkOrder = ref<boolean>(false);
const selectedWorkOrderId = ref<string>("");
// const isAcceptingWorkOrder = ref<boolean>(false);
const isUpdatingProvider = ref<boolean>(false);
// const createWorkOrderDialog = ref<boolean>(false);
// const isHighPriority = ref<boolean>(false);
// const isCreatingWorkOrder = ref<boolean>(false);

onMounted(async () => {
  page.value = pageQuery.value;

  await getSitesOpt();

  page.value = pageQuery.value;
  await updateFilter();

  const response = await getAllServicesAvailable(String(mySite.value));
  const availableServices = response.items.map(
    (i) => (i.serviceProvider as { service: string }).service,
  );

  services.value = availableServices;

  const result = await getWorkOrderById(id.value);

  if (result) {
    setWorkOrder(result);
    //when provider has value, get provider
    // if (workOrder.value.provider.length > 10) {
    await fetchServiceProvidersBySiteService();
    // }
  }

  isLoadingWorkOrder.value = false;
});

onUnmounted(() => {
  workOrders.value = [];
  setWorkOrder();
});

const { myProvider } = useFilter();
const isMarkAsCompleteDialog = ref<boolean>(false);
const fileUploaded = ref<Array<{ data: File }>>([]);
// const isSignatureShow = ref<boolean>(false);
// const signatureData = ref<string>("");
// const isConfirmingModalDeleteOrComplete = ref<boolean>(false);

const statusUpdateAction = ref<string>("");

function confirmReOpenDelete(status: string) {
  if (status !== "re-open") {
    if (workOrder.value.createdBy !== currentUser.value._id) {
      setSnackbar({
        text: "Only the user who originally created this workOrder can delete it.",
        modal: true,
        type: "error",
      });
      return;
    }
  } else {
    if (currentUser.value.type !== "site") {
      setSnackbar({
        text: "Only the site personnel can re-open this workOrder.",
        modal: true,
        type: "error",
      });
      return;
    }
  }

  statusUpdateAction.value = status;
  openConfirmReOpenDeleteDialog.value = true;
}

function openMarkAsCompleteDialog() {
  if (currentUser.value.type == "site") {
    isMarkAsCompleteDialog.value = true;
  } else {
    setSnackbar({
      text: "Only the site personnel can complete this workOrder.",
      modal: true,
      type: "error",
    });
    return;
    // if (myProvider.value === workOrder.value.provider) {
    //   if (!workOrder.value.assignee) {
    //     setSnackbar({
    //       text: "You need to accept this workOrder first.",
    //       modal: true,
    //       type: "error",
    //     });
    //   } else {
    //     isMarkAsCompleteDialog.value = true;
    //   }
    // } else {
    //   setSnackbar({
    //     text: "Only the assigned provider can mark it as complete.",
    //     modal: true,
    //     type: "error",
    //   });
    // }
  }
}

const { getImage } = useUtils();

const onImageEditedMarkAsComplete = async (url: string, idx: number) => {
  const response = await getImage(url);
  if (!response) return;
  fileUploaded.value[idx].data = new File(
    [response],
    fileUploaded.value[idx].data?.name,
  );
  fileUploaded.value[idx].url = url;
};

const onFileAttach = (file: Array<{ data: File }>) => {
  for (const item of file) {
    fileUploaded.value.push(item);
  }
};

const handleFileRemovedMarkAsComplete = ({
  index,
  file,
}: {
  index: number;
  file: File;
}) => {
  fileUploaded.value = fileUploaded.value.filter((_, i) => i !== index);
};

async function getSitesOpt() {
  try {
    isLoading.value = true;
    await getSitesOptionsForFiltering();
  } catch (error: any) {
    setSnackbar({ text: error.message || error, modal: true, type: "error" });
  } finally {
    isLoading.value = false;
    filterSite.value =
      siteOptions.value.find((i: any) => i._id === mySite.value)?._id || "";
  }
}

async function updateFilter() {
  await setWorkOrders({
    site: filterSite.value || mySite.value,
    provider: myProvider.value,
    startDate: filters.value.from,
    endDate: filters.value.from === "" ? "" : filters.value.to,
    search: search.value,
    status: filterByStatus.value == "All" ? "" : filterByStatus.value,
  });
}

function onSearch(searchTerm: string) {
  debouncedSearch(searchTerm);
}

const debouncedSearch = debounce(async (value: string) => {
  search.value = value;
  page.value = 1;
  await updateFilter();
}, 500);

async function onSelectDateRange(filter: { to: string; from: string }) {
  filters.value = filter;
  page.value = 1;
  await updateFilter();
}

async function onClearDateRage(filter: { to: string; from: string }) {
  page.value = 1;
  await setWorkOrders({
    // organization: myOrg.value,
    provider: currentUser.value.type.includes("service-provider")
      ? ""
      : myProvider.value,

    site: filterSite.value || mySite.value,
    status: filterByStatus.value == "All" ? "" : filterByStatus.value,
    search: search.value,
  });
}

async function changeWorkOrder(workOrderId: string) {
  selectedWorkOrderId.value = workOrderId;

  selectedProvider.value = "";

  isLoadingWorkOrder.value = true;
  const result = await getWorkOrderById(workOrderId);
  await setComments(workOrderId);

  if (result) {
    setWorkOrder(result);

    await fetchServiceProvidersBySiteService();
  }
  isLoadingWorkOrder.value = false;
}

async function changedProvider(data: any) {
  isUpdatingProvider.value = true;

  let found: any = providersArray.value.find((p: any) => p.name == data);

  workOrder.value.provider = found._id;

  //update provider
  await updateProvider();
  isUpdatingProvider.value = false;
}

// const openImageDialog = ref(false);
// const selectedImage = ref("");

// function openInApp(id: string) {
//   openImageDialog.value = true;
//   selectedImage.value = id;
// }

// function imageDialogClosed() {
//   selectedImage.value = "";
// }

async function goBack() {
  // useRouter().back();
  await navigateTo({
    path: "/work-orders",
    query: {
      site: mySite.value,
    },
  });
}

async function updateProvider() {
  try {
    if (currentUser.value.type !== "site") {
      setSnackbar({
        text: "Only the site personnel can change the service provider.",
        modal: true,
        type: "error",
      });
      return;
    }

    const data = {
      _id: workOrder.value._id,
      statusUpdate: {
        status: "To-Do",
        updatedById: currentUser.value._id,
        updatedByName: `${currentUser.value.givenName} ${currentUser.value.surname}`,
        provider: workOrder.value.provider as string,
      },
    };

    await updateWorkOrderStatus(data);

    const result = await getWorkOrderById(id.value);

    if (result) {
      setWorkOrder(result);

      await fetchServiceProvidersBySiteService();
    }

    isLoadingWorkOrder.value = false;
  } catch (error) {
    console.log("Error occurred while updating provider:", error);
  }
}

async function updateStatus(action: string) {
  try {
    isUpdatingStatus.value = true;
    let file;

    if (attachedFiles.value) {
      isFileUploading.value = true;
      file = await uploadFileUtil(attachedFiles.value);
      isFileUploading.value = false;
    }

    const attachments = file ? file.map((f: any) => f._id) : [];

    const status = action.toLowerCase().includes("delete")
      ? "Deleted"
      : action.toLowerCase().includes("assign")
        ? "In-Progress"
        : action.toLowerCase().includes("re-open")
          ? "To-Do"
          : "Completed";

    const data: any = {
      _id: !selectedWorkOrderId.value ? id.value : selectedWorkOrderId.value,
      statusUpdate: {
        status: status,
        updatedById: currentUser.value._id,
        updatedByName: `${currentUser.value.givenName} ${currentUser.value.surname}`,
        assignee: currentUser.value._id,
        // signature: signatureData.value,
        attachments: attachments,
        provider: action === "Assign Feedback" ? myProvider.value : "",
      },
    };

    // const workOrderResponse: any =
    await updateWorkOrderStatus(data);

    isLoadingWorkOrder.value = true;

    // refetch list
    await updateFilter();

    const result = await getWorkOrderById(id.value);

    if (result) {
      setWorkOrder(result);
      //await fetchServiceProvidersBySiteService();
    }

    // if (workOrderResponse) {
    //   handleSuccessWorkOrder();
    // }
  } catch (error) {
    // handleErrorWorkOrder(error);
  } finally {
    onCloseMarkAsCompleteDialog();
    isUpdatingStatus.value = false;
    isLoadingWorkOrder.value = false;
  }
}

function onCloseMarkAsCompleteDialog() {
  openConfirmReOpenDeleteDialog.value = false;
  isMarkAsCompleteDialog.value = false;
  attachedFiles.value = [];
}

async function fetchServiceProvidersBySiteService() {
  isFetchingServiceProviders.value = true;

  const response = await getSitesCollabByPageSearch({
    site: String(mySite.value),
    service: "",
    status: "approved",
    limit: 100,
  });

  isFetchingServiceProviders.value = false;

  // serviceProviders.value = response.items as unknown as TServiceProvider[];
  providersArray.value = [];
  serviceProviders.value = response.items.map((i: any) => {
    providersArray.value.push(i.serviceProvider);
    return i.serviceProvider.name;
  });

  populateSelectedProvider();
}

function populateSelectedProvider() {
  //if there's already a service
  if (workOrder.value.provider.length > 10) {
    let found = providersArray.value.find(
      (p: any) => p._id == workOrder.value.provider,
    );
    if (found) {
      selectedProvider.value = found.name;
    }
  }
}

const _workOrder = computed(() => workOrder.value);

// const workOrderWorkOrder = computed(() => {
//   return {
//     _id: `#${workOrder.value.workOrders?.at(0)?._id.slice(-6).toUpperCase()}`,
//     description: workOrder.value.workOrders?.at(0)?.description,
//     isHighPriority: workOrder.value.workOrders?.at(0)?.isHighPriority,
//   };
// });

const items = computed(() => {
  return [
    {
      text: "Name",
      icon: "mdi-createdBy",
      subtitle: _workOrder.value.createdByName,
    },
    {
      text: "Email",
      icon: "mdi-createdBy",
      subtitle: _workOrder.value.createdByEmail,
    },
    {
      text: "Description",
      to: "workOrders-id-description",
      params: params.value,
      icon: "mdi-workOrder",
      subtitle: _workOrder.value.description,
    },
    {
      text: "Location",
      icon: "mdi-workOrder",
      subtitle: _workOrder.value.location,
    },
    {
      text: "Service",
      icon: "mdi-workOrder",
      subtitle: _workOrder.value.service,
    },
    {
      text: "Provider",
      icon: "mdi-workOrder",
      subtitle: _workOrder.value.providerName,
    },
    {
      text: "Status",
      icon: "mdi-createdBy",
      subtitle: _workOrder.value.status,
    },
    {
      text: "Work Order",
      icon: "mdi-createdBy",
      to: "work-orders-id",
      params: { id: _workOrder.value.workOrder },
      subtitle: _workOrder.value.workOrder
        ? _workOrder.value.workOrder.slice(-6)
        : "N/A",
    },
  ];
});

// async function filterItems() {
//   if (!workOrder.value.service) {
//     items.value.push({
//       text: "Service",
//       to: "workOrders-id-service",
//       params: params.value,
//       icon: "mdi-service",
//       subtitle: _workOrder.value.service,
//     });
//   } else {
//     items.value.push({
//       text: "Service",
//       icon: "mdi-service",
//       subtitle: _workOrder.value.service,
//     });
//   }

//   if (workOrder.value.status) {
//     items.value.push({
//       text: "Status",
//       icon: "mdi-status",
//       subtitle: _workOrder.value.status,
//     });
//   }

//   if (
//     workOrder.value.status == "On Going" ||
//     workOrder.value.status == "Completed"
//   ) {
//     items.value.push({
//       text: "Assignee",
//       icon: "mdi-assignee",
//       subtitle: `${_workOrder.value.assignee.givenName} ${_workOrder.value.assignee.surname}`,
//     });
//   }
// }
</script>

<style scoped>
.table-height {
  max-height: calc(100vh - (60px + 120px));
  overflow-y: auto;
}
/* .table-height {
  max-height: calc(100vh - (60px + 130px));
  overflow-y: auto;
} */
/* .table-height {
  max-height: calc(100vh - (60px + 130px));
  overflow-y: auto;
} */

.row-height {
  max-height: calc(100vh - (16px));
}

.chat-page {
  max-height: calc(100vh - (60px + 190px));
  overflow-y: auto;
}

.bottom-div {
  margin-top: auto;
}
</style>
