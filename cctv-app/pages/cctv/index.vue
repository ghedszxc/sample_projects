<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card width="100%" elevation="3" height="100%" :loading="isCctvsLoaded">
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
            <v-row>
              <v-col cols="12">
                <v-data-iterator :items="cctvs" :items-per-page="10">
                  <template v-slot:header>
                    <v-row no-gutters class="align-center pa-4">
                      <v-col cols="12" class="mb-2">
                        <div class="d-flex align-center">
                          <span class="font-weight-bold text-h5 mr-4">
                            Sky-i
                          </span>
                        </div>
                      </v-col>

                      <v-col cols="12" sm="12" md="6" lg="8" class="pr-md-2">
                        <v-row no-gutters align="center">
                          <v-col cols="12" sm="12" lg="8">
                            <v-text-field
                              v-model="search"
                              hide-details
                              density="compact"
                              placeholder="Search"
                              append-inner-icon="mdi-magnify"
                              @update:model-value="onSearchTable()"
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="3"
                        lg="2"
                        v-if="$ability.can('create', 'create-cctv')"
                        class="my-2 pr-sm-2"
                      >
                        <v-row no-gutters>
                          <v-btn
                            variant="tonal"
                            block
                            size="small"
                            style="height: 40px"
                            @click="uploader.click()"
                            prepend-icon="mdi-file-upload-outline"
                            :loading="isUploading"
                          >
                            <v-file-input
                              v-model="files"
                              accept=".csv,.xlsx"
                              ref="uploader"
                              class="d-none"
                              @change="onFileSelect"
                            ></v-file-input>
                            Upload CCTV Blocks
                          </v-btn>
                        </v-row>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="6"
                        md="3"
                        lg="2"
                        class="pl-sm-2"
                        v-if="$ability.can('create', 'create-cctv')"
                      >
                        <v-row no-gutters>
                          <v-btn
                            color="blue-darken-3"
                            block
                            variant="flat"
                            size="small"
                            style="height: 40px"
                            @click="openDialog('create')"
                          >
                            Create CCTV Blocks
                          </v-btn>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-divider />
                    <v-list
                      class="pa-0"
                      density="compact"
                      v-if="$vuetify.display.smAndUp"
                    >
                      <v-list-item class="">
                        <v-list-item-title>
                          <v-row no-gutters align="center">
                            <v-col cols="12" sm="4" md="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Name
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" sm="3" md="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  <span v-if="$vuetify.display.mdAndUp">
                                    Total Camera
                                  </span>
                                  <span v-if="$vuetify.display.sm"
                                    >Total/Active</span
                                  >
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              sm="3"
                              md="3"
                              v-if="$vuetify.display.mdAndUp"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Active Camera
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" sm="4" md="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="start"
                                align="start"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                  style="margin-top: 3px"
                                >
                                  <v-menu location="bottom">
                                    <template #activator="{ props }">
                                      <v-btn v-bind="props" size="x-small" flat>
                                        <v-icon size="small" class="mb-1"
                                          >mdi-filter-variant</v-icon
                                        >
                                      </v-btn>
                                    </template>

                                    <v-card width="250">
                                      <v-card-text>
                                        <v-list
                                          density="compact"
                                          class="text-caption pa-0"
                                        >
                                          <v-list-item link @click.stop="">
                                            <v-text-field
                                              v-model="filters.from"
                                              readonly
                                              label="Start Date"
                                              hide-details
                                              clearable
                                              append-inner-icon="mdi-calendar"
                                              class="w-100 mt-2"
                                              @click="startDateDialog = true"
                                            >
                                              <v-dialog
                                                v-model="startDateDialog"
                                                max-width="355"
                                              >
                                                <v-card>
                                                  <v-card-subtitle>
                                                    <v-date-picker
                                                      width="320"
                                                      v-model="startDate"
                                                      @input="updateStartDate"
                                                      :locale="locale"
                                                      @change="applyStartDate"
                                                    ></v-date-picker>
                                                  </v-card-subtitle>
                                                </v-card>
                                              </v-dialog>
                                            </v-text-field>
                                          </v-list-item>
                                        </v-list>
                                      </v-card-text>
                                    </v-card>
                                  </v-menu>
                                  Date Created
                                </span>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider />
                    </v-list>
                  </template>

                  <template
                    v-if="$vuetify.display.smAndUp"
                    #default="{ items }"
                  >
                    <v-list class="pa-0">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="itemIndex"
                      >
                        <v-list-item class="py-4">
                          <template #default>
                            <v-list-item-title>
                              <v-row no-gutters align="center">
                                <v-col
                                  cols="12"
                                  sm="4"
                                  md="3"
                                  class="text-capitalize white--text text"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span
                                      class="d-inline-block text-truncate text-capitalize text-body-2"
                                    >
                                      <v-avatar
                                        size="small"
                                        color="#1867C0"
                                        class="mr-2"
                                      >
                                        <v-icon icon="mdi-cctv"> </v-icon>
                                      </v-avatar>
                                      {{ item.raw.block.name }}
                                      {{ item.raw.level.level }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  sm="3"
                                  md="3"
                                  class="text-capitalize white--text text"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span
                                      class="d-inline-block text-truncate text-capitalize text-body-2"
                                    >
                                      <v-icon
                                        icon="mdi-cctv"
                                        class="mr-2"
                                      ></v-icon>
                                      {{
                                        `${item.raw.cctvCount} Camera${item.raw.cctvCount > 1 ? "s" : ""}`
                                      }}
                                    </span>
                                    <span
                                      class="d-inline-block text-truncate text-capitalize text-body-2 w-100"
                                      v-if="$vuetify.display.sm"
                                    >
                                      <v-icon
                                        icon="mdi-calendar-month-outline"
                                        class="mr-2"
                                      ></v-icon>
                                      {{
                                        `${item.raw.activeCctvCount} Camera${item.raw.activeCctvCount > 1 ? "s" : ""}`
                                      }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  sm="4"
                                  md="3"
                                  class="text-capitalize white--text text"
                                  v-if="$vuetify.display.mdAndUp"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span
                                      class="d-inline-block text-truncate text-capitalize text-body-2"
                                    >
                                      <v-icon
                                        icon="mdi-cctv"
                                        class="mr-2"
                                        color="green"
                                      ></v-icon>
                                      {{
                                        `${item.raw.activeCctvCount} Camera${item.raw.activeCctvCount > 1 ? "s" : ""}`
                                      }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  sm="4"
                                  md="2"
                                  class="text-capitalize white--text text"
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span
                                      class="d-inline-block text-capitalize text-body-2"
                                    >
                                      <v-icon
                                        icon="mdi-calendar-month-outline"
                                        class="mr-2"
                                      ></v-icon>
                                      <span
                                        style="
                                          word-break: break-word;
                                          white-space: normal;
                                        "
                                      >
                                        {{
                                          item.raw.createdAt
                                            ? standardFormatDateTime(
                                                item.raw.createdAt,
                                              )
                                            : "N/A"
                                        }}
                                      </span>
                                    </span>
                                  </v-row>
                                </v-col>
                                <v-col cols="1">
                                  <v-row
                                    no-gutters
                                    align-content="end"
                                    justify="end"
                                    align="center"
                                  >
                                    <v-menu :close-on-content-click="true">
                                      <template #activator="{ props }">
                                        <v-btn
                                          v-bind="props"
                                          icon
                                          flat
                                          size="x-small"
                                        >
                                          <v-icon>mdi-dots-vertical</v-icon>
                                        </v-btn>
                                      </template>

                                      <v-card>
                                        <v-list density="compact" class="pa-0">
                                          <v-list-item
                                            v-if="
                                              $ability.can('read', 'view-cctv')
                                            "
                                            :to="{
                                              name: 'cctv-id',
                                              params: { id: item.raw._id },
                                              query: {
                                                site: mySite,
                                              },
                                            }"
                                          >
                                            <span class="text-caption">
                                              View CCTV Block
                                            </span>
                                          </v-list-item>
                                          <v-list-item
                                            @click="
                                              openDialog(
                                                'edit',
                                                item.raw._id,
                                                mySite,
                                              )
                                            "
                                          >
                                            <span class="text-caption">
                                              Edit CCTV Block
                                            </span>
                                          </v-list-item>

                                          <CctvDeleteCctvBlock
                                            :cctvBlock="item.raw"
                                          />
                                        </v-list>
                                      </v-card>
                                    </v-menu>
                                  </v-row>
                                </v-col>
                              </v-row>
                            </v-list-item-title>
                          </template>
                        </v-list-item>

                        <v-divider
                          v-if="itemIndex + 1 !== items.length"
                        ></v-divider>
                      </template>
                    </v-list>
                  </template>

                  <template v-else #default="{ items }">
                    <v-list class="pa-0">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="item.raw._id"
                      >
                        <v-list-item class="py-4">
                          <v-list-item-title>
                            <v-row no-gutters align="center">
                              <v-col
                                cols="6"
                                md="2"
                                class="pa-2 text-capitalize white--text"
                              >
                                <span>Name:</span>
                              </v-col>
                              <v-col
                                cols="6"
                                md="10"
                                class="pa-2 text-capitalize white--text d-flex justify-end"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize"
                                  :style="
                                    $vuetify.display.xs
                                      ? 'font-size: .8rem'
                                      : ''
                                  "
                                  :class="
                                    $vuetify.display.smAndUp
                                      ? 'text-body-2'
                                      : ''
                                  "
                                >
                                  <v-avatar
                                    size="small"
                                    color="#1867C0"
                                    class="mr-2"
                                  >
                                    <v-icon icon="mdi-cctv"> </v-icon>
                                  </v-avatar>
                                  {{ item.raw.block.name }}
                                  {{ item.raw.level.level }}
                                </span>
                              </v-col>
                            </v-row>
                            <v-row no-gutters align="center">
                              <v-col
                                cols="6"
                                md="2"
                                class="pa-2 text-capitalize white--text text"
                              >
                                <span> Total Camera:</span>
                              </v-col>
                              <v-col
                                cols="6"
                                md="10"
                                class="pa-2 text-capitalize white--text text d-flex justify-end"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="end"
                                  justify="end"
                                >
                                  <span
                                    class="d-inline-block text-truncate text-capitalize"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: .8rem'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.smAndUp
                                        ? 'text-body-2'
                                        : ''
                                    "
                                  >
                                    <v-icon
                                      icon="mdi-cctv"
                                      class="mr-2 ml-2"
                                    ></v-icon>
                                    {{ item.raw.cctvCount }} Cameras
                                  </span>
                                </v-row>
                              </v-col>
                            </v-row>
                            <v-row no-gutters align="center">
                              <v-col
                                cols="6"
                                md="2"
                                class="pa-2 text-capitalize white--text text"
                              >
                                <span> Active Camera:</span>
                              </v-col>
                              <v-col
                                cols="6"
                                md="10"
                                class="pa-2 text-capitalize white--text text d-flex justify-center"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                  justify="end"
                                >
                                  <span
                                    class="d-inline-block text-truncate text-capitalize"
                                    :style="
                                      $vuetify.display.xs
                                        ? 'font-size: .8rem'
                                        : ''
                                    "
                                    :class="
                                      $vuetify.display.smAndUp
                                        ? 'text-body-2'
                                        : ''
                                    "
                                  >
                                    <v-icon
                                      icon="mdi-cctv"
                                      class="mr-2"
                                    ></v-icon>
                                    {{ item.raw.cctvCount }} Cameras
                                  </span>
                                </v-row>
                              </v-col>
                            </v-row>
                            <v-row no-gutters align="center">
                              <v-col
                                cols="6"
                                md="2"
                                class="pa-2 text-bold text"
                              >
                                <span>Date Created:</span>
                              </v-col>
                              <v-col
                                cols="6"
                                md="10"
                                class="pa-2 text-capitalize white--text text d-flex justify-end"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize"
                                  :style="
                                    $vuetify.display.xs
                                      ? 'font-size: .8rem'
                                      : ''
                                  "
                                  :class="
                                    $vuetify.display.smAndUp
                                      ? 'text-body-2'
                                      : ''
                                  "
                                >
                                  <v-icon
                                    icon="mdi-calendar-month-outline"
                                    class="mr-2"
                                  ></v-icon>
                                  {{
                                    item.raw.createdAt
                                      ? standardFormatDateTime(
                                          item.raw.createdAt,
                                        )
                                      : "N/A"
                                  }}
                                </span>
                              </v-col>
                            </v-row>
                            <v-row no-gutters>
                              <v-col
                                cols="12"
                                class="pa-2 text-capitalize white--text d-flex align-center d-flex justify-center"
                              >
                                <v-menu location="bottom">
                                  <template #activator="{ props }">
                                    <v-btn
                                      block
                                      v-bind="props"
                                      color="primary"
                                      class="border mx-2"
                                      variant="outlined"
                                      ><v-icon class="mr-2">mdi-eye</v-icon>
                                      View
                                    </v-btn>
                                  </template>

                                  <v-card>
                                    <v-list density="compact" class="pa-0">
                                      <v-list-item
                                        v-if="$ability.can('read', 'view-cctv')"
                                        :to="{
                                          name: 'cctv-id',
                                          params: { id: item.raw._id },
                                          query: {
                                            site: mySite,
                                          },
                                        }"
                                      >
                                        <span class="text-caption">
                                          View CCTV Block
                                        </span>
                                      </v-list-item>
                                      <v-list-item
                                        @click="
                                          openDialog(
                                            'edit',
                                            item.raw._id,
                                            mySite,
                                          )
                                        "
                                      >
                                        <span class="text-caption">
                                          Edit CCTV Block
                                        </span>
                                      </v-list-item>
                                      <CctvDeleteCctvBlock
                                        :cctvBlock="item.raw"
                                      />
                                      <!-- <v-list-item
                                        v-if="
                                          $ability.can('delete', 'delete-cctv')
                                        "
                                        :to="{
                                          name: 'cctv-id-delete',
                                          params: { id: item.raw._id },
                                          query: {
                                            site: mySite,
                                          },
                                        }"
                                      >
                                        <span class="text-caption">
                                          Delete CCTV Block
                                        </span>
                                      </v-list-item> -->
                                    </v-list>
                                  </v-card>
                                </v-menu>
                              </v-col>
                            </v-row>
                          </v-list-item-title>
                        </v-list-item>
                        <v-divider
                          v-if="itemIndex + 1 !== items.length"
                        ></v-divider>
                      </template>
                    </v-list>
                  </template>

                  <template #no-data>
                    <v-row no-gutters justify="center" class="pa-16">
                      <v-col cols="12">
                        <v-row no-gutters justify="center">
                          <v-img
                            src="/empty.svg"
                            width="100px"
                            height="100px"
                          ></v-img>
                        </v-row>
                      </v-col>

                      <v-col cols="12">
                        <v-row no-gutters justify="center">
                          <span class="font-weight-bold">
                            You don't have any CCTV Blocks yet.
                          </span>
                        </v-row>
                      </v-col>
                    </v-row>
                  </template>
                </v-data-iterator>
              </v-col>
            </v-row>
          </v-col>

          <v-divider></v-divider>

          <v-col cols="12" class="pa-4">
            <v-row no-gutters justify="end" align-content="center">
              <span>{{ pageRange }}</span>
              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="canPrevPage"
                @click="
                  prevPage({
                    site: mySite,
                  })
                "
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>

              <v-btn
                density="compact"
                variant="text"
                icon
                class="mx-2"
                :disabled="!canNextPage"
                @click="
                  nextPage({
                    site: mySite,
                  })
                "
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <v-dialog
      v-model="dialog"
      transition="dialog-right-transition"
      fullscreen
      persistent
      :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
    >
      <v-card class="h-100">
        <v-toolbar>
          <span class="font-weight-bold pl-4 text-capitalize">
            {{ dialogTitle }}
          </span>

          <v-spacer></v-spacer>
          <v-btn
            size="small"
            color="grey-darken-1"
            icon="mdi-close"
            @click="dialog = false"
          ></v-btn>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text>
          <v-row class="h-100 align-center">
            <v-form
              v-model="isCctvValid"
              @submit.prevent="submit()"
              class="w-100"
              ref="createCctvBlockRef"
            >
              <v-col cols="12">
                <v-row class="justify-center mb-7">
                  <v-img
                    src="/images/undraw_current_location.svg"
                    width="190px"
                    height="190px"
                  ></v-img>
                </v-row>

                <v-responsive class="mx-auto">
                  <div class="text-subtitle-1 text-medium-emphasis">Block</div>
                  <v-autocomplete
                    v-model="filterBlocks"
                    :items="blocks"
                    item-title="name"
                    item-value="_id"
                    hide-details
                    density="comfortable"
                    :rules="[requiredInput]"
                  ></v-autocomplete>

                  <div class="text-subtitle-1 text-medium-emphasis">Level</div>
                  <v-autocomplete
                    v-model="filterLevels"
                    :items="blockLevels"
                    item-title="level"
                    item-value="_id"
                    placeholder="Select level"
                    hide-details
                    density="comfortable"
                    :rules="[requiredInput]"
                    :loading="isLevelsLoaded"
                    :disabled="isLevelsLoaded"
                  ></v-autocomplete>

                  <div class="text-subtitle-1 text-medium-emphasis">
                    Cameras
                  </div>

                  <v-row
                    v-for="(items, index) in cctvCameras"
                    class="mt-0"
                    v-if="dialogMode === 'create'"
                  >
                    <!-- <v-col
                      class="d-flex justify-center align-center pa-0 cursor-pointer"
                      cols="1"
                      >{{ index + 1 }}</v-col
                    > -->
                    <v-col
                      class="d-flex justify-center align-center pa-0"
                      cols="1"
                    >
                      <v-icon
                        size="20"
                        class="ml-3 cursor-pointer"
                        @click="
                          onOpenViewCamera(items.cameraName, items.cctvLink)
                        "
                        >mdi-eye-outline</v-icon
                      >
                    </v-col>

                    <v-col cols="4" class="px-1"
                      ><v-text-field
                        v-model="items.cameraName"
                        hide-details
                        placeholder="Camera Name"
                        class="cursor-pointer"
                        :rules="[requiredInput]"
                        @blur="validateField"
                      ></v-text-field
                    ></v-col>

                    <v-col cols="5" class="px-1"
                      ><v-text-field
                        v-model="items.cctvLink"
                        hide-details
                        placeholder="CCTV Link"
                        :rules="[requiredInput]"
                        @blur="validateField"
                      >
                      </v-text-field
                    ></v-col>

                    <v-col
                      cols="1"
                      class="d-flex align-center justify-center px-0"
                      ><v-icon
                        class="cursor-pointer px-0"
                        color="red"
                        @click="onRemoveCctvCamera(index)"
                        >mdi-delete</v-icon
                      ></v-col
                    >
                  </v-row>

                  <v-row
                    v-for="(items, index) in cctvCameras"
                    class="mt-0"
                    v-if="dialogMode === 'edit'"
                  >
                    <!-- <v-col
                      class="d-flex justify-center align-center pa-0"
                      cols="1"
                      >{{ index + 1 }}</v-col
                    > -->
                    <v-col
                      class="d-flex justify-center align-center pa-0"
                      cols="1"
                    >
                      <v-icon
                        size="20"
                        class="ml-3 cursor-pointer"
                        @click="onOpenViewCamera(items.name, items.ip)"
                        >mdi-eye-outline</v-icon
                      >
                    </v-col>
                    <v-col cols="4" class="px-1"
                      ><v-text-field
                        v-model="items.name"
                        hide-details
                        placeholder="Camera Name"
                        :rules="[requiredInput]"
                        class="cursor-pointer"
                        @blur="validateField"
                        @click="onOpenViewCamera(items.name, items.ip)"
                      ></v-text-field
                    ></v-col>

                    <v-col cols="5" class="px-1"
                      ><v-text-field
                        v-model="items.ip"
                        hide-details
                        placeholder="CCTV Link"
                        :rules="[requiredInput]"
                        @blur="validateField"
                      >
                      </v-text-field
                    ></v-col>

                    <v-col
                      cols="1"
                      class="d-flex align-center justify-center px-0"
                      ><v-btn
                        @click="onRemoveCctvCamera(index)"
                        :disabled="items.isCctvUsedInRoute"
                        block
                      >
                        <v-icon
                          class="px-0"
                          :color="items.isCctvUsedInRoute ? '' : 'red'"
                          >mdi-delete</v-icon
                        >
                      </v-btn></v-col
                    >
                  </v-row>

                  <v-row class="mt-0">
                    <v-col
                      class="d-flex justify-center align-center px-1"
                      cols="1"
                    ></v-col>
                    <v-col cols="4" class="px-1"
                      ><v-text-field
                        v-model="cctvCameraInput.cameraName"
                        hide-details
                        placeholder="Camera Name"
                      ></v-text-field
                    ></v-col>

                    <v-col cols="5" class="px-1"
                      ><v-text-field
                        v-model="cctvCameraInput.cctvLink"
                        hide-details
                        placeholder="CCTV Link"
                      >
                      </v-text-field
                    ></v-col>

                    <v-col cols="1" class="d-flex align-center justify-center"
                      ><v-icon
                        color="light-blue-darken-3"
                        class="cursor-pointer"
                        @click="onAddCctvCamera(cctvCameraInput, dialogMode)"
                        >mdi-plus-box</v-icon
                      ></v-col
                    >
                  </v-row>

                  <v-btn
                    color="#1867C0"
                    type="submit"
                    class="py-4 w-100 rounded-lg mt-4"
                    height="52px"
                    :disabled="
                      !filterBlocks || !filterLevels || cctvCameras.length < 1
                    "
                  >
                    {{ dialogButtonText }}
                  </v-btn>
                </v-responsive>
              </v-col>
            </v-form>
          </v-row>
        </v-card-text>

        <v-card-actions v-if="$vuetify.display.smAndDown">
          <v-spacer></v-spacer>
          <span class="text-caption"> @ 2024 by Seven 365 Pte Ltd V1.0 </span>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="isCameraDialogOpen"
      transition="dialog-bottom-transition"
      max-width="900"
    >
      <v-card>
        <v-toolbar color="white">
          <div class="font-weight-bold pl-4 pt-1 text-capitalize">
            {{ cameraName }}
          </div>
        </v-toolbar>
        <v-card-text class="text-center">
          <!-- v-if="selectCctvLiveFeed.ip" -->
          <iframe
            :src="cameraLink"
            :style="{
              width: '100%',
              height: $vuetify.display.mdAndUp ? '500px' : '200px',
            }"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";
