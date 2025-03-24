<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card
        width="100%"
        elevation="3"
        height="100%"
        :loading="isBlocksLoaded"
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
            <v-row>
              <v-col cols="12">
                <v-data-iterator :items="blocks" :items-per-page="itemsPerPage">
                  <template v-slot:header>
                    <v-row no-gutters class="pa-4">
                      <v-col cols="12" md="5">
                        <v-row no-gutters align="center">
                          <v-col
                            cols="12"
                            :md="
                              ['organization', 'service-provider'].includes(
                                currentUser.type,
                              )
                                ? '12'
                                : '12'
                            "
                            :class="{
                              'pb-2': !$vuetify.display.mdAndUp,
                              'pr-0': $vuetify.display.mdAndUp,
                            }"
                            :style="
                              ['organization', 'service-provider'].includes(
                                currentUser.type,
                              )
                                ? 'margin-bottom: 5px'
                                : ''
                            "
                          >
                            <v-row no-gutter>
                              <v-col
                                cols="12"
                                md="3"
                                class="d-flex align-center mr-6"
                              >
                                <span class="font-weight-bold">
                                  Building Management
                                </span>
                              </v-col>
                              <v-col cols="12" md="8">
                                <v-text-field
                                  v-model="search"
                                  placeholder="Search name, id"
                                  hide-details
                                  density="compact"
                                  append-inner-icon="mdi-magnify"
                                  @update:modelValue="onSearch"
                                >
                                </v-text-field>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col
                        cols="12"
                        md="7"
                        v-if="$ability.can('create', 'create-buildings')"
                      >
                        <v-row
                          no-gutter
                          :justify="
                            ['organization', 'service-provider'].includes(
                              currentUser.type,
                            )
                              ? 'start'
                              : 'end'
                          "
                        >
                          <v-col
                            cols="12"
                            :sm="
                              ['organization', 'service-provider'].includes(
                                currentUser.type,
                              )
                                ? 4
                                : 0
                            "
                            v-if="
                              ['organization', 'service-provider'].includes(
                                currentUser.type,
                              )
                            "
                          >
                            <v-select
                              v-model="filterBySite"
                              :items="sites"
                              label="Select Site"
                              item-title="name"
                              item-value="_id"
                              hide-details
                              clearable
                              density="compact"
                              menu-icon="mdi-chevron-down"
                            ></v-select>
                          </v-col>
                          <v-col
                            cols="12"
                            md="4"
                            :sm="
                              ['organization', 'service-provider'].includes(
                                currentUser.type,
                              )
                                ? 4
                                : 6
                            "
                            :class="{
                              'pb-0': !$vuetify.display.mdAndUp,
                              'pr-0': $vuetify.display.mdAndUp,
                            }"
                          >
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
                              Upload Blocks
                            </v-btn>
                          </v-col>

                          <v-col
                            cols="12"
                            md="4"
                            :sm="
                              ['organization', 'service-provider'].includes(
                                currentUser.type,
                              )
                                ? 4
                                : 6
                            "
                          >
                            <v-btn
                              color="blue-darken-3"
                              block
                              variant="flat"
                              size="small"
                              style="height: 40px"
                              @click="dialog = !dialog"
                            >
                              <v-icon class="mr-1"> mdi-plus </v-icon>
                              Add Block
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>

                    <v-divider />

                    <v-list
                      class="pa-0"
                      density="compact"
                      v-if="$vuetify.display.smAndUp"
                    >
                      <v-list-item class="px-8">
                        <v-list-item-title>
                          <v-row no-gutters>
                            <v-col cols="12" md="4">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Block / Level / Unit
                                </span>
                              </v-row>
                            </v-col>

                            <!-- <v-col cols="12" sm="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Levels
                                </span>
                              </v-row>
                            </v-col> -->

                            <v-col cols="12" sm="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Date Created
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" md="2" sm="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Date Updated
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
                        <v-list-item class="py-4 px-8">
                          <v-list-item-title>
                            <v-row no-gutters align="center">
                              <v-col
                                cols="24"
                                md="4"
                                class="text-capitalize text-truncate"
                              >
                                <v-row
                                  no-gutters
                                  align="center"
                                  class="text-truncate"
                                >
                                  <span class="text-truncate">
                                    <v-icon color="primary" class="mr-1">
                                      mdi-selection-multiple-marker
                                    </v-icon>
                                    <span
                                      class="text-truncate text-capitalize text-body-2"
                                    >
                                      {{ item.raw.name }}
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>

                              <!-- <v-col
                                cols="12"
                                sm="3"
                                class="text-capitalize text-truncate"
                              >
                                <v-row no-gutters align="center">
                                  <v-icon color="green" class="mr-1">
                                    mdi-layers-triple-outline
                                  </v-icon>
                                  <span
                                    class="d-inline-block text-truncate text-capitalize text-body-2"
                                  >
                                    {{ item.raw._levels }}
                                    <span class="ml-1">Levels</span>
                                  </span>
                                </v-row>
                              </v-col> -->

                              <v-col
                                cols="12"
                                sm="3"
                                class="text text-capitalize"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  <v-icon class="mr-1"
                                    >mdi-calendar-check</v-icon
                                  >
                                  <span
                                    class="d-inline-block text-truncate text-capitalize text-body-2"
                                  >
                                    {{ standardFormatDate(item.raw.createdAt) }}
                                  </span>
                                </v-row>
                              </v-col>
                              <v-col
                                cols="12"
                                sm="3"
                                class="text text-capitalize"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  <v-icon class="mr-1"
                                    >mdi-calendar-refresh</v-icon
                                  >
                                  <span
                                    class="d-inline-block text-truncate text-capitalize text-body-2"
                                  >
                                    {{ standardFormatDate(item.raw.updatedAt) }}
                                  </span>
                                </v-row>
                              </v-col>

                              <div class="position-absolute right-0 top-0 mt-3">
                                <v-menu>
                                  <template v-slot:activator="{ props }">
                                    <v-btn
                                      v-bind="props"
                                      icon
                                      flat
                                      size="x-small"
                                      style="position: absolute; right: 30px"
                                    >
                                      <v-icon class="pa-4 rounded-xl border-md"
                                        >mdi-dots-vertical</v-icon
                                      >
                                    </v-btn>
                                  </template>
                                  <v-list>
                                    <template
                                      v-for="(
                                        actionItem, actionIndex
                                      ) in actions"
                                      :key="actionItem.text"
                                    >
                                      <template v-if="actionItem.isLink">
                                        <v-list-item
                                          v-if="actionItem.visible"
                                          :to="{
                                            name: actionItem.to,
                                            params: {
                                              block: item.raw._id,
                                            },
                                            query: { site: mySite },
                                          }"
                                        >
                                          <template #title>
                                            <span class="text-caption">
                                              {{ actionItem.text }}
                                            </span>
                                          </template>
                                        </v-list-item>
                                      </template>

                                      <template v-else>
                                        <v-list-item
                                          v-if="actionItem.visible"
                                          @click="
                                            actionItem.dialogData.action(
                                              item.raw,
                                            )
                                          "
                                        >
                                          <template #title>
                                            <span class="text-caption">
                                              {{ actionItem.text }}
                                            </span>
                                          </template>
                                        </v-list-item>
                                      </template>

                                      <v-divider
                                        v-if="
                                          actionIndex + 1 !== actions.length
                                        "
                                      ></v-divider>
                                    </template>
                                  </v-list>
                                </v-menu>
                              </div>
                            </v-row>
                          </v-list-item-title>
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
                        <v-list-item class="py-4 px-8">
                          <v-list-item-title>
                            <v-row no-gutters>
                              <v-col
                                cols="12"
                                md="4"
                                :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height text-truncate"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.smAndDown
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >Block:
                                  </span>
                                  <span
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon class="mr-1 mb-1" color="primary">
                                      mdi-selection-multiple-marker
                                    </v-icon>
                                    {{ item.raw.name }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                md="4"
                                :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height text-truncate"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.smAndDown
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >Levels:
                                  </span>
                                  <span
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon class="mr-1 mb-1" color="green">
                                      mdi-layers-triple-outline
                                    </v-icon>
                                    {{ item.raw._levels }} Levels
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                md="4"
                                :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height text-truncate"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.smAndDown
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >Created at:
                                  </span>
                                  <span
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon class="mr-1 mb-1">
                                      mdi-calendar-check
                                    </v-icon>
                                    {{ standardFormatDate(item.raw.createdAt) }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                md="4"
                                :class="`text-capitalize white--text text ${$vuetify.display.smAndDown && 'mb-2'}`"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height text-truncate"
                                  align-content="center"
                                  align="center"
                                  :justify="
                                    $vuetify.display.smAndDown
                                      ? 'space-between'
                                      : 'start'
                                  "
                                >
                                  <span
                                    class="mr-2 d-flex d-md-none font-weight-bold"
                                    >Updated at:
                                  </span>
                                  <span
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon class="mr-1 mb-1">
                                      mdi-calendar-check
                                    </v-icon>
                                    {{ standardFormatDate(item.raw.updatedAt) }}
                                  </span>
                                </v-row>
                              </v-col>
                            </v-row>

                            <v-row no-gutters>
                              <v-col
                                cols="6"
                                md="2"
                                class="text-capitalize white--text text font-weight-bold"
                              >
                                <span></span>
                              </v-col>
                              <v-col
                                cols="6"
                                md="10"
                                class="text-capitalize white--text d-flex align-center d-flex justify-center"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  justify="end"
                                  align-content="center"
                                >
                                  <v-menu>
                                    <template v-slot:activator="{ props }">
                                      <v-icon
                                        v-bind="props"
                                        class="pa-4 rounded-xl border-md"
                                        density="compact"
                                        >mdi-dots-vertical</v-icon
                                      >
                                    </template>
                                    <v-list>
                                      <template
                                        v-for="(
                                          actionItem, actionIndex
                                        ) in actions"
                                        :key="actionItem.text"
                                      >
                                        <template v-if="actionItem.isLink">
                                          <v-list-item
                                            v-if="actionItem.visible"
                                            :to="{
                                              name: actionItem.to,
                                              params: {
                                                block: item.raw._id,
                                              },
                                              query: { site: mySite },
                                            }"
                                          >
                                            <template #title>
                                              <span class="text-caption">
                                                {{ actionItem.text }}
                                              </span>
                                            </template>
                                          </v-list-item>
                                        </template>

                                        <template v-else>
                                          <v-list-item
                                            v-if="actionItem.visible"
                                            @click="
                                              actionItem.dialogData.action(
                                                item.raw,
                                              )
                                            "
                                          >
                                            <template #title>
                                              <span class="text-caption">
                                                {{ actionItem.text }}
                                              </span>
                                            </template>
                                          </v-list-item>
                                        </template>

                                        <v-divider
                                          v-if="
                                            actionIndex + 1 !== actions.length
                                          "
                                        ></v-divider>
                                      </template>
                                    </v-list>
                                  </v-menu>
                                </v-row>
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
                            src="/images/empty-building-management-list.svg"
                            width="150px"
                            height="150px"
                          ></v-img>
                        </v-row>
                      </v-col>

                      <v-col cols="12" class="mt-10">
                        <v-row no-gutters justify="center">
                          <span class="font-weight-bold text-h5"> Blocks </span>
                        </v-row>
                      </v-col>

                      <v-col cols="12">
                        <v-row no-gutters justify="center">
                          <span class="caption text-disabled">
                            You don't have list of blocks yet.
                          </span>
                        </v-row>
                      </v-col>

                      <v-col
                        cols="12"
                        md="4"
                        class="mt-10"
                        v-if="$ability.can('create', 'create-buildings')"
                      >
                        <v-row no-gutters justify="center">
                          <v-col class="text-center pb-2" cols="12">
                            <v-btn
                              variant="outlined"
                              style="height: 40px"
                              @click="uploader.click()"
                              :disabled="currentUser.type == 'organization'"
                              prepend-icon="mdi-file-upload-outline"
                            >
                              <v-file-input
                                v-model="files"
                                ref="uploader"
                                class="d-none"
                                @change="onFileSelect"
                              ></v-file-input>
                              Upload Block List
                            </v-btn>
                          </v-col>

                          <v-spacer></v-spacer>
                          <v-col class="text-center" cols="12">
                            <v-btn
                              color="blue-darken-3"
                              variant="flat"
                              style="height: 40px"
                              @click="dialog = !dialog"
                            >
                              Add New Block
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </template>
                </v-data-iterator>
              </v-col>
            </v-row>
          </v-col>

          <v-divider></v-divider>

          <v-col cols="12" class="pa-4" v-if="blocks.length">
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
                    organization: currentUser.organization,
                    site: !['site', 'service-provider'].includes(
                      currentUser.type,
                    )
                      ? filterBySite
                      : mySite,
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
                    organization: currentUser.organization,
                    site: !['site', 'service-provider'].includes(
                      currentUser.type,
                    )
                      ? filterBySite
                      : mySite,
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
      <v-card class="px-3 h-100">
        <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
          <span class="font-weight-bold pl-4 pt-1 text-capitalize">
            {{
              !showView &&
              !showUpdate &&
              !showDelete &&
              !showUpdated &&
              !showDeleted
                ? "Add"
                : showView
                  ? "View"
                  : showUpdate || showUpdated
                    ? "Update"
                    : "Delete"
            }}
            Block
          </span>

          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            icon="mdi-close"
            @click="closeDialog()"
          ></v-btn>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text>
          <v-row class="h-100 align-center">
            <v-form
              v-model="isBlockValid"
              @submit.prevent="
                !showUpdate && !showDelete
                  ? submit()
                  : showUpdate
                    ? updateBlockName()
                    : deleteBlock()
              "
              class="w-100"
            >
              <v-col cols="12">
                <v-row class="justify-center mb-7">
                  <v-img
                    src="/images/undraw_location_tracking_re_n3ok (1) 1.svg"
                    width="190px"
                    height="190px"
                  ></v-img>
                </v-row>

                <v-responsive class="mx-auto">
                  <v-col cols="12" class="font-weight-bold text-h5 mb-3">
                    <v-row
                      no-gutters
                      :justify="
                        !showConfirmationAdded &&
                        !showDelete &&
                        !showUpdated &&
                        !showDeleted
                          ? ''
                          : 'center'
                      "
                    >
                      {{
                        `${
                          !showConfirmationAdded &&
                          !showDelete &&
                          !showUpdated &&
                          !showDeleted
                            ? `Block ${!showView ? "" : "Information"}`
                            : showConfirmationAdded || showUpdated
                              ? "Great!"
                              : block.name
                        }`
                      }}
                    </v-row>
                    <v-divider class="mt-2" />
                  </v-col>
                  <div class="text-disabled mb-1 text-center">
                    {{
                      showView ||
                      (!showConfirmationAdded &&
                        !showDelete &&
                        !showUpdated &&
                        !showDeleted)
                        ? ""
                        : !showDelete && !showUpdated && !showDeleted
                          ? "You added a new block."
                          : !showUpdated && !showDeleted
                            ? "Are you sure you want to delete this block?"
                            : !showUpdated
                              ? "You deleted this block."
                              : "You updated the block name"
                    }}
                  </div>

                  <v-col
                    cols="12"
                    v-if="
                      !showView &&
                      !showConfirmationAdded &&
                      !showDelete &&
                      !showUpdated &&
                      !showDeleted
                    "
                  >
                    <v-text-field
                      v-model="block.name"
                      density="comfortable"
                      hint=""
                      label="BLK name"
                      placeholder="eg: block 1 west wing"
                      :rules="[requiredInput]"
                      :persistent-hint="false"
                      clearable
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" v-if="showView">
                    <v-row no-gutters justify="center" align="center">
                      <v-col cols="12">
                        Block:
                        <v-icon class="mr-2 ml-2" color="primary">
                          mdi-selection-multiple-marker
                        </v-icon>

                        <span class="mt-1">
                          {{ block.name }}
                        </span>
                      </v-col>
                      <v-col cols="12" class="mt-6">
                        Levels:
                        <v-icon class="mr-2 ml-2" color="green">
                          mdi-layers-triple-outline
                        </v-icon>
                        <span class="mt-1"> {{ block._levels }} Levels </span>
                      </v-col>
                      <v-col cols="12" class="mt-6">
                        Created:
                        <v-icon class="ml-2"> mdi-calendar-check </v-icon>
                        {{ standardFormatDate(block.createdAt) }}
                      </v-col>
                      <v-col cols="12" class="mt-6">
                        Updated:
                        <v-icon class="ml-1"> mdi-calendar-refresh </v-icon>
                        {{ standardFormatDate(block.updatedAt) }}
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col cols="12" class="mt-5">
                    <v-row no-gutters justify="center">
                      <v-col
                        cols="12"
                        lg="12"
                        :class="$vuetify.display.mdAndDown ? 'mr-0' : 'mb-2'"
                      >
                        <v-btn
                          variant="outlined"
                          class="py-4 w-100 rounded-lg"
                          height="52px"
                          @click="closeDialog()"
                          v-if="
                            showView ||
                            showConfirmationAdded ||
                            showDelete ||
                            showUpdated ||
                            showDeleted
                          "
                        >
                          {{
                            !showDelete ||
                            showUpdated ||
                            showDeleted ||
                            showView
                              ? "Close"
                              : "No"
                          }}
                        </v-btn>
                      </v-col>
                      <v-col
                        v-if="!showUpdated && !showDeleted && !showView"
                        :cols="
                          !showConfirmationAdded && !showDelete
                            ? '12'
                            : $vuetify.display.mdAndDown
                              ? '12'
                              : '12'
                        "
                        class="d-flex flex-column"
                        :class="$vuetify.display.mdAndDown ? 'pt-2' : ''"
                      >
                        <v-btn
                          color="#1867C0"
                          :disabled="!showDelete ? !isBlockValid : false"
                          type="submit"
                          class="py-4 w-100 rounded-lg"
                          height="52px"
                          v-if="!showConfirmationAdded"
                        >
                          {{
                            !showUpdate && !showDelete
                              ? "Add Block"
                              : showUpdate
                                ? "Update Block"
                                : "Yes"
                          }}
                        </v-btn>
                        <v-btn
                          color="#1867C0"
                          class="py-4 w-100 rounded-lg"
                          height="52px"
                          :disabled="!showConfirmationAdded"
                          @click="
                            showConfirmationAdded = !showConfirmationAdded
                          "
                          v-if="showConfirmationAdded"
                        >
                          <v-icon class="mr-1"> mdi-plus </v-icon>
                          Another Block
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-responsive>
              </v-col>
            </v-form>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <span :class="`${$vuetify.display.mdAndUp && 'pl-4'} text-caption`">
            @ 2024 by Seven 365 Pte Ltd V1.0
          </span>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";
