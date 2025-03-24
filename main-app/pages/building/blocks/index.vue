<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card width="100%" elevation="3" height="100%" :loading="isUnitsLoaded">
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
                <v-data-iterator :items="units" :items-per-page="itemsPerPage">
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
                              @click="
                                showAddLocationDialog = !showAddLocationDialog;
                                clearForm();
                              "
                            >
                              <v-icon class="mr-1"> mdi-plus </v-icon>
                              Add Location
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>

                    <v-divider />

                    <v-list
                      class="pa-0"
                      density="compact"
                      v-if="$vuetify.display.mdAndUp"
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

                            <v-col cols="12" md="2">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Unit Owner
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" md="2">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Contact Number
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" md="2">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Category
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" md="2">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Resident/Tenant
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
                    v-if="$vuetify.display.mdAndUp"
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
                              <v-col cols="12" md="4" class="text-capitalize">
                                <v-row no-gutters align="center">
                                  <span class="mr-2">
                                    <v-icon color="primary" class="mr-4">
                                      mdi-home-map-marker
                                    </v-icon>
                                    <span
                                      class="text-capitalize text-body-2"
                                      style="
                                        word-break: break-word;
                                        white-space: normal;
                                      "
                                    >
                                      {{
                                        `${item.raw.block.name} / ${item.raw.level.level} / ${item.raw.name}`
                                      }}
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col cols="12" md="2" class="text-capitalize">
                                <v-row no-gutters align="center">
                                  <span class="mr-2" v-if="item.raw.unit_owner">
                                    <v-icon class="mr-4">
                                      mdi-home-account
                                    </v-icon>
                                    <span
                                      class="text-capitalize text-body-2"
                                      style="
                                        word-break: break-word;
                                        white-space: normal;
                                      "
                                    >
                                      {{
                                        `${item.raw.unit_owner.givenName} ${item.raw.unit_owner.surname}`
                                      }}
                                    </span>
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="2"
                                class="text text-capitalize"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  <span
                                    class="d-inline-block text-truncate text-capitalize text-body-2"
                                  >
                                    {{ item?.raw?.unit_owner?.primaryPhone }}
                                  </span>
                                </v-row>
                              </v-col>
                              <v-col
                                cols="12"
                                sm="2"
                                class="text text-capitalize"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  <span
                                    class="d-inline-block text-truncate text-capitalize text-body-2"
                                  >
                                    {{ item.raw.category }}
                                  </span>
                                </v-row>
                              </v-col>
                              <v-col
                                cols="12"
                                sm="2"
                                class="text text-capitalize"
                              >
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                >
                                  <span
                                    class="d-inline-block text-truncate text-capitalize text-body-2"
                                  >
                                    <span
                                      v-if="
                                        item.raw.residents &&
                                        item.raw.residents.length
                                      "
                                      >{{
                                        `(${item.raw.residents.length}) Resident`
                                      }}</span
                                    >
                                    <!-- <span
                                      v-if="
                                        item.raw.unitOwners.length &&
                                        item.raw.tenants.length
                                      "
                                      >,
                                    </span>
                                    <span v-if="item.raw.tenants.length"
                                      >{{
                                        `(${item.raw.tenants.length})`
                                      }}
                                      Tenant</span
                                    > -->
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
                                      <v-icon class=""
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
                                              block: item.raw.block._id,
                                              level: item.raw.level._id,
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
                              <v-col cols="12">
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
                                        class="mb-4 rounded-xl"
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
                                                block: item.raw.block._id,
                                                level: item.raw.level._id,
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

                              <v-col
                                cols="12"
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
                                    >Block / Level / Unit:
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
                                      mdi-home-map-marker
                                    </v-icon>
                                    {{
                                      `${item.raw.block.name} / ${item.raw.level.level} / ${item.raw.name}`
                                    }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
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
                                    >Unit Owner:
                                  </span>
                                  <span
                                    v-if="item.raw.unit_owner"
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon class="mr-1 mb-1">
                                      mdi-home-account
                                    </v-icon>
                                    {{
                                      `${item.raw.unit_owner.givenName} ${item.raw.unit_owner.surname}`
                                    }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
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
                                    >Contact Number:
                                  </span>
                                  <span
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    {{ item?.raw?.unit_owner?.primaryPhone }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
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
                                    >Category:
                                  </span>
                                  <span
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    {{ item.raw.category }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
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
                                    >Resident/Tenant:
                                  </span>
                                  <span
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <span v-if="item.raw.unitOwners.length">{{
                                      `(${item.raw.unitOwners.length}) Resident`
                                    }}</span>
                                    <span
                                      v-if="
                                        item.raw.unitOwners.length &&
                                        item.raw.tenants.length
                                      "
                                      >,
                                    </span>
                                    <span v-if="item.raw.tenants.length"
                                      >{{
                                        `(${item.raw.tenants.length})`
                                      }}
                                      Tenant</span
                                    >
                                  </span>
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
                          <span class="font-weight-bold text-h5"> Units </span>
                        </v-row>
                      </v-col>

                      <v-col cols="12">
                        <v-row no-gutters justify="center">
                          <span class="caption text-disabled">
                            You don't have list of units yet.
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
                          <v-col cols="12" md="5" class="d-flex justify-center">
                            <v-btn
                              color="blue-darken-3"
                              variant="flat"
                              style="height: 40px"
                              @click="dialog = !dialog"
                            >
                              Add New Unit
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

          <v-col cols="12" class="pa-4" v-if="units.length">
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
                    site: filterBySite || mySite,
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
                    site: filterBySite || mySite,
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
            Unit
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
              v-model="isUnitValid"
              @submit.prevent="
                !showUpdate && !showDelete
                  ? submit()
                  : showUpdate
                    ? updateUnit()
                    : deleteUnit()
              "
              class="w-100"
            >
              <v-col cols="12">
                <v-row class="justify-center mb-7">
                  <v-img
                    src="/images/empty-building-management-list.svg"
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
                            ? `Unit ${!showView ? "" : "Information"}`
                            : showConfirmationAdded || showUpdated
                              ? "Great!"
                              : unit.name
                        }`
                      }}
                      <v-divider class="mt-2"></v-divider>
                    </v-row>
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
                          ? "You added a new unit."
                          : !showUpdated && !showDeleted
                            ? "Are you sure you want to delete this unit?"
                            : !showUpdated
                              ? "You deleted this unit."
                              : "You updated the unit information"
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
                    <v-select
                      v-model="unit.category"
                      label="Select Category"
                      :items="[
                        'Resident',
                        // 'Commercial',
                        'Amenities',
                        'Management',
                      ]"
                      item-title="name"
                      item-value="_id"
                      clearable
                      density="comfortable"
                      menu-icon="mdi-chevron-down"
                      :persistent-hint="false"
                    ></v-select>
                  </v-col>

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
                    <v-combobox
                      label="Block"
                      v-model="filterBlocks"
                      :items="blocks"
                      item-title="name"
                      item-value="_id"
                      hide-details
                      density="comfortable"
                      :rules="[requiredInput]"
                      clearable
                    ></v-combobox>
                  </v-col>
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
                    <v-combobox
                      label="Level"
                      v-model="filterLevels"
                      :items="blockLevels"
                      item-title="level"
                      item-value="_id"
                      placeholder="Select level"
                      hide-details
                      density="comfortable"
                      :rules="[requiredInput]"
                      :loading="isBlockLevelsLoaded"
                      :disabled="isBlockLevelsLoaded"
                      clearable
                    ></v-combobox>
                  </v-col>
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
                      v-model="unit.name"
                      density="comfortable"
                      label="Unit"
                      placeholder="eg: Unit 1A"
                      :rules="[requiredInput]"
                      :persistent-hint="false"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="
                      ['Commercial'].includes(unit.category) &&
                      !showView &&
                      !showConfirmationAdded &&
                      !showDelete &&
                      !showUpdated &&
                      !showDeleted
                    "
                  >
                    <v-text-field
                      v-model="unit.businessName"
                      density="comfortable"
                      label="Business Name"
                      :rules="[requiredInput]"
                      placeholder="eg: Starbucks"
                      :persistent-hint="false"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="
                      ['Commercial'].includes(unit.category) &&
                      !showView &&
                      !showConfirmationAdded &&
                      !showDelete &&
                      !showUpdated &&
                      !showDeleted
                    "
                  >
                    <v-text-field
                      v-model="unit.email"
                      density="comfortable"
                      hint=""
                      label="Business Email"
                      placeholder="eg: info@starbucks.com"
                      :rules="[requiredInput, validEmail]"
                      :persistent-hint="false"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-row no-gutters>
                      <v-col
                        class="mb-4 mb-md-0 mr-md-7"
                        cols="12"
                        md="5"
                        v-if="
                          ['Commercial'].includes(unit.category) &&
                          !showView &&
                          !showConfirmationAdded &&
                          !showDelete &&
                          !showUpdated &&
                          !showDeleted
                        "
                      >
                        <v-select
                          v-model="prefix"
                          :items="prefixes"
                          item-title="country"
                          item-value="dial_code"
                          hide-details
                          menu-icon="mdi-chevron-down"
                          chips
                          label="Dial Code"
                        >
                          <template v-slot:chip="{ props, item }">
                            <v-row no-gutters v-bind="props">
                              <v-col cols="6">
                                <v-avatar
                                  size="20"
                                  :image="item.raw.flag"
                                  class="mr-3"
                                ></v-avatar>
                              </v-col>
                              <v-spacer></v-spacer>
                              <v-col cols="6">
                                {{ item.raw.dial_code }}
                              </v-col>
                            </v-row>
                          </template>
                          <template v-slot:item="{ props, item }">
                            <v-row no-gutters v-bind="props" class="px-3">
                              <v-col cols="auto">
                                <v-avatar
                                  size="30"
                                  :image="item.raw.flag"
                                  class="mr-4"
                                ></v-avatar>
                              </v-col>
                              <v-col>
                                <span>{{ item.raw.dial_code }}</span>
                              </v-col>
                              <v-col class="text-center">
                                <v-chip color="primary">{{
                                  item.raw.country
                                }}</v-chip>
                              </v-col>
                            </v-row>
                          </template>
                        </v-select>
                      </v-col>
                      <v-col
                        cols="12"
                        md="6"
                        v-if="
                          ['Commercial'].includes(unit.category) &&
                          !showView &&
                          !showConfirmationAdded &&
                          !showDelete &&
                          !showUpdated &&
                          !showDeleted
                        "
                      >
                        <v-text-field
                          v-model="primaryPhone"
                          label="Phone Number"
                          hide-details
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" v-if="showView">
                    <v-row no-gutters justify="center" align="center">
                      <v-col cols="12">
                        Unit:
                        <v-icon class="ml-4 mr-2"> mdi-home-city </v-icon>

                        <span class="mt-1">
                          {{ unit.name }}
                        </span>
                      </v-col>
                      <v-col cols="12" class="mt-6">
                        Level:
                        <v-icon class="ml-4 mr-1"> mdi-domain </v-icon>
                        {{ unit.level.level }}
                      </v-col>
                      <v-col cols="12" class="mt-6">
                        Block:
                        <v-icon class="ml-4 mr-1"> mdi-home </v-icon>
                        {{ unit.block.name }}
                      </v-col>
                      <v-col cols="12" class="mt-6">
                        Category:
                        <v-icon class="ml-4 mr-2">
                          mdi-office-building-marker-outline
                        </v-icon>

                        <span class="mt-1">
                          {{ unit.category }}
                        </span>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col cols="12" class="mt-5">
                    <v-row no-gutters justify="center">
                      <v-col
                        cols="12"
                        md="12"
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
                          :disabled="!showDelete ? !isUnitValid : false"
                          type="submit"
                          class="py-4 w-100 rounded-lg"
                          height="52px"
                          v-if="!showConfirmationAdded"
                        >
                          {{
                            !showUpdate && !showDelete
                              ? "Add Unit"
                              : showUpdate
                                ? "Update Unit"
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
                          Add Another Unit
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
    <v-dialog
      v-model="uploadDocDialog"
      transition="dialog-right-transition"
      fullscreen
      persistent
      :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
    >
      <v-card class="px-3 h-100">
        <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
          <span class="font-weight-bold pl-4 pt-1 text-capitalize">
            Upload Unit Document
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
              v-model="isUploadDocValid"
              @submit.prevent="submitUploadDocument()"
              class="w-100"
            >
              <v-col cols="12">
                <v-row class="justify-center mb-7">
                  <v-img
                    src="/images/empty-building-management-list.svg"
                    width="190px"
                    height="190px"
                  ></v-img>
                </v-row>

                <v-responsive class="mx-auto">
                  <v-col cols="12" class="font-weight-bold text-h5 mb-3">
                    <v-row no-gutters justify="center">
                      Upload Document
                      <v-divider class="mt-2"></v-divider>
                    </v-row>
                  </v-col>

                  <v-col cols="12" v-if="!showUploaded">
                    <v-text-field
                      v-model="documentName"
                      density="comfortable"
                      label="Document Name"
                      placeholder="eg: Unit Document"
                      :rules="[requiredInput]"
                      :persistent-hint="false"
                      clearable
                      :disabled="sameDocument"
                    ></v-text-field>
                    <div class="text-subtitle-1 text-medium-emphasis">
                      Attach File
                    </div>
                    <v-file-input
                      label="Choose file"
                      v-model="files"
                      accept="*"
                      placeholder="Attach a file"
                      show-size
                      chips
                      multiple
                      :loading="uploadProgress != 0"
                      :rules="[requiredInput]"
                      @change="onUploadFileSelect()"
                    ></v-file-input>
                    <v-list v-if="documentFiles" class="pa-0">
                      <v-list-item
                        v-for="(docs, index) in documentFiles"
                        :key="index"
                      >
                        <v-row
                          no-gutters
                          class="fill-height"
                          align-content="center"
                          align="center"
                        >
                          <v-col cols="12">
                            <div
                              class="d-flex justify-space-between align-center"
                            >
                              <a
                                target="_blank"
                                :href="`/api/files/${docs.id}`"
                                class="text-truncate"
                              >
                                <v-icon class="mr-2" size="x-small">
                                  mdi-paperclip
                                </v-icon>
                                {{ docs.name }}
                              </a>
                              <v-icon
                                class="ml-4"
                                size="x-small"
                                style="cursor: pointer"
                                @click="removeDoc(index)"
                              >
                                mdi-close
                              </v-icon>
                            </div>
                          </v-col>
                        </v-row>
                      </v-list-item>
                    </v-list>
                    <v-col
                      cols="12"
                      class="d-flex flex-column"
                      :class="$vuetify.display.mdAndDown ? 'pt-2' : ''"
                    >
                      <v-btn
                        color="#1867C0"
                        :disabled="
                          !isUploadDocValid || documentFiles.length == 0
                        "
                        type="submit"
                        class="py-4 w-100 rounded-lg"
                        height="52px"
                      >
                        Upload
                      </v-btn>
                    </v-col>
                  </v-col>

                  <v-col cols="12" v-if="showUploaded">
                    <div class="text-disabled mt-2 mb-5 text-center">
                      Successfully uploaded the documents.
                    </div>
                    <v-col
                      cols="12"
                      class="d-flex flex-column"
                      :class="$vuetify.display.mdAndDown ? 'pt-2' : ''"
                    >
                      <v-btn
                        variant="outlined"
                        class="py-4 w-100 rounded-lg"
                        height="52px"
                        @click="closeDialog()"
                      >
                        Close
                      </v-btn>
                    </v-col>
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
    <v-dialog
      v-model="showDocumentsDialog"
      transition="dialog-right-transition"
      fullscreen
      persistent
      :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
    >
      <v-card class="px-3 h-100">
        <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
          <span class="font-weight-bold pl-4 pt-1 text-capitalize">
            View Documents
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
            <v-col cols="12">
              <v-row class="justify-center mb-7">
                <v-img
                  src="/images/empty-building-management-list.svg"
                  width="190px"
                  height="190px"
                ></v-img>
              </v-row>
              <v-responsive class="mx-auto">
                <v-col cols="12" class="font-weight-bold text-h5">
                  <v-row no-gutters justify="center">
                    Uploaded Documents
                    <v-divider class="mt-2"></v-divider>
                  </v-row>
                </v-col>

                <v-col cols="12" class="d-flex flex-column">
                  <v-col
                    v-if="
                      unit.uploadedDocuments &&
                      unit.uploadedDocuments.length > 0
                    "
                    cols="12"
                  >
                    <v-list class="pa-0">
                      <v-list-item
                        v-for="(docs, index) in unit.uploadedDocuments"
                        :key="index"
                      >
                        <div class="d-flex justify-space-between align-center">
                          <span class="text-truncate">{{ docs.name }}</span>
                          <v-icon
                            size="small"
                            style="cursor: pointer"
                            color="primary"
                            @click="onUploadSameDocument(docs.name, unit)"
                          >
                            mdi-plus
                          </v-icon>
                        </div>

                        <v-list class="pa-0">
                          <v-list-item
                            v-for="(file, index) in docs.files"
                            :key="index"
                          >
                            <v-row
                              no-gutters
                              align-content="center"
                              class="d-flex"
                            >
                              <v-col cols="12">
                                <div
                                  class="d-flex justify-space-between align-center"
                                >
                                  <a
                                    target="_blank"
                                    :href="`/api/files/${file.id}`"
                                    class="text-truncate"
                                  >
                                    <v-icon class="mr-2" size="x-small">
                                      mdi-paperclip
                                    </v-icon>
                                    {{ file.name }}</a
                                  >
                                  <BuildingDeleteUnitDocument
                                    :_id="unit._id"
                                    :documentName="docs.name"
                                    :unit-document="file"
                                    @delete="
                                      onDocumentDelete(unit._id as string)
                                    "
                                  />
                                </div>
                              </v-col>
                            </v-row>
                          </v-list-item>
                        </v-list>
                      </v-list-item>
                    </v-list>
                  </v-col>

                  <v-col
                    cols="12"
                    v-if="
                      !unit.uploadedDocuments ||
                      unit.uploadedDocuments.length < 1
                    "
                  >
                    <v-col cols="12" class="mb-4">
                      <v-row no-gutters justify="center">
                        <span class="caption text-disabled">
                          No documents uploaded yet.
                        </span>
                      </v-row>
                    </v-col>
                  </v-col>
                  <v-btn
                    variant="outlined"
                    class="py-4 w-100 rounded-lg"
                    height="52px"
                    @click="closeDialog()"
                  >
                    Close
                  </v-btn>
                </v-col>
              </v-responsive>
            </v-col>
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
    <v-dialog
      v-model="showAddLocationDialog"
      transition="dialog-right-transition"
      fullscreen
      persistent
      :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
    >
      <v-card class="px-3 h-100">
        <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
          <span class="font-weight-bold pl-4 pt-1 text-capitalize">
            Add Location
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
              v-model="isLocationValid"
              @submit.prevent="submitAddLocation()"
              class="w-100"
            >
              <v-col cols="12">
                <v-row class="justify-center mb-7">
                  <v-img
                    src="/images/empty-building-management-list.svg"
                    width="190px"
                    height="190px"
                  ></v-img>
                </v-row>

                <v-responsive class="mx-auto" v-if="!showLocationAdded">
                  <v-col cols="12" class="font-weight-bold text-h5 mb-3">
                    <v-row no-gutters>
                      Location
                      <v-divider class="mt-2"></v-divider>
                    </v-row>
                  </v-col>

                  <v-col cols="12">
                    <v-select
                      v-model="unit.category"
                      label="Select Category"
                      :items="[
                        'Resident',
                        // 'Commercial',
                        'Amenities',
                        'Management',
                      ]"
                      item-title="name"
                      item-value="_id"
                      clearable
                      density="comfortable"
                      menu-icon="mdi-chevron-down"
                      :persistent-hint="false"
                      :rules="[requiredInput]"
                    ></v-select>
                  </v-col>

                  <v-col cols="12">
                    <v-combobox
                      label="Block"
                      v-model="filterBlocks"
                      :items="blocks"
                      item-title="name"
                      item-value="_id"
                      hide-details
                      density="comfortable"
                      :rules="[requiredInput]"
                      clearable
                      :loading="isBlocksLoaded"
                      :disabled="isBlocksLoaded"
                    ></v-combobox>
                  </v-col>
                  <v-col cols="12">
                    <v-combobox
                      label="Level"
                      v-model="filterLevels"
                      :items="blockLevels"
                      item-title="level"
                      item-value="_id"
                      placeholder="Select level"
                      hide-details
                      density="comfortable"
                      :rules="[requiredInput]"
                      :loading="isBlockLevelsLoaded"
                      :disabled="isBlockLevelsLoaded"
                      clearable
                    ></v-combobox>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="unit.name"
                      density="comfortable"
                      label="Unit"
                      placeholder="eg: Unit 1A"
                      :persistent-hint="false"
                      clearable
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" class="mt-5">
                    <v-row no-gutters justify="center">
                      <v-col
                        cols="12"
                        class="d-flex flex-column"
                        :class="$vuetify.display.mdAndDown ? 'pt-2' : ''"
                      >
                        <v-btn
                          color="#1867C0"
                          :disabled="!isLocationValid"
                          type="submit"
                          class="py-4 w-100 rounded-lg"
                          height="52px"
                        >
                          Add Location
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-responsive>
                <v-responsive class="mx-auto" v-if="showLocationAdded">
                  <v-col
                    cols="12"
                    class="font-weight-bold text-h5 mb-3"
                    justify="center"
                  >
                    <v-col cols="12" no-gutters>
                      <div class="text-center">Great!</div>
                      <v-divider class="mt-2"></v-divider>
                    </v-col>
                  </v-col>

                  <div class="text-disabled mb-1 text-center">
                    You added a new location.
                  </div>
                  <v-col cols="12" class="mt-5">
                    <v-row no-gutters justify="center">
                      <v-col
                        cols="12"
                        md="12"
                        :class="$vuetify.display.mdAndDown ? 'mr-0' : 'mb-2'"
                      >
                        <v-btn
                          color="#1867C0"
                          class="py-4 w-100 rounded-lg"
                          height="52px"
                          @click="showLocationAdded = !showLocationAdded"
                        >
                          Add Another Location
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
import { filter } from "lodash";
import debounce from "lodash/debounce";
import organization from "~/middleware/organization";
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

const showUploadDoc = ref(false);

const uploadDocDialog = ref(false);

const showUploaded = ref(false);

const showDocumentsDialog = ref(false);

const showAddLocationDialog = ref(false);
const showLocationAdded = ref(false);

const { theme, setSnackbar } = useLocal();
const { requiredInput } = useUtils();

const {
  setBlock,
  setBlocks,
  block,
  addBlock,
  upload,
  blocks,
  getAllBlocks,
  isBlocksLoaded,
} = useBlock();
const { blockLevels, setBlockLevels, isBlockLevelsLoaded, getAllLevel } =
  useBlockLevel();

const sameDocument = ref(false);

const {
  isUnitsLoaded,
  isUnitValid,
  setUnit,
  search,
  unit,
  units,
  updateUnitById,
  deleteUnitById,
  itemsPerPage,
  pageRange,
  canNextPage,
  nextPage,
  canPrevPage,
  prevPage,
  filterBySite,
  setBlockLevelUnits,
  isUploadDocValid,
  uploadDocumentById,
  isLocationValid,
  filterBlocks,
  filterLevels,
  addLocation,
  page,
} = useBlockLevelUnit();

const { sites } = useSite();

const { currentUser } = useLocalAuth();

const { getSitesOptionsForFiltering, mySite, myOrg } = useFilter();

watch(
  filterBySite,
  (newValue) => {
    setBlockLevelUnits({
      organization: myOrg.value ?? "",
      site: newValue || mySite.value,
      category: "",
    });
    // setUnits({
    //   block: block.value,
    //   level: level.value,
    //   category: newValue !== "All" ? newValue : "",
    // });
  },
  { deep: true },
);

watch(
  filterBlocks,
  (newValue: any) => {
    if (!newValue) return (filterLevels.value = "");

    getAllLevel({
      site: filterBySite.value || mySite.value,
      block: newValue._id,
    });

    filterLevels.value = "";
  },
  { deep: true },
);

onMounted(async () => {
  setUnit();
  units.value = [];
  await Promise.all([
    getSitesOptionsForFiltering(),
    setBlockLevelUnits({
      organization: myOrg.value ?? "",
      site: filterBySite.value || mySite.value,
    }),
    _getAllBlocks(filterBySite.value || mySite.value),
  ]);
});

type TFile = {
  name: string;
  data: File;
  progress: number;
  id?: string;
};

const files = ref<File[]>([]);
const file = ref<TFile[]>([]);
const fileString = ref<Record<string, any>>([]);
const uploadProgress = ref(0);
const documentName = ref("");
const documentFiles = ref<TAttachment[]>([]);

function clearForm() {
  filterBlocks.value = "";
  filterLevels.value = "";
  unit.value.category = "";
  unit.value.name = "";
}

async function onUploadSameDocument(name: string, unit: TBlockLevelUnit) {
  documentName.value = name;
  sameDocument.value = true;

  uploadUnitDocDialog(unit);
}

async function onDocumentDelete(id: string) {
  await setBlockLevelUnits({
    organization: myOrg.value ?? "",
    site: filterBySite.value || mySite.value,
  });
  const newUnit = units.value.find((item: any) => item._id === id);
  viewDocumentsDialog(newUnit as TBlockLevelUnit);
}

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
        // await setBlocks({
        //   organization: currentUser.value.organization,
        //   site: filterBySite.value || mySite.value,
        // });

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
          await viewUnitByDialog(data);
        },
      },
      visible: $ability.can("read", "view-buildings"),
    },
    {
      text: "Edit",
      value: "Edit",
      isLink: false,
      class: "text-center",
      dialogData: {
        action: async (data: any) => {
          await editUnitByDialog(data);
        },
      },
      visible: $ability.can("update", "edit-buildings"),
    },
    {
      text: "Delete",
      value: "Delete",
      isLink: false,
      class: "text-center",
      dialogData: {
        action: async (data: any) => {
          await deleteUnitByDialog(data);
        },
      },
      visible: $ability.can("delete", "delete-buildings"),
    },
    {
      text: "Upload Document",
      value: "Upload",
      isLink: false,
      class: "text-center",
      dialogData: {
        action: async (data: any) => {
          await uploadUnitDocDialog(data);
        },
      },
      visible: $ability.can("update", "edit-buildings"),
    },
    {
      text: "View Documents",
      value: "View",
      isLink: false,
      class: "text-center",
      dialogData: {
        action: async (data: any) => {
          await viewDocumentsDialog(data);
        },
      },
      visible: $ability.can("read", "view-buildings"),
    },

    {
      text: "Setup Unit",
      value: "Setup",
      isLink: false,
      class: "text-center",
      dialogData: {
        action: async (data: any) => {
          useRouter().push(
            `/building/blocks/${data._id}/add?site=${mySite.value}`,
          );
        },
      },
      visible: $ability.can("read", "view-buildings"),
    },
    {
      text: "View Setup Unit",
      value: "ViewSetup",
      isLink: false,
      class: "text-center",
      dialogData: {
        action: async (data: any) => {
          useRouter().push(
            `/building/blocks/${data._id}/view?site=${mySite.value}`,
          );
        },
      },
      visible: $ability.can("read", "view-buildings"),
    },
    {
      text: "Edit Setup Unit",
      value: "EditSetup",
      isLink: false,
      class: "text-center",
      dialogData: {
        action: async (data: any) => {
          useRouter().push(
            `/building/blocks/${data._id}/edit?site=${mySite.value}`,
          );
        },
      },
      visible: $ability.can("update", "edit-buildings"),
    },
  ];
});

async function _getAllBlocks(site: string) {
  isBlocksLoaded.value = true;
  try {
    const _blocks = await getAllBlocks(site);
    blocks.value = _blocks as TBlock[];
    isBlocksLoaded.value = false;
  } catch (error) {
    isBlockLevelsLoaded.value = false;
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}

function onSearch(val: string) {
  debouncedSearch(val);
}

const debouncedSearch = debounce(async (value: string) => {
  page.value = 1;
  search.value = value;
  await setBlockLevelUnits({
    //organization: currentUser.value.organization,
    site: filterBySite.value || mySite.value,
  });
}, 500);

function removeDoc(index: number) {
  documentFiles && documentFiles.value.splice(index, 1);
}

function viewUnitByDialog(unt: TBlockLevelUnit) {
  unit.value = unt;
  dialog.value = true;
  showView.value = true;
}

async function editUnitByDialog(unt: TBlockLevelUnit) {
  let data = JSON.stringify(unt);
  unit.value = JSON.parse(data);
  dialog.value = true;
  showUpdate.value = true;

  filterBlocks.value = unt.block;
  setTimeout(() => {
    filterLevels.value = unt.level;
  }, 100);
}

function deleteUnitByDialog(unt: TBlockLevelUnit) {
  unit.value = unt;
  dialog.value = true;
  showDelete.value = true;
}

function uploadUnitDocDialog(unt: TBlockLevelUnit) {
  unit.value = unt;
  uploadDocDialog.value = true;
  showUploadDoc.value = true;
}

function viewDocumentsDialog(unt: TBlockLevelUnit) {
  unit.value = unt;
  uploadDocDialog.value = false;
  showDocumentsDialog.value = true;
}

function closeDialog() {
  //setBlockLevelUnits();
  dialog.value = false;
  showView.value = false;
  showUpdate.value = false;
  showUpdated.value = false;
  showDelete.value = false;
  showDeleted.value = false;
  showConfirmationAdded.value = false;
  uploadDocDialog.value = false;
  showUploadDoc.value = false;
  showDocumentsDialog.value = false;
  showUploaded.value = false;
  showAddLocationDialog.value = false;
  showLocationAdded.value = false;
  documentFiles.value = [];
  documentName.value = "";
  sameDocument.value = false;
}

const onUploadFileSelect = async () => {
  //upload files immediately, then get the file ids
  fileString.value = files.value.map((file: any) => ({
    name: file.name,
    data: file,
    progress: 0,
    url: URL.createObjectURL(file),
  }));

  for (let i = 0; i < fileString.value.length; i++) {
    const formData = new FormData();

    try {
      formData.append("file", fileString.value[i].data);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/files/upload?status=draft");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          fileString.value[i].progress = Math.round(
            (event.loaded / event.total) * 100,
          );
          uploadProgress.value = fileString.value[i].progress;
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          fileString.value[i].id = response.id;
          documentFiles.value.push({
            id: response.id,
            name: fileString.value[i].name,
          });
          uploadProgress.value = 0;
          files.value = [];
        }
      };

      xhr.send(formData);
    } catch (e) {
      console.log("Error occured while attaching images.", e);
    }
  }
};

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

async function submitUploadDocument() {
  try {
    const document = {
      name: documentName.value,
      files: documentFiles.value,
      uploadedAt: new Date(),
    };

    await uploadDocumentById(unit.value._id as string, document);
    documentName.value = "";
    documentFiles.value = [];
    sameDocument.value = false;

    setBlockLevelUnits({
      organization: myOrg.value ?? "",
      site: filterBySite.value || mySite.value,
      category: "",
    });
    showUploaded.value = true;
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}

async function submitAddLocation() {
  try {
    const item = await addLocation({
      category: unit.value.category,
      unit: unit.value.name,
      level: filterLevels.value._id ?? filterLevels.value,
      block: filterBlocks.value._id ?? filterBlocks.value,
      site: filterBySite.value || mySite.value,
      organization: (currentUser.value.organization as string) ?? myOrg.value,
    });

    if (item.status === "error") {
      return setSnackbar({
        text: item.message as string,
        modal: true,
        type: "warning",
      });
    }
    clearForm();
    showLocationAdded.value = true;
    setBlockLevelUnits({
      organization: myOrg.value ?? "",
      site: filterBySite.value || mySite.value,
    });
    _getAllBlocks(filterBySite.value || mySite.value);
    // setBlocks({
    //   organization: myOrg.value ?? "",
    //   site: filterBySite.value || mySite.value,
    // });
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}

async function updateUnit() {
  try {
    await updateUnitById({
      _id: unit.value._id as string,
      category: unit.value.category as string,
      name: unit.value.name as string,
      businessName:
        unit.value.category !== "Commercial"
          ? ""
          : (unit.value.businessName as string),
      email:
        unit.value.category !== "Commercial"
          ? ""
          : (unit.value.email as string),
      contact_number:
        unit.value.category !== "Commercial"
          ? ""
          : (unit.value.contact_number as string),

      block: filterBlocks.value._id as string,
      level: filterLevels.value._id as string,
    });
    setBlockLevelUnits({
      organization: currentUser.value.organization ?? "",
      site: filterBySite.value || mySite.value,
    });
    showUpdated.value = true;
  } catch (error) {
    await setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}

async function deleteUnit() {
  try {
    await deleteUnitById(unit.value._id as string);
    setBlockLevelUnits({
      organization: currentUser.value.organization ?? "",
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
