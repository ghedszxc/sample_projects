<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <v-card
        width="100%"
        elevation="3"
        height="100%"
        :loading="isBlockLevelsLoaded"
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
                <v-data-iterator
                  :items="blockLevels"
                  :items-per-page="itemsPerPage"
                >
                  <template v-slot:header>
                    <v-row no-gutters class="pa-4" align="center">
                      <v-col cols="12" sm="9">
                        <v-row no-gutters align="center">
                          <v-col cols="12" sm="4">
                            <v-btn
                              icon="mdi-chevron-left"
                              elevation="0"
                              size="small"
                              class="mb-1"
                              :to="{
                                name: `building-blocks`,
                                query: { site: mySite },
                              }"
                            ></v-btn>
                            <span class="font-weight-bold text-h6">
                              Levels
                            </span>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="7"
                            class="ml-0 ml-sm-2 mb-2 mb-sm-0"
                          >
                            <v-text-field
                              v-model="search"
                              placeholder="Search name, id"
                              hide-details
                              density="compact"
                              append-inner-icon="mdi-magnify"
                              @update:modelValue="onSearch"
                              clearable
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="3"
                        v-if="$ability.can('create', 'create-buildings')"
                      >
                        <v-row no-gutters justify="end">
                          <v-col cols="12" md="8" sm="12">
                            <v-btn
                              color="blue-darken-3"
                              block
                              variant="flat"
                              @click="dialog = !dialog"
                              class="d-flex align-center"
                              ><v-icon> mdi-plus </v-icon>
                              <span> Add Level </span>
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
                            <v-col cols="12" sm="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Level
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" sm="4" md="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Units
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" sm="4" md="3">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize text-caption font-weight-bold"
                                >
                                  Date Created
                                  <span v-if="$vuetify.display.sm"
                                    >/ Updated</span
                                  >
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              sm="3"
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
                                cols="12"
                                sm="3"
                                class="text-capitalize white--text text"
                              >
                                <v-row no-gutters align="center">
                                  <v-avatar
                                    size="small"
                                    color="#FB7800"
                                    class="mr-1 pa-1"
                                  >
                                    <v-img
                                      src="/icons/building-block-levels.svg"
                                    ></v-img>
                                  </v-avatar>

                                  <span
                                    class="d-inline-block text-truncate text-capitalize text-body-2"
                                  >
                                    {{ item.raw.level }}
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col cols="12" sm="4" md="3">
                                <v-row no-gutters align="center">
                                  <v-avatar size="small" class="mr-1">
                                    <v-icon color="red"> mdi-home-city </v-icon>
                                  </v-avatar>
                                  <span
                                    class="d-inline-block text-truncate text-capitalize text-body-2"
                                  >
                                    {{ item.raw._units }}
                                    Units
                                  </span>
                                </v-row>
                              </v-col>

                              <v-col
                                cols="12"
                                sm="4"
                                md="3"
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
                                <v-row
                                  no-gutters
                                  class="fill-height"
                                  align-content="center"
                                  v-if="$vuetify.display.sm"
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

                              <v-col
                                cols="12"
                                sm="3"
                                class="text text-capitalize"
                                v-if="$vuetify.display.mdAndUp"
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

                              <div
                                class="position-absolute right-0 top-0 mt-5 mt-md-3"
                                :class="
                                  $vuetify.display.mdAndDown ? 'mr-1' : 'mr-5'
                                "
                              >
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
                                              block: useRoute().params.block,
                                              level: item.raw._id,
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
                                    >Level:
                                  </span>
                                  <span
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-avatar
                                      size="small"
                                      color="#FB7800"
                                      class="mr-1 pa-1"
                                    >
                                      <v-img
                                        src="/icons/building-block-levels.svg"
                                      ></v-img>
                                    </v-avatar>
                                    {{ item.raw.level }}
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
                                    >Units:
                                  </span>
                                  <span
                                    class="text-truncate mt-1"
                                    :style="
                                      $vuetify.display.smAndDown
                                        ? 'font-size: .8rem;'
                                        : ''
                                    "
                                  >
                                    <v-icon color="primary" class="mr-1 mb-1">
                                      mdi-home-city
                                    </v-icon>
                                    {{ item.raw._units }} Units
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
                                      mdi-calendar-refresh
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
                                                block: useRoute().params.block,
                                                level: item.raw._id,
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
                            src="/images/undraw_apartment_rent_o-0-ut (1) 1.svg"
                            width="150px"
                            height="150px"
                          ></v-img>
                        </v-row>
                      </v-col>

                      <v-col cols="12" class="mt-10">
                        <v-row no-gutters justify="center">
                          <span class="font-weight-bold text-h5"> Levels </span>
                        </v-row>
                      </v-col>

                      <v-col cols="12">
                        <v-row no-gutters justify="center">
                          <span class="caption text-disabled">
                            You don't have list of levels yet.
                          </span>
                        </v-row>
                      </v-col>

                      <v-col
                        cols="12"
                        md="4"
                        class="mt-10"
                        v-if="$ability.can('create', 'create-buildings')"
                      >
                        <v-row no-gutters>
                          <v-col
                            cols="12"
                            md="12"
                            class="d-flex justify-center"
                          >
                            <v-btn
                              color="blue-darken-3"
                              variant="flat"
                              style="height: 40px"
                              @click="dialog = !dialog"
                            >
                              Add New Level
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

          <v-col cols="12" class="pa-4" v-if="blockLevels.length">
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
                    block: block,
                    // organization: currentUser.organization,
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
                    block: block,
                    // organization: currentUser.organization,
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
            Level
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
              v-model="isBlockLevelValid"
              @submit.prevent="
                !showUpdate && !showDelete
                  ? submit()
                  : showUpdate
                    ? updateBlockLevelName()
                    : deleteBlockLevel()
              "
              class="w-100"
            >
              <v-col cols="12">
                <v-row class="justify-center mb-7">
                  <v-img
                    src="/images/undraw_apartment_rent_o-0-ut (1) 1.svg"
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
                            ? `Level ${!showView ? "" : "Information"}`
                            : showConfirmationAdded || showUpdated
                              ? "Great!"
                              : blockLevel.level
                        }`
                      }}
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
                          ? "You added a new level."
                          : !showUpdated && !showDeleted
                            ? "Are you sure you want to delete this level?"
                            : !showUpdated
                              ? "You deleted this level."
                              : "You updated the level number"
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
                      v-model="blockLevel.level"
                      density="comfortable"
                      hint=""
                      label="Level number"
                      placeholder="eg: 1"
                      :rules="[requiredInput]"
                      :persistent-hint="false"
                      clearable
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" v-if="showView">
                    <v-row no-gutters justify="center" align="center">
                      <v-col cols="12">
                        <v-avatar
                          size="small"
                          color="#6C63FF"
                          class="mr-5 pa-1"
                        >
                          <v-img src="/icons/building-block-levels.svg"></v-img>
                        </v-avatar>

                        <span class="mt-1">
                          {{ blockLevel.level }}
                        </span>
                      </v-col>
                      <v-col cols="12" class="mt-6">
                        <v-avatar size="small" class="mr-5 pa-1">
                          <v-img
                            src="/icons/building-blocks-level-number-of-units.svg"
                          ></v-img>
                        </v-avatar>
                        <span class="mt-1">
                          {{ blockLevel._units }} Units
                        </span>
                      </v-col>
                      <v-col cols="12" class="ml-2 mt-6">
                        Created
                        <v-icon class="ml-2">
                          mdi-calendar-month-outline
                        </v-icon>
                        {{ standardFormatDate(blockLevel.createdAt) }}
                      </v-col>
                      <v-col cols="12" class="ml-2 mt-6">
                        Updated
                        <v-icon class="ml-1">
                          mdi-calendar-month-outline
                        </v-icon>
                        {{ standardFormatDate(blockLevel.updatedAt) }}
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
                          :disabled="!showDelete ? !isBlockLevelValid : false"
                          type="submit"
                          class="py-4 w-100 rounded-lg"
                          height="52px"
                          v-if="!showConfirmationAdded"
                        >
                          {{
                            !showUpdate && !showDelete
                              ? "Add Level"
                              : showUpdate
                                ? "Update Level"
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
                          Add Another Level
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

const { requiredInput, standardFormatDate } = useUtils();
const { theme, setSnackbar } = useLocal();
const { getSitesOptionsForFiltering, mySite } = useFilter();
const {
  isBlockLevelsLoaded,
  isBlockLevelValid,
  setBlockLevel,
  setBlockLevels,
  search,
  blockLevel,
  blockLevels,
  addBlockLevel,
  updateBlockLevelNameById,
  deleteBlockLevelById,
  itemsPerPage,
  pageRange,
  canNextPage,
  nextPage,
  canPrevPage,
  prevPage,
} = useBlockLevel();

const { currentUser } = useLocalAuth();

const block = computed(() => useRoute().params.block as string);

onMounted(async () => {
  setBlockLevel();
  blockLevels.value = [];
  await Promise.all([
    getSitesOptionsForFiltering(),
    setBlockLevels({
      block: block.value,
    }),
  ]);
});

const actions = computed(() => {
  return [
    {
      text: "View",
      value: "View",
      isLink: false,
      class: "text-center",
      dialogData: {
        action: async (data: any) => {
          viewBlockLevelByDialog(data);
        },
      },
      visible: $ability.can("read", "create-buildings"),
    },
    {
      text: "Edit Level",
      value: "Edit Level",
      isLink: false,
      class: "text-center",
      dialogData: {
        action: async (data: any) => {
          await editBlockLevelByDialog(data);
        },
      },
      visible: $ability.can("update", "edit-buildings"),
    },
    {
      text: "View Units",
      isLink: true,
      class: "text-center",
      to: "building-blocks-block-levels-level-units",
      visible: $ability.can("read", "view-buildings"),
    },
    {
      text: "Delete",
      value: "Delete Level",
      isLink: false,
      class: "text-center",
      dialogData: {
        action: async (data: any) => {
          deleteBlockLevelByDialog(data);
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
  await setBlockLevels({
    block: block.value,
  });
}, 500);

function viewBlockLevelByDialog(blkLevel: TBlockLevel) {
  blockLevel.value = blkLevel;
  dialog.value = true;
  showView.value = true;
}

function editBlockLevelByDialog(blkLevel: TBlockLevel) {
  let data = JSON.stringify(blkLevel);
  blockLevel.value = JSON.parse(data);
  dialog.value = true;
  showUpdate.value = true;
}

function deleteBlockLevelByDialog(blkLevel: TBlockLevel) {
  blockLevel.value = blkLevel;
  dialog.value = true;
  showDelete.value = true;
}

function closeDialog() {
  setBlockLevel();
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
    const item = await addBlockLevel({
      block: block.value,
      level: blockLevel.value.level,
      organization: currentUser.value.organization,
    });

    if (item.status === "error") {
      return setSnackbar({
        text: item.message as string,
        modal: true,
        type: "warning",
      });
    }

    await setBlockLevels({
      block: block.value,
      organization: currentUser.value.organization,
    });
    await setBlockLevel();
    showConfirmationAdded.value = true;
  } catch (error) {
    await setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}

async function updateBlockLevelName() {
  try {
    await updateBlockLevelNameById({
      _id: blockLevel.value._id as string,
      level: blockLevel.value.level as string,
    });
    await setBlockLevels({
      block: block.value,
      organization: currentUser.value.organization,
    });
    showUpdated.value = true;
  } catch (error) {
    await setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}

async function deleteBlockLevel() {
  try {
    await deleteBlockLevelById(blockLevel.value._id as string);
    await setBlockLevels({
      block: block.value,
      organization: currentUser.value.organization,
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