const { $ability } = useNuxtApp();

definePageMeta({
  middleware: "secure",
});

const dialog = ref(false);

const showView = ref(false);

const showConfirmationAdded = ref(false);

const showUpdate = ref(false);

const showUpdated = ref(false);

const showDelete = ref(false);

const showDeleted = ref(false);

const uploader = ref();

const isUploading = ref(false);

const { theme, setSnackbar } = useLocal();
const { requiredInput, standardFormatDate } = useUtils();

const {
  isBlocksLoaded,
  isBlockValid,
  setBlock,
  setBlocks,
  search,
  block,
  blocks,
  addBlock,
  updateBlockNameById,
  deleteBlockbyId,
  itemsPerPage,
  pageRange,
  canNextPage,
  nextPage,
  canPrevPage,
  prevPage,
  filterBySite,
  upload,
} = useBlock();

const { sites, setSites } = useSite();

const { currentUser } = useLocalAuth();
const { spTypes, userTypes } = useLocalRoute();
const route = useRoute();
const { getSitesOptionsForFiltering, siteOptions, filterSite, mySite } =
  useFilter();

watch(
  filterBySite,
  (newValue) => {
    setBlocks({
      organization: currentUser.value.organization ?? "",
      site: newValue,
    });
  },
  { deep: true },
);