definePageMeta({
  middleware: "secure",
});
const { $ability } = useNuxtApp();
const { setSnackbar } = useLocal();
const { requiredInput } = useUtils();
const { standardFormatDateTime } = useUtils();
const { blockLevels, setBlockLevels } = useBlockLevel();
const { blocks, setBlocks } = useBlock();
const { currentUser } = useLocalAuth();
const {
  setCctvs,
  cctvs,
  pageRange,
  canNextPage,
  canPrevPage,
  nextPage,
  prevPage,
  isCctvsLoaded,
  filterBlocks,
  filterLevels,
  isCctvValid,
  addCCTVBlock,
  updateCctvBlock,
  cctvCameraInput,
  cctvCameras,
  getCctvBlockById,
  page,
  upload,
} = useCCTV();
const { getSitesOptionsForFiltering, mySite } = useFilter();
const { standardFormatDateYearMonthDay } = useUtils();
const { setOnGoingPatrol } = usePatrolLog();

const dialog = ref(false);
const search = ref("");
const dialogMode = ref<"create" | "edit">("create");
const currentItemId = ref<string | null>(null);

const createCctvBlockRef = ref(null);
const startDateDialog = ref(false);
const startDate = ref<Date | null>(null);
const locale = "en";
const filters = ref({
  from: "",
});
const uploader = ref();
const isUploading = ref(false);
const files = ref<File[]>([]);
const file = ref<TFile[]>([]);
const isCameraDialogOpen = ref(false);
const cameraName = ref("");
const cameraLink = ref("");

