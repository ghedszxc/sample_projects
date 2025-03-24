<template>
  <v-row no-gutters class="pa-8">
    <!-- back -->
    <v-col
      v-if="templateQuery"
      cols="12"
      class="text-h6 font-weight-bold my-4"
      style="letter-spacing: 2px !important"
    >
      <v-btn
        fav
        density="compact"
        icon="mdi-arrow-left"
        variant="text"
        @click="goBack()"
      ></v-btn>
      Template
    </v-col>

    <v-col cols="12">
      <v-card
        width="100%"
        elevation="3"
        height="100%"
        :loading="isPassKeysLoading"
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
            <v-data-iterator :items="passKeys" :items-per-page="itemsPerPage">
              <template v-slot:header>
                <v-row no-gutters class="pa-4" justify="space-between">
                  <v-col cols="12" md="3">
                    <v-row align="center">
                      <v-col cols="12" md="1" v-if="$vuetify.display.smAndDown">
                        <span class="font-weight-bold text-h6">
                          Pass & Keys
                        </span>
                      </v-col>

                      <v-col cols="12" md="11" class="d-flex">
                        <span
                          class="font-weight-bold text-h6 mr-3 pt-1"
                          v-if="$vuetify.display.mdAndUp"
                        >
                          Pass & Keys
                        </span>

                        <v-text-field
                          v-model="search"
                          placeholder="Search"
                          hide-details
                          density="compact"
                          append-inner-icon="mdi-magnify"
                          :class="$vuetify.display.mdAndUp ? '' : ''"
                          clearable
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col cols="12" md="9">
                    <v-row
                      :class="$vuetify.display.mdAndUp ? 'justify-end' : ''"
                    >
                      <!-- filter by status -->
                      <v-col
                        cols="12"
                        md="2"
                        lg="2"
                        xl="2"
                        :class="{
                          'mt-4': $vuetify.display.smAndDown,
                          'px-0': !$vuetify.display.smAndDown,
                        }"
                      >
                        <v-autocomplete
                          clearable="true"
                          v-model="filterByPassStatus"
                          label="Filter by status"
                          :items="passTypesStatus"
                          item-title="title"
                          item-value="value"
                          return-object="true"
                          hide-details
                          density="compact"
                          menu-icon="mdi-chevron-down"
                          placeholder="Select status"
                          multiple
                          @update:modelValue="
                            onFilterByPassStatus(filterByPassStatus)
                          "
                          :loading="isTemplateListLoading"
                        />
                      </v-col>
                      <!-- filter by type -->
                      <v-col
                        cols="12"
                        md="3"
                        lg="3"
                        xl="3"
                        :class="{
                          'mt-1': $vuetify.display.smAndDown,
                        }"
                      >
                        <v-autocomplete
                          v-if="tab !== 'key'"
                          v-model="filterByPassType"
                          label="Filter by type"
                          :items="passTypes"
                          item-title="title"
                          item-value="value"
                          return-object
                          hide-details
                          density="compact"
                          menu-icon="mdi-chevron-down"
                          @update:modelValue="
                            onFilterByPassType(filterByPassType)
                          "
                          :loading="isTemplateListLoading"
                        />
                      </v-col>

                      <!-- filter by template -->
                      <v-col
                        cols="12"
                        md="3"
                        lg="3"
                        xl="3"
                        :class="{ 'mt-1': $vuetify.display.smAndDown }"
                      >
                        <v-autocomplete
                          v-if="tab !== 'key'"
                          v-model="filterByTemplateName"
                          label="Filter by template"
                          :items="templateList"
                          item-title="name"
                          item-value="_id"
                          return-object
                          hide-details
                          density="compact"
                          menu-icon="mdi-chevron-down"
                          @update:modelValue="
                            onFilterByTemplateName(filterByTemplateName)
                          "
                          :loading="isTemplateListLoading"
                        />
                      </v-col>

                      <!-- generate -->
                      <v-col cols="12" md="2" lg="2" xl="32">
                        <v-btn
                          color="blue-darken-3"
                          block
                          variant="flat"
                          style="height: 40px"
                          @click="openDialog('generate', null)"
                          v-if="$ability.can('create', 'create-keys')"
                        >
                          generate
                        </v-btn>
                      </v-col>

                      <!-- print -->
                      <v-col cols="12" md="2" lg="2" xl="2">
                        <v-btn
                          color="blue-darken-3"
                          block
                          variant="flat"
                          style="height: 40px"
                          @click="openPrintDialog = true"
                        >
                          print
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>

                  <!-- tabs -->
                  <v-col cols="12" class="my-4">
                    <v-row no-gutters>
                      <v-col
                        cols="6"
                        class="text-center font-weight-bold"
                        @click="switchTab('pass')"
                        style="cursor: pointer; font-size: 16px"
                        :style="
                          tab === 'pass'
                            ? 'border-bottom: 3px solid #0077b6; padding: .5rem; color: #0077b6;'
                            : 'border-bottom: 3px solid gray; padding: .5rem'
                        "
                      >
                        Passes
                      </v-col>
                      <v-col
                        cols="6"
                        class="text-center font-weight-bold"
                        @click="switchTab('key')"
                        style="cursor: pointer; font-size: 16px"
                        :style="
                          tab === 'key'
                            ? 'border-bottom: 3px solid #0077b6; padding: .5rem; color: #0077b6;'
                            : 'border-bottom: 3px solid gray; padding: .5rem'
                        "
                      >
                        Keys
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <v-divider></v-divider>
                <v-list
                  class="pa-0"
                  density="compact"
                  v-if="$vuetify.display.smAndUp"
                >
                  <v-list-item class="px-8">
                    <v-list-item-title>
                      <v-row no-gutters>
                        <v-col v-if="tab == 'key'" cols="12" sm="7" md="1">
                          <v-row
                            no-gutters
                            class="fill-height"
                            align-content="center"
                          >
                            <span
                              class="d-inline-block text-caption font-weight-bold"
                            >
                              Key #
                            </span>
                          </v-row>
                        </v-col>
                        <v-col cols="12" sm="7" :md="tab !== 'key' ? 2 : 1">
                          <v-row
                            no-gutters
                            class="fill-height"
                            align-content="center"
                          >
                            <span
                              class="d-inline-block text-caption font-weight-bold"
                            >
                              ID
                            </span>
                          </v-row>
                        </v-col>

                        <v-col cols="12" sm="7" :md="tab !== 'key' ? 2 : 1">
                          <v-row
                            no-gutters
                            class="fill-height"
                            align-content="center"
                          >
                            <span
                              class="d-inline-block text-caption font-weight-bold"
                            >
                              Type
                            </span>
                          </v-row>
                        </v-col>

                        <v-col
                          cols="12"
                          sm="4"
                          md="2"
                          v-if="$vuetify.display.mdAndUp && tab !== 'key'"
                        >
                          <v-row
                            no-gutters
                            class="fill-height"
                            align-content="center"
                          >
                            <span
                              class="d-inline-block text-caption font-weight-bold"
                            >
                              Template
                            </span>
                          </v-row>
                        </v-col>

                        <v-col v-if="tab == 'key'" cols="12" sm="4" md="1">
                          <v-row
                            no-gutters
                            class="fill-height"
                            align-content="center"
                          >
                            <span
                              class="d-inline-block text-caption font-weight-bold"
                            >
                              Qty
                            </span>
                          </v-row>
                        </v-col>

                        <v-col v-if="tab == 'key'" cols="12" sm="4" md="2">
                          <v-row
                            no-gutters
                            class="fill-height"
                            align-content="center"
                          >
                            <span
                              class="d-inline-block text-caption font-weight-bold"
                            >
                              Description
                            </span>
                          </v-row>
                        </v-col>

                        <v-col v-if="tab == 'key'" cols="12" sm="4" md="1">
                          <v-row
                            no-gutters
                            class="fill-height"
                            align-content="center"
                          >
                            <span
                              class="d-inline-block text-caption font-weight-bold"
                            >
                              Location
                            </span>
                          </v-row>
                        </v-col>

                        <v-col cols="12" sm="4" md="1">
                          <v-row
                            no-gutters
                            class="fill-height"
                            align-content="center"
                          >
                            <span
                              class="d-inline-block text-caption font-weight-bold"
                            >
                              Status
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
                              class="d-inline-block text-caption font-weight-bold"
                            >
                              Last Update
                            </span>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-list-item-title>
                  </v-list-item>
                  <v-divider />
                </v-list>
              </template>

              <template #default="{ items }">
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
                            sm="4"
                            md="1"
                            :class="`text text-capitalize text-body-2 ${
                              !$vuetify.display.smAndUp && 'mb-1'
                            }`"
                            v-if="
                              ($vuetify.display.mdAndUp ||
                                $vuetify.display.xs) &&
                              tab == 'key'
                            "
                          >
                            <v-row
                              no-gutters
                              class="fill-height text-truncate"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.xs ? 'space-between' : 'start'
                              "
                            >
                              <span
                                class="mr-2 d-flex d-sm-none font-weight-bold"
                              >
                                Key #
                              </span>
                              <span
                                class="text-truncate mt-1 d-flex align-center"
                                :style="
                                  $vuetify.display.xs ? 'font-size: .8rem;' : ''
                                "
                              >
                                {{
                                  item.raw?.keyNo
                                    ? (item.raw?.keyNo)
                                        .toString()
                                        .padStart(2, 0)
                                    : "N/A"
                                }}
                              </span>
                            </v-row>
                          </v-col>
                          <v-col
                            cols="12"
                            sm="7"
                            :md="tab !== 'key' ? 2 : 1"
                            :class="`text-capitalize text-body-2 white--text text ${$vuetify.display.xs && 'mb-1'}`"
                          >
                            <v-row
                              no-gutters
                              class="fill-height text-truncate"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.xs ? 'space-between' : 'start'
                              "
                            >
                              <span
                                class="mr-2 d-flex d-sm-none font-weight-bold"
                              >
                                ID:
                              </span>
                              <span class="d-flex flex-column text-truncate">
                                <span
                                  class="text-truncate mt-1"
                                  :style="
                                    $vuetify.display.xs
                                      ? 'font-size: .8rem;'
                                      : ''
                                  "
                                >
                                  <v-avatar
                                    size="x-small"
                                    :color="
                                      item.raw.passType !== 'pass-key'
                                        ? 'primary'
                                        : 'green'
                                    "
                                    :class="`${$vuetify.display.smAndUp ? 'mr-2' : 'mr-1'}`"
                                  >
                                    <v-icon
                                      size="x-small"
                                      :icon="
                                        item.raw.passType !== 'pass-key'
                                          ? 'mdi-badge-account-outline'
                                          : 'mdi-key-variant'
                                      "
                                    ></v-icon>
                                  </v-avatar>

                                  {{ item.raw.prefixAndName }}
                                </span>
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="4"
                            :md="tab !== 'key' ? 2 : 1"
                            :class="`text text-capitalize text-body-2 ${
                              !$vuetify.display.smAndUp && 'mb-1'
                            }`"
                            v-if="
                              $vuetify.display.mdAndUp || $vuetify.display.xs
                            "
                          >
                            <v-row
                              no-gutters
                              class="fill-height text-truncate"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.xs ? 'space-between' : 'start'
                              "
                            >
                              <span
                                class="mr-2 d-flex d-sm-none font-weight-bold"
                              >
                                Type
                              </span>
                              <span
                                class="text-truncate mt-1 d-flex align-center"
                                :style="
                                  $vuetify.display.xs ? 'font-size: .8rem;' : ''
                                "
                              >
                                {{
                                  tab !== "key"
                                    ? item.raw.passType
                                    : !item.raw?.parentId
                                      ? "Original"
                                      : "Duplicate"
                                }}
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="4"
                            md="2"
                            :class="`text text-capitalize text-body-2 ${
                              !$vuetify.display.smAndUp && 'mb-1'
                            }`"
                            v-if="
                              ($vuetify.display.mdAndUp ||
                                $vuetify.display.xs) &&
                              tab !== 'key'
                            "
                          >
                            <v-row
                              no-gutters
                              class="fill-height text-truncate"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.xs ? 'space-between' : 'start'
                              "
                            >
                              <span
                                class="mr-2 d-flex d-sm-none font-weight-bold"
                              >
                                Template
                              </span>
                              <span
                                class="text-truncate mt-1 d-flex align-center"
                                :style="
                                  $vuetify.display.xs ? 'font-size: .8rem;' : ''
                                "
                              >
                                {{ item.raw.templateName }}
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="4"
                            md="1"
                            :class="`text text-capitalize text-body-2 ${
                              !$vuetify.display.smAndUp && 'mb-1'
                            }`"
                            v-if="
                              ($vuetify.display.mdAndUp ||
                                $vuetify.display.xs) &&
                              tab == 'key'
                            "
                          >
                            <v-row
                              no-gutters
                              class="fill-height text-truncate"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.xs ? 'space-between' : 'start'
                              "
                            >
                              <span
                                class="mr-2 d-flex d-sm-none font-weight-bold"
                              >
                                Qty
                              </span>
                              <span
                                class="text-truncate mt-1 d-flex align-center"
                                :style="
                                  $vuetify.display.xs ? 'font-size: .8rem;' : ''
                                "
                              >
                                {{ item.raw?.qty || "N/A" }}
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="4"
                            md="2"
                            :class="`text text-capitalize text-body-2 ${
                              !$vuetify.display.smAndUp && 'mb-1'
                            }`"
                            v-if="
                              ($vuetify.display.mdAndUp ||
                                $vuetify.display.xs) &&
                              tab == 'key'
                            "
                          >
                            <v-row
                              no-gutters
                              class="fill-height text-truncate"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.xs ? 'space-between' : 'start'
                              "
                            >
                              <span
                                class="mr-2 d-flex d-sm-none font-weight-bold"
                              >
                                Description
                              </span>
                              <span
                                class="text-truncate mt-1 d-flex align-center"
                                :style="
                                  $vuetify.display.xs ? 'font-size: .8rem;' : ''
                                "
                              >
                                {{ item.raw?.description || "N/A" }}
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="4"
                            md="1"
                            :class="`text text-capitalize text-body-2 ${
                              !$vuetify.display.smAndUp && 'mb-1'
                            }`"
                            v-if="
                              ($vuetify.display.mdAndUp ||
                                $vuetify.display.xs) &&
                              tab == 'key'
                            "
                          >
                            <v-row
                              no-gutters
                              class="fill-height text-truncate"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.xs ? 'space-between' : 'start'
                              "
                            >
                              <span
                                class="mr-2 d-flex d-sm-none font-weight-bold"
                              >
                                Location
                              </span>
                              <span
                                class="text-truncate mt-1 d-flex align-center"
                                :style="
                                  $vuetify.display.xs ? 'font-size: .8rem;' : ''
                                "
                              >
                                <v-icon
                                  :class="`${$vuetify.display.smAndUp ? 'mr-1' : 'mr-1'}`"
                                >
                                  mdi-map-marker
                                </v-icon>

                                {{ item.raw?.location || "N/A" }}
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="4"
                            md="1"
                            class="text text-capitalize"
                          >
                            <v-row
                              no-gutters
                              class="fill-height text-truncate"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.xs ? 'space-between' : 'start'
                              "
                            >
                              <span
                                class="mr-2 d-flex d-sm-none font-weight-bold"
                              >
                                Status:
                              </span>
                              <span
                                class="text-truncate text-capitalize mt-1 text-body-2"
                                :style="
                                  $vuetify.display.xs ? 'font-size: .8rem;' : ''
                                "
                              >
                                <v-chip
                                  v-if="item.raw.status"
                                  size="small"
                                  class="text-white"
                                  :style="`background-color: ${
                                    item.raw.status == 'Available'
                                      ? '#4CAF50'
                                      : '#F44336'
                                  }`"
                                >
                                  {{ item.raw.status }}
                                </v-chip>
                              </span>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="4"
                            :md="tab !== 'key' ? 4 : 3"
                            class="text text-capitalize"
                          >
                            <v-row
                              no-gutters
                              class="fill-height text-truncate"
                              align-content="center"
                              align="center"
                              :justify="
                                $vuetify.display.xs ? 'space-between' : 'start'
                              "
                            >
                              <span
                                class="mr-2 d-flex d-sm-none font-weight-bold"
                              >
                                Last update:
                              </span>
                              <span
                                class="text-truncate mt-1 text-body-2"
                                :style="
                                  $vuetify.display.xs ? 'font-size: .8rem;' : ''
                                "
                              >
                                <v-icon
                                  size="small"
                                  :class="`${$vuetify.display.smAndUp ? 'mr-1' : 'mr-1'}`"
                                >
                                  mdi-calendar-month-outline
                                </v-icon>

                                {{
                                  standardFormatDateTime(
                                    item.raw.updatedAt || "",
                                  )
                                }}
                              </span>
                            </v-row>
                          </v-col>

                          <v-col cols="12" sm="1" class="mt-4 mt-sm-0">
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
                                  >
                                    mdi-dots-vertical
                                  </v-icon>
                                </template>
                                <v-list>
                                  <v-list-item
                                    v-if="$ability.can('update', 'edit-keys')"
                                    @click="
                                      navigateTo({
                                        name: 'keys-visitor-id-edit',
                                        params: { id: item.raw._id },
                                        query: { site: mySite, tab: tab },
                                      })
                                    "
                                    :disabled="
                                      item.raw.templateName || item.raw.parentId
                                    "
                                  >
                                    <template #title>
                                      <span class="text-caption"> Edit </span>
                                    </template>
                                  </v-list-item>
                                  <v-list-item
                                    v-if="
                                      ![
                                        'In Use',
                                        'Available',
                                        'Deleted',
                                      ].includes(item.raw.status)
                                    "
                                    @click="openDialog('available', item.raw)"
                                    :disabled="
                                      [
                                        'In Use',
                                        'Available',
                                        'Deleted',
                                      ].includes(item.raw.status)
                                    "
                                  >
                                    <template #title>
                                      <span class="text-caption">
                                        Available
                                      </span>
                                    </template>
                                  </v-list-item>
                                  <v-list-item
                                    v-if="
                                      item.raw.status !== 'Deleted' &&
                                      $ability.can('delete', 'delete-keys')
                                    "
                                    @click="openDialog('delete', item.raw)"
                                    :disabled="
                                      ['In Use', 'Deleted'].includes(
                                        item.raw.status,
                                      )
                                    "
                                  >
                                    <template #title>
                                      <span class="text-caption"> Delete </span>
                                    </template>
                                  </v-list-item>
                                  <v-list-item
                                    v-if="
                                      item.raw.status == 'Deleted' &&
                                      $ability.can('delete', 'delete-keys')
                                    "
                                    @click="openDialog('undelete', item.raw)"
                                    :disabled="item.raw.status !== 'Deleted'"
                                  >
                                    <template #title>
                                      <span class="text-caption">
                                        Undelete
                                      </span>
                                    </template>
                                  </v-list-item>
                                  <!-- <v-list-item
                                    @click="printPassKeyDialog(item.raw)"
                                    :disabled="
                                      item.raw.status == 'Deleted' ||
                                      !item.raw.templateName
                                    "
                                  >
                                    <template #title>
                                      <span class="text-caption"> Print </span>
                                    </template>
                                  </v-list-item> -->
                                  <v-list-item
                                    @click="
                                      navigateTo({
                                        name: 'keys-visitor-vms-logs',
                                        query: {
                                          site: mySite,
                                          type: item.raw.passType,
                                          id: item.raw._id,
                                          prefixName: item.raw.prefixAndName,
                                        },
                                      })
                                    "
                                  >
                                    <template #title>
                                      <span class="text-caption">
                                        VMS logs
                                      </span>
                                    </template>
                                  </v-list-item>
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
                        src="/empty.svg"
                        width="100px"
                        height="100px"
                      ></v-img>
                    </v-row>
                  </v-col>

                  <v-col cols="12">
                    <v-row no-gutters justify="center">
                      <span class="font-weight-bold"> No data found. </span>
                    </v-row>
                  </v-col>
                </v-row>
              </template>
            </v-data-iterator>
          </v-col>

          <v-divider></v-divider>

          <!-- pagination -->
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
                    sites: [mySite],
                    search,
                    passTypes: filterByPassType.value
                      ? [filterByPassType.value]
                      : tab !== 'key'
                        ? ['visitor-pass', 'contractor-pass', 'agent-pass']
                        : ['pass-key'],
                    statuses:
                      filterByPassStatus.length === 0 ||
                      filterByPassStatus[0] === null
                        ? null
                        : filterByPassStatus.map((item) => item.value),
                    template:
                      tab !== 'key'
                        ? templateQuery || filterByTemplateName._id
                        : null,
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
                    sites: [mySite],
                    search,
                    passTypes: filterByPassType.value
                      ? [filterByPassType.value]
                      : tab !== 'key'
                        ? ['visitor-pass', 'contractor-pass', 'agent-pass']
                        : ['pass-key'],
                    statuses:
                      filterByPassStatus.length === 0 ||
                      filterByPassStatus[0] === null
                        ? null
                        : filterByPassStatus.map((item) => item.value),
                    template:
                      tab !== 'key'
                        ? templateQuery || filterByTemplateName._id
                        : null,
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

    <!-- dialog -->
    <v-dialog
      v-model="dialog"
      transition="dialog-right-transition"
      fullscreen
      persistent
      :style="
        $vuetify.display.smAndDown
          ? 'max-width: 100vw;'
          : 'max-width: 500px; margin-right: 0; margin-left: auto;'
      "
    >
      <v-card>
        <v-toolbar>
          <v-btn
            icon="mdi-arrow-left"
            @click="
              !generatePass
                ? closeDialog()
                : ((generatePass = false),
                  (selectedTemplate = null),
                  (type = null))
            "
          />
          <v-toolbar-title class="text-capitalize">
            {{
              !["delete", "generate"].includes(dialogType)
                ? "Create"
                : dialogType !== "delete"
                  ? "Generate"
                  : "Delete"
            }}
            {{ tab }}
          </v-toolbar-title>
          <v-btn icon="mdi-close" @click="closeDialog"></v-btn>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text>
          <!-- generate -->
          <v-row
            v-if="dialogType == 'generate'"
            class="align-center text-center"
          >
            <v-col cols="12" class="mt-10">
              <v-row class="justify-center mb-7">
                <v-img
                  src="/images/undraw_team_page.svg"
                  width="190px"
                  height="190px"
                ></v-img>
              </v-row>
            </v-col>
            <v-col v-if="!generatePass" cols="12">
              <v-btn
                v-if="$ability.can('create', 'create-keys')"
                color="#1867C0"
                class="my-4 w-100 rounded-lg"
                height="52px"
                :to="{
                  name: 'keys-visitor-pass-add',
                  query: {
                    site: mySite,
                    tab: tab,
                  },
                }"
              >
                Create {{ tab }}
              </v-btn>

              <v-btn
                v-if="$ability.can('create', 'create-keys') && tab !== 'key'"
                color="#1867C0"
                class="mt-4 w-100 rounded-lg"
                height="52px"
                @click="generatePass = true"
              >
                Generate multiple pass
              </v-btn>
            </v-col>
            <v-col v-else cols="12">
              <v-row no-gutters justify="center">
                <!-- template -->

                <!-- <v-col cols="12" md="10">
                  <v-autocomplete
                    v-model="selectedTemplate"
                    :items="
                      templateList.filter(
                        (item) =>
                          !['All', 'Manually Added'].includes(item.name),
                      )
                    "
                    item-title="name"
                    item-value="_id"
                    return-object
                    placeholder="Select template"
                    density="comfortable"
                    hide-details
                    :rules="[requiredInput]"
                    clearable
                    @update:modelValue="onSelectByTemplate(selectedTemplate)"
                  >
                    <template v-slot:label>
                      Select template
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-autocomplete>
                </v-col> -->

                <v-col cols="12" md="10">
                  <v-autocomplete
                    v-model="selectedTemplate"
                    :items="
                      templateList.filter(
                        (item) =>
                          !['All', 'Manually Added'].includes(item.name),
                      )
                    "
                    item-title="name"
                    item-value="_id"
                    return-object
                    placeholder="Select template"
                    density="comfortable"
                    hide-details
                    :rules="[requiredInput]"
                    clearable
                    @update:modelValue="onSelectByTemplate(selectedTemplate)"
                    @update:search="(query: string) => searchTemplate(query)"
                  >
                    <template v-slot:label>
                      Select template
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                    <template v-slot:append-item>
                      <div v-intersect="endIntersect" />
                    </template>
                  </v-autocomplete>
                </v-col>

                <!-- type -->
                <v-col cols="12" md="10" class="mt-6">
                  <v-autocomplete
                    v-model="type"
                    density="comfortable"
                    :items="
                      passTypes?.filter((item: any) => item.title !== 'All')
                    "
                    hide-details
                    :rules="[requiredInput]"
                    @update:modelValue="onSelectByPassType(type)"
                  >
                    <template v-slot:label>
                      Select type
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-autocomplete>
                </v-col>

                <!-- next number -->
                <v-col cols="12" md="10" class="mt-6">
                  <v-card
                    class="px-4"
                    elevation="0"
                    :loading="isGettingNextNumber"
                    style="
                      display: flex;
                      height: 48px;
                      padding: var(--f-spacing-0, 0px) 16px;
                      justify-content: space-between;
                      align-items: center;
                      align-self: stretch;
                      border-radius: 4px;
                      border: 1px solid #ececec;
                      background: var(--Off-white, #fafafa);
                    "
                  >
                    <div>Next Number</div>
                    <div>{{ nextNumber }}</div>
                  </v-card>
                </v-col>
                <!-- quantity -->
                <v-col cols="12" md="10" class="mt-6">
                  <v-text-field
                    v-model="quantity"
                    density="comfortable"
                    hide-details
                    :rules="[requiredInput]"
                    clearable
                    :disabled="!selectedTemplate"
                  >
                    <template v-slot:label>
                      Quantity
                      <span class="text-red font-weight-bold">*</span>
                    </template>
                  </v-text-field>
                </v-col>
                <!-- to number-->
                <v-col cols="12" md="10" class="mt-6">
                  <v-card
                    class="px-4"
                    elevation="0"
                    :loading="isGettingToNumber"
                    style="
                      display: flex;
                      height: 48px;
                      padding: var(--f-spacing-0, 0px) 16px;
                      justify-content: space-between;
                      align-items: center;
                      align-self: stretch;
                      border-radius: 4px;
                      border: 1px solid #ececec;
                      background: var(--Off-white, #fafafa);
                    "
                  >
                    <div>To Number</div>
                    <div>{{ toNumber }}</div>
                  </v-card>
                </v-col>

                <!-- generate -->
                <v-col cols="12" md="10" class="mt-4">
                  <v-btn
                    block
                    size="large"
                    color="#1867C0"
                    @click="generatePassKeys()"
                    :disabled="!selectedTemplate || !type || quantity < 1"
                    :loading="isGenerating"
                  >
                    Generate
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <!-- delete/undelete/available -->
          <v-row
            v-else
            no-gutters
            justify="center"
            class="fill-height"
            align-content="center"
          >
            <v-col cols="12">
              <v-img height="129px" src="/images/keys/trash.svg"></v-img>
              <div class="mt-6 text-center">
                Are you sure you want to
                {{ dialogType !== "delete" ? "make" : dialogType }}
                <span class="font-weight-bold">
                  {{ passKey?.prefixAndName }}
                </span>
                {{
                  ["undelete", "available"].includes(dialogType)
                    ? "available"
                    : null
                }}?
              </div>
            </v-col>
            <v-col cols="12" class="mt-6 text-center">
              <v-btn
                flat
                color="#1867C0"
                size="large"
                class="mx-6 mb-6"
                @click="updateStatus()"
                :loading="isUpdatingStatus"
              >
                Yes
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <Qr-TemplatePrintDialog
      :open="openPrintDialog"
      :templateList="templateList"
      :template="printPassKey ? selectedPassKey : filterByTemplateName"
      :type="
        printPassKey
          ? selectedPassKey?.passType == 'pass-key'
            ? 'key'
            : 'pass'
          : ''
      "
      :orientation="
        printPassKey
          ? selectedPassKey?.passType == 'pass-key'
            ? 'KeyCard'
            : ''
          : ''
      "
      :start="printPassKey ? selectedPassKey?.passKeyName : ''"
      @update:open="openPrintDialog = $event"
      @update:close="closePrintPassKeyDialog"
    />
  </v-row>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

definePageMeta({
  middleware: ["secure", "site"],
});
const { $ability } = useNuxtApp();
const { mySite } = useFilter();
const { requiredInput, standardFormatDateTime } = useUtils();
const { setSnackbar } = useLocal();

const templateQuery = ref(useRoute().query?.template);

const { getTemplatesByPageSearch } = useTemplateReusable();

const { passTypes, passTypesStatus } = useKey();

const {
  tab,
  setPassKey,
  setPassKeys,
  search,
  isPassKeysLoading,
  passKey,
  passKeys,
  itemsPerPage,
  page,
  pageRange,
  canNextPage,
  nextPage,
  canPrevPage,
  prevPage,
  getNextNumber,
  generatePassesKeys,
  dialog,
  dialogType,
  generatePass,
  selectedTemplate,
} = usePassKey();

const { updateKeyById } = useKey();

const isTemplateListLoading = ref(false);
const templateList = ref<any>([]);
const filterByTemplateName = ref({ _id: null, name: "All" });
const filterByPassType = ref<any>({ title: "All", value: null });
const filterByPassStatus = ref([]);

const openPrintDialog = ref(false);

const type = ref(null);
const isGettingNextNumber = ref(false);
const isGettingToNumber = ref(false);
const nextNumberResult = ref<any>("0");
const nextNumber = ref("N/A");
const toNumber = ref("N/A");
const quantity = ref<any>(null);
const isGenerating = ref(false);

const isUpdatingStatus = ref(false);

const printPassKey = ref<boolean>(false);
const selectedPassKey = ref<any>();

onMounted(async () => {
  const isKeyExist = passTypes.value.find(
      (item: any) => item.value == "pass-key",
    ),
    isAllExist = passTypes.value.find((item: any) => item.title == "All");

  if (!isKeyExist) {
    passTypes.value.push({ title: "Pass Key", value: "pass-key" });
  }

  if (!isAllExist) {
    passTypes.value.unshift({ title: "All", value: null });
  }
  if (tab.value !== "key") {
    passTypes.value = passTypes.value.filter(
      (passKey: any) => passKey.value !== "pass-key",
    );
  }

  await getTemplateNameList();
  await updateFilter();
});

async function switchTab(Tab: string) {
  tab.value = Tab;
  page.value = 1;
  passTypes.value = [];
  if (tab.value !== "key") {
    passTypes.value = [
      { title: "All", value: null },
      { title: "Visitor Pass", value: "visitor-pass" },
      { title: "Contractor Pass", value: "contractor-pass" },
      { title: "Agent Pass", value: "agent-pass" },
    ];
  } else {
    passTypes.value = [{ title: "Key", value: "pass-key" }];
  }
  filterByPassType.value = passTypes.value[0];
  await updateFilter();
}

async function updateFilter() {
  try {
    // fetch data
    let statuses =
      filterByPassStatus.value.length === 0 ||
      filterByPassStatus.value[0]?.value === null
        ? null
        : filterByPassStatus.value.map((item: any) => item.value);

    await setPassKeys({
      sites: [mySite.value],
      search: search.value,
      template:
        tab.value !== "key"
          ? templateQuery.value || filterByTemplateName.value._id
          : null,
      statuses,
      passTypes: filterByPassType.value.value
        ? [filterByPassType.value.value]
        : tab.value !== "key"
          ? ["visitor-pass", "contractor-pass", "agent-pass"]
          : ["pass-key"],
    });
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}

const totalNumberOfPagesTemplateList = ref(0);

const getTemplateNameList = async (page = 1, query = "") => {
  isTemplateListLoading.value = true;

  const result = await getTemplatesByPageSearch({
    sites: [mySite.value],
    limit: 2000,
    page: page,
    statuses: ["active"],
    search: query,
  });

  totalNumberOfPagesTemplateList.value = result?.pages;
  if (result?.items.length) {
    const newItems = result?.items.map((item) => ({
      _id: item._id,
      name: item.name,
      prefixPass: item.prefixPass,
      prefixKey: item.prefixKey,
    }));

    if (page === 1) {
      newItems.unshift({ _id: null, name: "All" });
      newItems.push({ _id: "Manually Added", name: "Manually Added" });
    }

    templateList.value = [...templateList.value, ...newItems];
  }

  isTemplateListLoading.value = false;
};
const endIntersect = async (isIntersecting) => {
  if (isIntersecting && !isTemplateListLoading.value) {
    if (page.value < totalNumberOfPagesTemplateList.value) {
      page.value += 1;
      await getTemplateNameList(page.value);
    }
  }
};

const searchTemplate = async (query: string) => {
  isTemplateListLoading.value = true;

  const result: any = await getTemplatesByPageSearch({
    sites: [mySite.value],
    limit: 10,
    page: 1,
    statuses: ["active"],
    search: query,
  });

  if (result?.items.length) {
    templateList.value = result?.items.map((item: any) => ({
      _id: item._id,
      name: item.name,
      prefixPass: item.prefixPass,
      prefixKey: item.prefixKey,
    }));

    templateList.value.unshift({ _id: null, name: "All" });
    templateList.value.push({ _id: "Manually Added", name: "Manually Added" });
  }

  isTemplateListLoading.value = false;
};
watch(search, (newValue: string) => {
  debouncedSearch(newValue);
});

const debouncedSearch = debounce(async (value: string) => {
  search.value = value;
  page.value = 1;
  await updateFilter();
}, 500);

watch(quantity, async (newValue: any) => {
  const num = parseFloat(newValue);
  if (newValue && !isNaN(num) && num > 0 && num < 1001) {
    let prefix = selectedTemplate.value.prefixPass;
    if (type.value == "pass-key") {
      prefix = selectedTemplate.value.prefixKey;
    }
    toNumber.value = `${prefix}${(+nextNumberResult.value + +quantity.value - 1).toString().padStart(2, "0")}`;
  } else {
    quantity.value = null;
    toNumber.value = "N/A";
  }
});

// list
async function onFilterByPassType(passType: any) {
  page.value = 1;
  search.value = "";
  passType =
    passType.title === "All" ? { title: "All", value: null } : passType;
  filterByPassType.value = passType;
  await updateFilter();
}
async function onFilterByPassStatus(passTypeStatus: any) {
  page.value = 1;
  search.value = "";

  passTypeStatus =
    passTypeStatus.title === "All"
      ? { title: "All", value: null }
      : passTypeStatus;
  filterByPassStatus.value = passTypeStatus;
  await updateFilter();
}
async function onFilterByTemplateName(template: any) {
  page.value = 1;
  templateQuery.value = null;
  search.value = "";
  template = template.name === "All" ? { _id: null, name: "All" } : template;
  filterByTemplateName.value = template;
  await updateFilter();
}

function openDialog(data: string, item?: TPassKey) {
  setPassKey(item);

  dialog.value = true;
  dialogType.value = data;
}

// generate
async function onSelectByPassType(type: any) {
  templateList.value = [];
  if (type) {
    isGettingNextNumber.value = true;
    isGettingToNumber.value = true;

    if (selectedTemplate.value) {
      try {
        nextNumberResult.value = await getNextNumber({
          template: selectedTemplate.value._id,
          passType: type,
          site: mySite.value,
        });
        let prefix = selectedTemplate.value.prefixPass;
        if (type == "pass-key") {
          prefix = selectedTemplate.value.prefixKey;
        }
        nextNumber.value =
          nextNumberResult.value > 0
            ? `${prefix}${nextNumberResult.value}`
            : "N/A";

        toNumber.value =
          quantity.value > 0
            ? `${prefix}${(+nextNumberResult.value + +quantity.value - 1).toString().padStart(2, "0")}`
            : "N/A";
      } catch (error) {
        setSnackbar({ text: error as string, modal: true, type: "error" });
      }
      isGettingNextNumber.value = false;
      isGettingToNumber.value = false;
    }
    isGettingNextNumber.value = false;
    isGettingToNumber.value = false;
  } else {
    nextNumber.value = "N/A";
    toNumber.value = "N/A";
  }
}
async function onSelectByTemplate(template: any) {
  if (template && type.value) {
    isGettingNextNumber.value = true;
    isGettingToNumber.value = true;
    try {
      nextNumberResult.value = await getNextNumber({
        template: template._id,
        passType: type.value,
        site: mySite.value,
      });
      let prefix = template.prefixPass;
      if (type.value == "pass-key") {
        prefix = template.prefixKey;
      }
      nextNumber.value =
        nextNumberResult.value > 0
          ? `${prefix}${nextNumberResult.value}`
          : "N/A";

      toNumber.value =
        quantity.value > 0
          ? `${prefix}${(+nextNumberResult.value + +quantity.value - 1).toString().padStart(2, "0")}`
          : "N/A";
    } catch (error) {
      setSnackbar({ text: error as string, modal: true, type: "error" });
    }
    isGettingNextNumber.value = false;
    isGettingToNumber.value = false;
  } else {
    nextNumber.value = "N/A";
    toNumber.value = "N/A";
  }
}

// generate pass keys
async function generatePassKeys() {
  templateList.value = [];

  isGenerating.value = true;
  try {
    const result: any = await generatePassesKeys({
      template: selectedTemplate.value._id,
      passType: type.value,
      site: mySite.value,
      quantity: quantity.value,
      nextNumber: Number(nextNumberResult.value),
    });
    if (result?.newNextNumber || result?.newNextNumber == 0) {
      let prefix = selectedTemplate.value.prefixPass;
      if (type.value == "pass-key") {
        prefix = selectedTemplate.value.prefixKey;
      }
      nextNumber.value = `${prefix}${(result?.newNextNumber).toString().padStart(2, "0")}`;
      toNumber.value =
        quantity.value > 0
          ? `${prefix}${(+result?.newNextNumber + +quantity.value - 1).toString().padStart(2, "0")}`
          : "N/A";
      setSnackbar({
        text: `Generating failed. Next number has been updated to ${nextNumber.value}. You may try again.`,
        modal: true,
        type: "error",
      });
    } else {
      setSnackbar({
        text: "Generated successfully.",
        modal: true,
        type: "success",
      });

      await closeDialog();
      await updateFilter();
    }
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }

  templateList.value = [];
  await getTemplateNameList();
  isGenerating.value = false;
}

// delete
async function updateStatus() {
  isUpdatingStatus.value = true;
  // delete
  try {
    await updateKeyById(passKey.value._id as string, {
      ...passKey.value,
      status: dialogType.value == "delete" ? "Deleted" : "Undelete",
      site: mySite.value,
    });
    // await updateKeyById(passKey.value._id as string, {
    //   ...passKey.value,
    //   status: dialogType.value == "delete" ? "Deleted" : "Available",
    //   site: mySite.value,
    // });
    await closeDialog();
    await updateFilter();
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
  isUpdatingStatus.value = false;
}

// function printPassKeyDialog(item: any) {
//   selectedPassKey.value = {
//     _id: templateList.value.find((i: any) => i._id == item.template)._id,
//     name: templateList.value.find((i: any) => i._id == item.template).name,
//     passType: item.passType,
//     passKeyName: item.name,
//   };

//   printPassKey.value = true;
//   openPrintDialog.value = true;
// }

function closePrintPassKeyDialog() {
  selectedPassKey.value = null;
  printPassKey.value = false;
  openPrintDialog.value = false;
}

async function closeDialog() {
  dialog.value = false;
  generatePass.value = false;
  type.value = null;
  selectedTemplate.value = null;
  nextNumber.value = "N/A";
  toNumber.value = "N/A";
  page.value = 1;
  templateList.value = [];

  await nextTick();
  await getTemplateNameList();

  setPassKey();
}

async function goBack() {
  await navigateTo({
    path: "/keys/manage-pass-template",
  });
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

:deep() .v-field__field {
  font-size: 14px;
}

.overridePicker {
  width: 18px;
}
</style>