onMounted(async () => {
  setBlock();
  blocks.value = [];
  const collabSite = await getSitesOptionsForFiltering();
  if (route.query.site) {
    filterBySite.value = route.query.site;
  }

  if (currentUser.value.type.toLowerCase() == "organization") {
    setSites(currentUser.value.organization);
  }

  if (currentUser.value.type.toLowerCase() == "service-provider") {
    sites.value = collabSite;
  }

  setBlocks({
    organization: currentUser.value.organization ?? "",
    site: filterBySite.value || mySite.value,
  });
});

type TFile = {
  name: string;
  data: File;
  progress: number;
  id?: string;
};

const files = ref<File[]>([]);
const file = ref<TFile[]>([]);

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
        formData.append("site", filterBySite.value || mySite.value);
        await upload(formData);
        await setBlocks({
          organization: currentUser.value.organization,
          site: filterBySite.value || mySite.value,
        });

        files.value = [];
        file.value = [];
      }
    }
    isUploading.value = false;
  } catch (error) {
    await setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}

const actions = computed(() => {
  return [
    {
      text: "View",
      value: "View",
      isLink: false,
      class: "text-center",
      dialogData: {
        action: async (data: any) => {
          viewBlockByDialog(data);
        },
      },
      visible: $ability.can("read", "view-buildings"),
    },
    {
      text: "Edit Block",
      value: "Edit Block",
      isLink: false,
      class: "text-center",
      dialogData: {
        action: async (data: any) => {
          editBlockByDialog(data);
        },
      },
      visible: $ability.can("update", "edit-buildings"),
    },
    {
      text: "View Levels",
      isLink: true,
      class: "text-center",
      to: "building-blocks-block-levels",
      visible: $ability.can("read", "view-buildings"),
    },
    {
      text: "Delete",
      value: "Delete Block",
      isLink: false,
      class: "text-center",
      dialogData: {
        action: async (data: any) => {
          deleteBlockByDialog(data);
        },
      },
      visible: $ability.can("delete", "delete-buildings"),
    },
  ];
});