function onOpenViewCamera(camName: string, camLink: string) {
  cameraName.value = camName;
  cameraLink.value = camLink;
  isCameraDialogOpen.value = true;
}

isCameraDialogOpen;

async function onFileSelect() {
  try {
    isUploading.value = true;
    if (files.value.length > 0) {
      files.value.forEach((_file) => {
        file.value.push({
          name: _file.name,
          data: _file,
          progress: 0,
        });
      });

      for (let i = 0; i < file.value.length; i++) {
        const formData = new FormData();
        formData.append("file", file.value[i].data);
        formData.append("site", mySite.value);
        await upload(formData);
        setCctvs({
          site: mySite.value,
        }),
          (files.value = []);
        file.value = [];
      }
    }
    isUploading.value = false;
  } catch (error) {
    await setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}

const updateStartDate = (date: Date | null) => {
  startDate.value = date;
};
const applyStartDate = () => {
  if (startDate.value) {
    filters.value.from = standardFormatDateYearMonthDay(startDate.value);
  } else {
    filters.value.from = "";
  }
  startDateDialog.value = false;
  onFilterTable();
};
watch(startDate, (newVal) => {
  if (newVal) {
    applyStartDate();
  }
});
watch(() => filters.value.from, onFilterTable);

function validateField() {
  createCctvBlockRef?.value?.validate();
}

const isSubmitDisabled = computed(() => {
  const hasEmptyFields = cctvCameras.value.some(
    (camera) =>
      (dialogMode.value === "create" &&
        (!camera.cameraName || !camera.cctvLink)) ||
      (dialogMode.value === "edit" && (!camera.name || !camera.ip)),
  );

  return dialogMode.value === "create"
    ? cctvCameras.value.length === 0 || hasEmptyFields
    : hasEmptyFields;
});

function onAddCctvCamera(
  input: { cameraName: string; cctvLink: string },
  mode?: string,
) {
  if (!input.cameraName || !input.cctvLink) {
    return;
  }

  if (mode === "edit") {
    cctvCameras.value.push({
      name: cctvCameraInput.value.cameraName,
      ip: cctvCameraInput.value.cctvLink,
      cctvBlock: currentItemId.value,
    });

    cctvCameraInput.value = {
      cameraName: "",
      cctvLink: "",
    };

    return;
  }

  cctvCameras.value.push(input);

  cctvCameraInput.value = {
    cameraName: "",
    cctvLink: "",
  };
}

function onRemoveCctvCamera(index: number) {
  cctvCameras.value.splice(index, 1);
}

watch(
  cctvCameras,
  (newValue) => {
    isCctvValid.value = newValue.every(
      (item) => item.cameraName && item.cctvLink,
    );
  },
  { deep: true },
);

function onSearchTable(val: string) {
  debouncedSearch(val);
}

const debouncedSearch = debounce(async (value: string) => {
  await setCctvs({
    searchVal: search.value,
    pageVal: page.value,
    site: mySite.value,
    date: filters.value.from,
  });
}, 500);

async function onFilterTable() {
  await Promise.all([
    setCctvs({
      searchVal: search.value,
      pageVal: page.value,
      site: mySite.value,
      date: filters.value.from,
    }),
    setBlocks({
      site: mySite.value,
    }),
  ]);
}

watch(
  filterBlocks,
  (newValue) => {
    setBlockLevels({
      block: newValue,
      organization: ["organization", "site", "service-provider"].includes(
        currentUser.value.type,
      )
        ? currentUser.value.organization
        : useRoute().query.organization
          ? String(useRoute().query.organization)
          : undefined,
    });
    filterLevels.value = "";
  },
  { deep: true },
);

onMounted(async () => {
  clearForm();
  await getSitesOpt();
  await Promise.all([
    setCctvs({
      site: mySite.value,
    }),
    setBlocks({
      site: mySite.value,
    }),
  ]);

  const isPatrolling = await setOnGoingPatrol({ site: mySite.value });

  if (isPatrolling.length > 0) {
    setSnackbar({
      text: "Virtual Patrolling is currently ongoing.",
      type: "info",
      modal: true,
    });
  }
});

async function getSitesOpt() {
  try {
    isCctvsLoaded.value = true;
    await getSitesOptionsForFiltering();
  } catch (error: any) {
    setSnackbar({ text: error.message || error, modal: true, type: "error" });
  } finally {
    isCctvsLoaded.value = false;
  }
}

function clearForm() {
  filterBlocks.value = "";
  filterLevels.value = "";
  cctvCameras.value = [];
  // mySite.value = "";
}

watch(blockLevels, (newVal) => {
  if (newVal && newVal.length) {
    filterLevels.value = newVal[0]._id;
  }
});

async function openDialog(
  mode: "create" | "edit",
  itemId: string | null = null,
  site?: string,
) {
  dialogMode.value = mode;
  currentItemId.value = itemId;
  dialog.value = true;

  if (mode === "edit" && itemId) {
    try {
      const res: any = await getCctvBlockById(itemId, site);
      console.log(res);

      blockLevels.value = [{ _id: res.level, level: res.levelName }];
      filterLevels.value = res.level;
      filterBlocks.value = res.block;

      cctvCameras.value = res.cctvItems;
    } catch (error: any) {
      setSnackbar({ text: error.message || error, modal: true, type: "error" });
    }
  } else {
    clearForm();
    dialog.value = true;
  }
}

const dialogTitle = computed(() => {
  return dialogMode.value === "create" ? "Add CCTV Block" : "Edit CCTV Block";
});

const dialogButtonText = computed(() => {
  return dialogMode.value === "create" ? "Create CCTV Block" : "Save Changes";
});

async function submit() {
  if (
    !filterBlocks.value ||
    !filterLevels.value ||
    cctvCameras.value.length < 1 ||
    cctvCameras.value.some((camera) => {
      if (dialogMode.value === "create") {
        return !camera.cameraName || !camera.cctvLink;
      } else if (dialogMode.value === "edit") {
        return !camera.name || !camera.ip;
      }
      return false;
    })
  ) {
    console.log("Submit?");
    validateField();

    return;
  }

  try {
    if (dialogMode.value === "create") {
      const result = await addCCTVBlock({
        site: mySite.value,
        block: filterBlocks.value,
        level: filterLevels.value,
        cctvCameras: cctvCameras.value,
      });
      clearForm();
      setSnackbar({
        text: "Successfully created CCTV Block",
        modal: true,
        type: "success",
      });
      dialog.value = false;
      useRouter().push({
        name: "cctv-id",
        params: {
          id: result.value._id,
        },
        query: {
          site: mySite.value,
        },
      });
    } else if (dialogMode.value === "edit") {
      cctvCameras.value.forEach((item) => delete item.isCctvUsedInRoute);
      if (currentItemId.value) {
        await updateCctvBlock(
          currentItemId.value,
          filterBlocks.value,
          filterLevels.value,
          cctvCameras.value,
        );
        clearForm();
        setSnackbar({
          text: "Successfully updated CCTV Block",
          modal: true,
          type: "success",
        });
        dialog.value = false;
        await onFilterTable();
      }
    }
  } catch (error: any) {
    setSnackbar({ text: error.message || error, modal: true, type: "error" });
  }
}
</script>

<style scoped>
.text {
  text-align: start;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
}

.rows-per-page :deep() .v-field__outline {
  --v-field-border-width: 0;
  --v-field-border-opacity: 0;
  border-bottom: 0.1px solid;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  width: 50px;
  margin-left: 16px;
}

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

:deep() .v-switch .v-label {
  padding-right: 10px;
  font-size: 13px;
}

:deep() .v-switch .v-selection-control {
  display: flex;
  flex-direction: row-reverse;
}

:deep() .v-text-field input {
  font-size: 13px !important;
}

:deep() .v-textarea .v-field__input {
  font-size: 13px !important;
}
</style>