function onSearch(val: string) {
  debouncedSearch(val);
}
const debouncedSearch = debounce(async (value: string) => {
  search.value = value;
  await setBlocks({
    organization: currentUser.value.organization,
    site: filterBySite.value || mySite.value,
  });
}, 500);

function viewBlockByDialog(blk: TBlock) {
  block.value = blk;
  dialog.value = true;
  showView.value = true;
}

function editBlockByDialog(blk: TBlock) {
  let data = JSON.stringify(blk);
  block.value = JSON.parse(data);
  dialog.value = true;
  showUpdate.value = true;
}

function deleteBlockByDialog(blk: TBlock) {
  block.value = blk;
  dialog.value = true;
  showDelete.value = true;
}

function closeDialog() {
  setBlock();
  dialog.value = false;
  showView.value = false;
  showUpdate.value = false;
  showUpdated.value = false;
  showDelete.value = false;
  showDeleted.value = false;
  showConfirmationAdded.value = false;
}

async function submit() {
  try {
    const item = await addBlock({
      name: block.value.name,
      organization: currentUser.value.organization,
      site: filterBySite.value || mySite.value,
    });

    if (item.status === "error") {
      return setSnackbar({
        text: item.message as string,
        modal: true,
        type: "warning",
      });
    }
    await setBlocks({
      organization: currentUser.value.organization,
      site: filterBySite.value || mySite.value,
    });
    await setBlock();
    showConfirmationAdded.value = true;
  } catch (error) {
    await setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}

async function updateBlockName() {
  try {
    await updateBlockNameById({
      _id: block.value._id as string,
      name: block.value.name as string,
    });
    await setBlocks({
      organization: currentUser.value.organization,
      site: filterBySite.value || mySite.value,
    });
    showUpdated.value = true;
  } catch (error) {
    await setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}

async function deleteBlock() {
  try {
    await deleteBlockbyId(block.value._id as string);
    await setBlocks({
      organization: currentUser.value.organization,
      site: filterBySite.value || mySite.value,
    });
    showDeleted.value = true;
  } catch (error) {
    await setSnackbar({ text: error as string, modal: true, type: "error" });
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
