<template>
  <v-dialog
    v-model="props.open"
    transition="dialog-bottom-transition"
    fullscreen
  >
    <v-card>
      <v-toolbar style="background-color: white">
        <v-btn icon="mdi-arrow-left" @click="closeDialog"></v-btn>

        <v-toolbar-title>Pass & Keys</v-toolbar-title>

        <v-spacer></v-spacer>
        <!-- 
        <v-toolbar-items>
          <v-btn text="Save" variant="text" @click="closeDialog"></v-btn>
        </v-toolbar-items> -->
      </v-toolbar>
      <v-row no-gutters class="pa-15">
        <v-col cols="12">
          <v-card class="pa-6">
            <v-row no-gutters>
              <v-col
                cols="12"
                sm="6"
                md="6"
                lg="6"
                xl="6"
                class="d-flex align-center"
              >
                <h3 class="text-h5 font-weight-bold text-capitalize">
                  Print {{ tab }}
                </h3>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="6"
                lg="6"
                xl="6"
                class="d-flex justify-end"
              >
                <!-- <v-btn color="primary"> Preview Template</v-btn> -->
              </v-col>
            </v-row>
            <v-row no-gutters class="pt-6" justify="end">
              <!-- <v-col
                cols="12"
                sm="6"
                md="6"
                lg="6"
                xl="6"
                class="d-flex align-center"
              >
                <h3 class="text-subtitle-1">Design Template</h3>
              </v-col> -->
              <v-col
                cols="12"
                sm="6"
                md="6"
                lg="6"
                xl="6"
                class="d-flex justify-end align-center"
              >
                <!-- <span class="text-body-2" style="color: blue"
                  >Edit template</span
                > -->
              </v-col>
            </v-row>
            <!-- <v-row no-gutters class="pt-6">
              <v-col cols="12" class="d-flex align-center">
                <v-autocomplete
                  :items="['pass', 'key']"
                  v-model="tab"
                  hide-details
                >
                  <template v-slot:label>
                    Select Type
                    <span class="text-red font-weight-bold">*</span>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row> -->
            <v-row v-if="tab == 'pass'" no-gutters class="pt-6">
              <!-- <v-col cols="12" class="d-flex align-center">
                <v-autocomplete
                  :items="
                    templateList.filter(
                      (item) => !['All', 'Manually Added'].includes(item.name),
                    )
                  "
                  item-title="name"
                  item-value="_id"
                  v-model="selectedTemplate"
                  return-object
                  hide-details
                  @update:modelValue="fetchTemplateData('active')"
                  :loading="isFetchingTemplates"
                >
                  <template v-slot:label>
                    Select template
                    <span class="text-red font-weight-bold">*</span>
                  </template>
                </v-autocomplete>
              </v-col> -->

              <v-col cols="12" class="d-flex align-center">
                <v-autocomplete
                  :items="
                    localTemplateList.filter(
                      (item) => !['All', 'Manually Added'].includes(item.name),
                    )
                  "
                  item-title="name"
                  item-value="_id"
                  v-model="selectedTemplate"
                  return-object
                  hide-details
                  @update:modelValue="fetchTemplateData('active')"
                  @update:search="(query: string) => searchTemplate(query)"
                  :loading="isFetchingTemplates"
                >
                  <template v-slot:label>
                    Select template
                    <span class="text-red font-weight-bold">*</span>
                  </template>
                  <template v-slot:append-item>
                    <div v-intersect="endIntersectTemplateList" />
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row
              v-if="tab !== 'key' && selectedTemplate?._id"
              no-gutters
              class="pt-2"
            >
              <v-col cols="12" class="d-flex justify-start">
                <h3 class="text-subtitle-1">Paper Size & Orientation</h3>
              </v-col>
            </v-row>

            <v-row no-gutters class="pt-2">
              <v-col
                v-if="tab == 'pass' && selectedTemplate?._id"
                cols="12"
                sm="6"
                md="6"
                lg="3"
                xl="3"
                class="d-flex align-center"
              >
                <v-text-field
                  placeholder="A4"
                  @focus="selectedChoicePaperSizeOrientation = 'A4'"
                  readonly
                  :hint="
                    templateQrCode?.A4Enabled
                      ? ''
                      : 'Currently disabled in this template.'
                  "
                  class="placeHolderDarken"
                  :disabled="!templateQrCode?.A4Enabled || tab !== 'pass'"
                >
                  <template v-slot:append-inner>
                    <v-icon
                      @click="selectedChoicePaperSizeOrientation = 'A4'"
                      :color="
                        selectedChoicePaperSizeOrientation === 'A4'
                          ? 'green'
                          : ''
                      "
                    >
                      {{
                        selectedChoicePaperSizeOrientation === "A4"
                          ? "mdi-check-circle"
                          : "mdi-check-circle-outline"
                      }}
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col>

              <v-col
                v-if="tab == 'pass' && selectedTemplate?._id"
                cols="12"
                sm="6"
                md="6"
                lg="3"
                xl="3"
                class="d-flex justify-end align-center pl-1"
              >
                <v-text-field
                  placeholder="Credit Card (Portrait)"
                  @focus="selectedChoicePaperSizeOrientation = 'CCP'"
                  readonly
                  :hint="
                    templateQrCode?.CCEnabled
                      ? ''
                      : 'Currently disabled in this template.'
                  "
                  class="placeHolderDarken"
                  :disabled="
                    !templateQrCode?.CCEnabled ||
                    templateQrCode?.CCOrientation === 'landscape' ||
                    tab !== 'pass'
                  "
                >
                  <template v-slot:append-inner>
                    <v-icon
                      @click="selectedChoicePaperSizeOrientation = 'CCP'"
                      :color="
                        selectedChoicePaperSizeOrientation === 'CCP'
                          ? 'green'
                          : ''
                      "
                    >
                      {{
                        selectedChoicePaperSizeOrientation === "CCP"
                          ? "mdi-check-circle"
                          : "mdi-check-circle-outline"
                      }}
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col>
              <v-col
                v-if="tab == 'pass' && selectedTemplate?._id"
                cols="12"
                sm="6"
                md="6"
                lg="3"
                xl="3"
                class="d-flex justify-end align-center pl-1"
              >
                <v-text-field
                  placeholder="Credit Card (Landscape)"
                  @focus="selectedChoicePaperSizeOrientation = 'CCL'"
                  readonly
                  :hint="
                    templateQrCode?.CCEnabled
                      ? ''
                      : 'Currently disabled in this template.'
                  "
                  class="placeHolderDarken"
                  :disabled="
                    !templateQrCode?.CCEnabled ||
                    templateQrCode?.CCOrientation === 'portrait' ||
                    tab !== 'pass'
                  "
                >
                  <template v-slot:append-inner>
                    <v-icon
                      @click="selectedChoicePaperSizeOrientation = 'CCL'"
                      :color="
                        selectedChoicePaperSizeOrientation === 'CCL'
                          ? 'green'
                          : ''
                      "
                    >
                      {{
                        selectedChoicePaperSizeOrientation === "CCL"
                          ? "mdi-check-circle"
                          : "mdi-check-circle-outline"
                      }}
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col>
              <!-- <v-col
                v-if="tab == 'key'"
                cols="12"
                sm="6"
                md="6"
                lg="3"
                xl="3"
                class="d-flex justify-end align-center pl-1"
              >
                <v-text-field
                  placeholder="Key Card"
                  @focus="selectedChoicePaperSizeOrientation = 'KeyCard'"
                  readonly
                  :hint="
                    showKeyCard || tab == 'key'
                      ? ''
                      : 'Please select Key as type to enable.'
                  "
                  class="placeHolderDarken"
                  :disabled="!showKeyCard || tab !== 'key'"
                >
                  <template v-slot:append-inner>
                    <v-icon
                      @click="selectedChoicePaperSizeOrientation = 'KeyCard'"
                      :color="
                        selectedChoicePaperSizeOrientation === 'KeyCard'
                          ? 'green'
                          : ''
                      "
                    >
                      {{
                        selectedChoicePaperSizeOrientation === "KeyCard"
                          ? "mdi-check-circle"
                          : "mdi-check-circle-outline"
                      }}
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col> -->
            </v-row>
            <v-row
              v-if="tab == 'pass' && selectedChoicePaperSizeOrientation"
              no-gutters
              class="pt-2"
            >
              <v-col cols="12" class="d-flex justify-start">
                <h3 class="text-subtitle-1">Print range</h3>
              </v-col>
            </v-row>

            <v-row
              v-if="tab == 'pass' && selectedChoicePaperSizeOrientation"
              no-gutters
              class="pt-2"
            >
              <v-col
                cols="12"
                sm="6"
                md="6"
                lg="6"
                xl="6"
                class="d-flex align-center"
              >
                <v-autocomplete
                  label="Start"
                  :items="resultKeys2"
                  item-title="text"
                  item-value="value"
                  v-model="startRange"
                  @click="showSnackbarStartRange"
                  :loading="isFetchingPassKeys"
                  clearable
                >
                  <!-- <template v-slot:append-item>
                    <div v-intersect="endIntersect" />
                  </template> -->
                </v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                sm="1"
                md="1"
                lg="1"
                xl="1"
                class="d-flex justify-center pt-2"
              >
                <span>To</span>
              </v-col>
              <v-col
                cols="12"
                sm="5"
                md="5"
                lg="5"
                xl="5"
                class="d-flex justify-end align-center"
              >
                <v-autocomplete
                  label="End"
                  :items="endRangeKeys"
                  item-title="text"
                  item-value="value"
                  v-model="endRange"
                  @click="showSnackbarEndRange"
                  :disabled="!startRange"
                  :loading="isFetchingPassKeys"
                  clearable
                >
                  <!-- <template v-slot:append-item>
                    <div v-intersect="endIntersect" />
                  </template> -->
                </v-autocomplete>
              </v-col>
            </v-row>

            <v-row v-if="tab == 'key'" no-gutters class="pt-2">
              <v-col cols="3">
                <v-text-field
                  v-model="searchKey"
                  placeholder="Search"
                  hide-details
                  density="compact"
                  append-inner-icon="mdi-magnify"
                  :class="$vuetify.display.mdAndUp ? '' : ''"
                  clearable
                />
              </v-col>
              <v-col cols="12" class="mt-3">
                <v-card
                  width="100%"
                  elevation="0"
                  height="100%"
                  :loading="isFetchingPassKeys"
                >
                  <template v-slot:loader="{ isActive }">
                    <v-progress-linear
                      :active="isActive"
                      color="deep-purple"
                      height="4"
                      indeterminate
                    ></v-progress-linear>
                  </template>

                  <v-row no-gutters dense>
                    <v-col cols="12">
                      <v-data-iterator
                        :items="resultKeys2?.items"
                        :items-per-page="selectedPageRange"
                      >
                        <template v-slot:header>
                          <v-divider></v-divider>
                          <v-list
                            class="pa-0"
                            density="compact"
                            v-if="$vuetify.display.smAndUp"
                          >
                            <v-list-item class="px-8">
                              <v-list-item-title>
                                <v-row no-gutters>
                                  <v-col cols="12" md="1">
                                    <v-icon class="pt-6">
                                      <v-checkbox
                                        v-model="selectAll"
                                        @update:modelValue="selectAllKeys"
                                      ></v-checkbox>
                                    </v-icon>
                                  </v-col>
                                  <v-col cols="12" sm="7" md="1">
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
                                  <v-col cols="12" sm="7" md="3">
                                    <v-row
                                      no-gutters
                                      class="fill-height"
                                      align-content="center"
                                    >
                                      <span
                                        class="d-inline-block text-caption font-weight-bold"
                                      >
                                        Name
                                      </span>
                                    </v-row>
                                  </v-col>
                                  <v-col cols="12" sm="7" md="1">
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
                                  <v-col cols="12" sm="7" md="4">
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
                                  <v-col cols="12" sm="7" md="2">
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
                                  <!-- <v-col cols="12" sm="7" md="1">
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
                                  </v-col> -->
                                </v-row>
                              </v-list-item-title>
                            </v-list-item>
                            <v-divider />
                          </v-list>
                        </template>

                        <template #default="{ items }">
                          <v-list class="pa-0" density="compact">
                            <template
                              v-for="(item, itemIndex) in items"
                              :key="item.raw?._id"
                            >
                              <v-list-item class="py-0 px-8">
                                <v-list-item-title>
                                  <v-row no-gutters>
                                    <v-col cols="12" md="1">
                                      <v-row no-gutters class="pt-6">
                                        <v-icon>
                                          <v-checkbox
                                            v-model="selectedKeysToPrint"
                                            :value="item.raw"
                                          ></v-checkbox>
                                        </v-icon>
                                      </v-row>
                                    </v-col>

                                    <v-col
                                      cols="12"
                                      sm="7"
                                      md="1"
                                      :class="`text-capitalize text-body-2 white--text text ${$vuetify.display.xs && 'mb-1'}`"
                                    >
                                      <v-row
                                        no-gutters
                                        class="fill-height text-truncate"
                                        align-content="center"
                                        align="center"
                                        :justify="
                                          $vuetify.display.xs
                                            ? 'space-between'
                                            : 'start'
                                        "
                                      >
                                        <span
                                          class="mr-2 d-flex d-sm-none font-weight-bold"
                                        >
                                          Key #:
                                        </span>
                                        <span
                                          class="d-flex flex-column text-truncate"
                                        >
                                          <span
                                            class="text-truncate mt-1"
                                            :style="
                                              $vuetify.display.xs
                                                ? 'font-size: .8rem;'
                                                : ''
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
                                        </span>
                                      </v-row>
                                    </v-col>

                                    <v-col
                                      cols="12"
                                      sm="7"
                                      md="3"
                                      :class="`text-capitalize text-body-2 white--text text ${$vuetify.display.xs && 'mb-1'}`"
                                    >
                                      <v-row
                                        no-gutters
                                        class="fill-height text-truncate"
                                        align-content="center"
                                        align="center"
                                        :justify="
                                          $vuetify.display.xs
                                            ? 'space-between'
                                            : 'start'
                                        "
                                      >
                                        <span
                                          class="mr-2 d-flex d-sm-none font-weight-bold"
                                        >
                                          Name:
                                        </span>
                                        <span
                                          class="d-flex flex-column text-truncate"
                                        >
                                          <span
                                            class="text-truncate mt-1"
                                            :style="
                                              $vuetify.display.xs
                                                ? 'font-size: .8rem;'
                                                : ''
                                            "
                                          >
                                            {{ item.raw.prefixAndName }}
                                          </span>
                                        </span>
                                      </v-row>
                                    </v-col>

                                    <v-col
                                      cols="12"
                                      sm="7"
                                      md="1"
                                      :class="`text-capitalize text-body-2 white--text text ${$vuetify.display.xs && 'mb-1'}`"
                                    >
                                      <v-row
                                        no-gutters
                                        class="fill-height text-truncate"
                                        align-content="center"
                                        align="center"
                                        :justify="
                                          $vuetify.display.xs
                                            ? 'space-between'
                                            : 'start'
                                        "
                                      >
                                        <span
                                          class="mr-2 d-flex d-sm-none font-weight-bold"
                                        >
                                          Type:
                                        </span>
                                        <span
                                          class="d-flex flex-column text-truncate"
                                        >
                                          <span
                                            class="text-truncate mt-1"
                                            :style="
                                              $vuetify.display.xs
                                                ? 'font-size: .8rem;'
                                                : ''
                                            "
                                          >
                                            {{
                                              !item.raw?.parentId
                                                ? "Original"
                                                : "Duplicate"
                                            }}
                                          </span>
                                        </span>
                                      </v-row>
                                    </v-col>

                                    <v-col
                                      cols="12"
                                      sm="7"
                                      md="4"
                                      :class="`text-capitalize text-body-2 white--text text ${$vuetify.display.xs && 'mb-1'}`"
                                    >
                                      <v-row
                                        no-gutters
                                        class="fill-height text-truncate"
                                        align-content="center"
                                        align="center"
                                        :justify="
                                          $vuetify.display.xs
                                            ? 'space-between'
                                            : 'start'
                                        "
                                      >
                                        <span
                                          class="mr-2 d-flex d-sm-none font-weight-bold"
                                        >
                                          Description:
                                        </span>
                                        <span
                                          class="d-flex flex-column text-truncate"
                                        >
                                          <span
                                            class="text-truncate mt-1"
                                            :style="
                                              $vuetify.display.xs
                                                ? 'font-size: .8rem;'
                                                : ''
                                            "
                                          >
                                            {{ item.raw?.description || "N/A" }}
                                          </span>
                                        </span>
                                      </v-row>
                                    </v-col>

                                    <v-col
                                      cols="12"
                                      sm="7"
                                      md="2"
                                      :class="`text-capitalize text-body-2 white--text text ${$vuetify.display.xs && 'mb-1'}`"
                                    >
                                      <v-row
                                        no-gutters
                                        class="fill-height text-truncate"
                                        align-content="center"
                                        align="center"
                                        :justify="
                                          $vuetify.display.xs
                                            ? 'space-between'
                                            : 'start'
                                        "
                                      >
                                        <span
                                          class="mr-2 d-flex d-sm-none font-weight-bold"
                                        >
                                          Location:
                                        </span>
                                        <span
                                          class="d-flex flex-column text-truncate"
                                        >
                                          <span
                                            class="text-truncate mt-1"
                                            :style="
                                              $vuetify.display.xs
                                                ? 'font-size: .8rem;'
                                                : ''
                                            "
                                          >
                                            {{ item.raw?.location || "N/A" }}
                                          </span>
                                        </span>
                                      </v-row>
                                    </v-col>

                                    <!-- <v-col
                                      cols="12"
                                      sm="7"
                                      md="1"
                                      :class="`text-capitalize text-body-2 white--text text ${$vuetify.display.xs && 'mb-1'}`"
                                    >
                                      <v-row
                                        no-gutters
                                        class="fill-height text-truncate"
                                        align-content="center"
                                        align="center"
                                        :justify="
                                          $vuetify.display.xs
                                            ? 'space-between'
                                            : 'start'
                                        "
                                      >
                                        <span
                                          class="mr-2 d-flex d-sm-none font-weight-bold"
                                        >
                                          Status:
                                        </span>
                                        <span
                                          class="d-flex flex-column text-truncate"
                                        >
                                          <span
                                            class="text-truncate mt-1"
                                            :style="
                                              $vuetify.display.xs
                                                ? 'font-size: .8rem;'
                                                : ''
                                            "
                                          >
                                            {{ item.raw?.status || "N/A" }}
                                          </span>
                                        </span>
                                      </v-row>
                                    </v-col> -->
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
                                  No key(s) found.
                                </span>
                              </v-row>
                            </v-col>
                          </v-row>
                        </template>
                      </v-data-iterator>
                    </v-col>

                    <v-divider></v-divider>

                    <!-- pagination -->
                    <v-col cols="12" class="py-4">
                      <v-row no-gutters justify="space-between">
                        <v-col cols="2">
                          <v-select
                            :items="pageRanges"
                            v-model="selectedPageRange"
                            label="Select items per page"
                            class="mx-2"
                            hide-details
                            @update:modelValue="updateItemsPerPage"
                          />
                        </v-col>

                        <v-col cols="3" class="text-end">
                          <span>{{ resultKeys2?.pageRange }}</span>
                          <v-btn
                            density="compact"
                            variant="text"
                            icon
                            class="mx-2"
                            :disabled="canPrevPage"
                            @click="prevPage()"
                          >
                            <v-icon>mdi-chevron-left</v-icon>
                          </v-btn>
                          <v-btn
                            density="compact"
                            variant="text"
                            icon
                            class="mx-2"
                            :disabled="!canNextPage"
                            @click="nextPage()"
                          >
                            <v-icon>mdi-chevron-right</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>

            <v-row no-gutters class="pt-2">
              <v-col cols="12" class="d-flex justify-end">
                <v-btn
                  color="primary"
                  @click="printContent"
                  :disabled="
                    tab !== 'key'
                      ? !selectedChoicePaperSizeOrientation ||
                        !selectedTemplate?._id ||
                        !startRange ||
                        !endRange
                      : !selectedKeysToPrint.length
                  "
                >
                  Print
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>

  <!-- start range dialog -->
  <v-snackbar
    v-model="snackbarStartRange"
    color="red"
    :timeout="5000"
    multi-line
  >
    No {{ tab == "key" ? "Key" : "Pass" }} found. Please try to generate first.
    <v-btn
      flat
      size="small"
      class="ml-1 mb-1"
      variant="outlined"
      @click="closeDialog('generate', tab)"
    >
      generate
    </v-btn>
    <template v-slot:actions>
      <v-btn
        color="white"
        variant="text"
        @click="snackbarStartRange = false"
        icon="mdi-close"
      >
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";
import site from "~/middleware/site";
const { templateQrCode, getTemplatesByPageSearch } = useTemplateReusable();
const { mySite } = useFilter();

const {
  tab,
  dialog,
  dialogType,
  generatePass,
  selectedTemplate,
  getPassKeysByPageSearch,
  selectedKeysToPrint,
} = usePassKey();

const { setSnackbar } = useLocal();

const props = defineProps<{
  open: Boolean;
  templateList: Array;
  template: any;
  type: any;
  orientation: any;
  start: any;
}>();

const route = useRoute();

const { currentUser } = useLocalAuth();

const emit = defineEmits(["update:close"]);

const selectedChoicePaperSizeOrientation = ref<any>(null);

const resultKeys2 = ref<any>([]);
const startRange = ref<any>(null);
const endRange = ref<any>(null);
const prefixAndName = ref<string>("");
const showKeyCard = ref<boolean>(false);

const snackbarEndRange = ref<boolean>(false);
const snackbarStartRange = ref<boolean>(false);

const isFetchingTemplates = ref<boolean>(false);
const isFetchingPassKeys = ref<boolean>(false);

const resultPass = ref<any>(null);

const searchKey = ref("");
const totalPages = ref(0);
const canNextPage = computed(() => totalPages.value > page.value);
const canPrevPage = computed(() => page.value <= 1);
const pageRanges = ref([10, 25, 50, 100, 500, 1000]);
const selectedPageRange = ref(10);

const selectAll = ref(false);
const localTemplateList = ref([]);

watch(
  () => props.templateList,
  (newVal) => {
    localTemplateList.value = newVal;
  },
);

// interset start

// const page = ref(1); // replace with your actual page value
const totalNumberOfPagesTemplateList = ref(1); // replace with your actual total number of pages value

const endIntersectTemplateList = async (isIntersecting) => {
  await getTemplateNameLists(page.value);
  if (isIntersecting && !isFetchingTemplates.value) {
    page.value += 1;
    await getTemplateNameLists(page.value);
  }
};

const getTemplateNameLists = async (page = 1, query = "") => {
  isFetchingTemplates.value = true;

  const result = await getTemplatesByPageSearch({
    sites: [mySite.value],
    limit: 10,
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

    // Only add new items if they don't already exist in the list
    newItems.forEach((newItem) => {
      if (!localTemplateList.value.find((item) => item._id === newItem._id)) {
        localTemplateList.value.push(newItem);
      }
    });
  }

  isFetchingTemplates.value = false;
};

const searchTemplate = async (query) => {
  isFetchingTemplates.value = true;

  const result = await getTemplatesByPageSearch({
    sites: [mySite.value],
    limit: 10,
    page: 1,
    statuses: ["active"],
    search: query,
  });

  if (result?.items.length) {
    props.templateList = result?.items.map((item) => ({
      _id: item._id,
      name: item.name,
      prefixPass: item.prefixPass,
      prefixKey: item.prefixKey,
    }));

    props.templateList.unshift({ _id: null, name: "All" });
    props.templateList.push({ _id: "Manually Added", name: "Manually Added" });
  }

  isFetchingTemplates.value = false;
};
//end intersect

async function selectAllKeys() {
  if (selectAll.value) {
    selectedKeysToPrint.value = resultKeys2.value?.items;
  } else {
    selectedKeysToPrint.value = [];
  }
}

const closeDialog = async (type?: string, tab?: string) => {
  await emit("update:close", false);
  if (type == "generate") {
    if (tab == "pass") {
      dialog.value = true;
      dialogType.value = "generate";
      generatePass.value = true;
    } else {
      router.push({
        name: "keys-visitor-pass-add",
        query: {
          site: mySite.value,
        },
      });
    }
    selectedChoicePaperSizeOrientation.value = null;
    resultKeys2.value = [];
    snackbarStartRange.value = false;
  }
};

const fetchTemplateData = async (inputStatus: any) => {
  isFetchingTemplates.value = true;
  selectedChoicePaperSizeOrientation.value = null;

  startRange.value = null;
  endRange.value = null;
  resultKeys2.value = [];

  const id = selectedTemplate.value
    ? selectedTemplate.value?._id
    : props.template._id;

  const status = route.query.status as string;
  const finalStatus =
    typeof inputStatus === "string" ? inputStatus : String(inputStatus);
  let site = mySite.value;
  const data = await getTemplatesByPageSearch({
    _id: id,
    sites: [site],
    limit: 2000,
    statuses: [finalStatus ? finalStatus : status],
  });

  templateQrCode.value = data?.items[0];

  isFetchingTemplates.value = false;
};

watch(
  () => props.open,
  async (newVal: any) => {
    if (newVal) {
      if (props.template.name !== "All") {
        selectedTemplate.value = props.template;
      } else {
        selectedTemplate.value = null;
      }
      if (tab.value == "key") {
        selectedKeysToPrint.value = [];
        isFetchingPassKeys.value = true;
        resultKeys2.value = await getPassKeysByPageSearch({
          sites: [mySite.value],
          template: null,
          passOrKey: tab.value,
          passTypes: ["pass-key"],
          sortBy: { column: "createdAt", order: "1" },
          limit: 5000,
        });

        totalPages.value = resultKeys2.value.pages;
        isFetchingPassKeys.value = false;
      } else {
        selectedChoicePaperSizeOrientation.value = props.orientation;
        await fetchTemplateData("active");
      }
    }
  },
  { immediate: true },
);

const router = useRouter();

const printContent = () => {
  const printRangeStart = startRange.value;
  const printRangeEnd = endRange.value;
  const printOrientation =
    tab.value !== "key" ? selectedChoicePaperSizeOrientation.value : "KeyCard";
  const status = (route.query.status as string) || "active";
  const templateParam =
    (route.query.template as string) || (selectedTemplate.value?._id as string);
  const prefix = prefixAndName.value;

  const url = router.resolve({
    name: "keys-visitor-printQr",
    query: {
      printRangeStart,
      printRangeEnd,
      printOrientation,
      status,
      templateId: templateParam,
      prefix,
      site: mySite.value,
    },
  }).href;

  if (printOrientation == "KeyCard") {
    localStorage.setItem(
      "selectedKeysToPrint",
      JSON.stringify(selectedKeysToPrint.value),
    );
  }

  // Open the URL in a new tab
  setTimeout(() => {
    window.open(url, "_blank");
  }, 500);
};

watch(selectedChoicePaperSizeOrientation, async (newVal: any) => {
  resultKeys2.value = [];
  const id = selectedTemplate.value
    ? selectedTemplate.value?._id
    : props.template._id;

  isFetchingPassKeys.value = true;

  resultPass.value = await getPassKeysByPageSearch({
    sites: [mySite.value],
    template: id,
    passOrKey: tab.value,
    passTypes: ["visitor-pass", "agent-pass", "contractor-pass"],
    limit: 2000,
    sortBy: { column: "prefixAndName", order: "1" },
  });

  resultKeys2.value = resultPass?.value.items.map((item: any) => ({
    text: item.prefixAndName,
    value: item.name,
  }));

  if (resultKeys2.value.length > 0) {
    prefixAndName.value = resultKeys2.value[0].text
      .replace(/\d/g, "")
      .toUpperCase();
  }

  resultKeys2.value = resultPass?.value.items.map((item: any) => ({
    text: item.prefixAndName,
    value: item.name,
  }));

  if (resultKeys2.value.length > 0) {
    prefixAndName.value = resultKeys2.value[0].text
      .replace(/\d/g, "")
      .toUpperCase();
  }

  resultKeys2.value.sort(
    (firstItem: { value: string }, secondItem: { value: string }) => {
      const numericValueOfFirstItem = Number(
        firstItem.value.replace(/\D/g, ""),
      );
      const numericValueOfSecondItem = Number(
        secondItem.value.replace(/\D/g, ""),
      );

      return numericValueOfFirstItem - numericValueOfSecondItem;
    },
  );

  startRange.value = props.start.toString();
  isFetchingPassKeys.value = false;
});

const page = ref(1);
const hasNextPage = ref(true);
const isSearching = ref(false);

const endIntersect = async (isIntersecting: boolean) => {
  if (isIntersecting && !isSearching.value) {
    if (hasNextPage.value) {
      page.value += 1;
      let moreItems = await fetchPassKeysByPageSearch();

      moreItems = moreItems.map((item: any) => ({
        text: item.prefixAndName,
        value: item.name,
      }));

      if (moreItems.length > 0) {
        prefixAndName.value = moreItems[0].text
          .replace(/\d/g, "")
          .toUpperCase();
      }

      resultKeys2.value = [...resultKeys2.value, ...moreItems];
    }
  }
};

const searchPassKeys = async (query, type) => {
  isSearching.value = true;
  const id = selectedTemplate.value
    ? selectedTemplate.value?._id
    : props.template._id;

  // Fetch all data if the search query is empty
  if (!query) {
    query = "";
  }

  // Fetch the search results from your server or local data
  let result = await getPassKeysByPageSearch({
    sites: [mySite.value],
    template: id,
    passOrKey: tab.value,
    passTypes: ["visitor-pass", "agent-pass", "contractor-pass"],
    sortBy: { column: "prefixAndName", order: "1" },
    search: query,
  });

  if (result?.items.length) {
    let searchResults = result.items.map((item) => ({
      text: item.prefixAndName,
      value: item.name,
    }));

    if (searchResults.length > 0) {
      prefixAndName.value = searchResults[0].text
        .replace(/\d/g, "")
        .toUpperCase();
    }

    if (type === "start") {
      startRange.value = searchResults[0].text;
      resultKeys.value = searchResults;
    } else if (type === "end") {
      endRange.value = searchResults[0].text;
      resultKeys.value = searchResults;
    }
  }

  isSearching.value = false;
};

const fetchPassKeysByPageSearch = async () => {
  const id = selectedTemplate.value
    ? selectedTemplate.value?._id
    : props.template._id;

  isFetchingPassKeys.value = true;

  const result1: any = await getPassKeysByPageSearch({
    sites: [mySite.value],
    template: id,
    passOrKey: "pass",
    passTypes: ["visitor-pass", "agent-pass", "contractor-pass"],
    limit: 2000,
    sortBy: { column: "prefixAndName", order: "1" },
    page: page.value,
  });
  if (result1?.pageRange) {
    const parts = result1.pageRange.split(" ");
    const pageItemEnd = parseInt(parts[0].split("-")[1]);
    const totalItems = parseInt(parts[2]);
    if (pageItemEnd < totalItems) {
      hasNextPage.value = true;
    } else {
      hasNextPage.value = false;
    }
  }
  isFetchingPassKeys.value = false;

  return result1?.items;
};

watch(startRange, (newVal: any, oldVal: any) => {
  if (newVal !== oldVal) {
    endRange.value = newVal;
  }
});

const endRangeKeys = computed(() => {
  return resultKeys2.value.filter(
    (item: any) => item.value >= startRange.value,
  );
});

const showSnackbarEndRange = () => {
  if (resultKeys2.value.length === 0) {
    setSnackbar({
      text: !startRange.value
        ? "Please select a start range first."
        : `No ${tab.value == "key" ? "Key" : "Pass"} found. Please try to
      generate first.`,
      modal: true,
      type: "error",
    });
  }
};
const showSnackbarStartRange = () => {
  if (resultKeys2.value.length === 0) {
    snackbarStartRange.value = true;
  }
};

// if print key
watch(searchKey, (newValue: string) => {
  debouncedSearch(newValue);
});

const debouncedSearch = debounce(async (value: string) => {
  console.log("debouncedSearch");
  isFetchingPassKeys.value = true;
  page.value = 1;
  searchKey.value = value;
  resultKeys2.value = await getPassKeysByPageSearch({
    sites: [mySite.value],
    search: value,
    template: null,
    passOrKey: "key",
    passTypes: ["pass-key"],
    limit: 5000,
    sortBy: { column: "createdAt", order: "1" },
    page: page.value,
  });
  totalPages.value = resultKeys2.value.pages;
  isFetchingPassKeys.value = false;
}, 500);

async function updateItemsPerPage() {
  isFetchingPassKeys.value = true;
  resultKeys2.value = await getPassKeysByPageSearch({
    sites: [mySite.value],
    template: null,
    passOrKey: "key",
    passTypes: ["pass-key"],
    sortBy: { column: "createdAt", order: "1" },
    page: page.value,
    limit: selectedPageRange.value,
  });
  totalPages.value = resultKeys2.value.pages;
  isFetchingPassKeys.value = false;
}

async function prevPage() {
  isFetchingPassKeys.value = true;
  page.value -= 1;
  resultKeys2.value = await getPassKeysByPageSearch({
    sites: [mySite.value],
    search: searchKey.value,
    template: null,
    passOrKey: "key",
    passTypes: ["pass-key"],
    sortBy: { column: "createdAt", order: "1" },
    page: page.value,
    limit: selectedPageRange.value,
  });

  totalPages.value = resultKeys2.value.pages;
  isFetchingPassKeys.value = false;
}

async function nextPage() {
  isFetchingPassKeys.value = true;
  page.value += 1;
  resultKeys2.value = await getPassKeysByPageSearch({
    sites: [mySite.value],
    search: searchKey.value,
    template: null,
    passOrKey: "key",
    passTypes: ["pass-key"],
    sortBy: { column: "createdAt", order: "1" },
    page: page.value,
    limit: selectedPageRange.value,
  });

  totalPages.value = resultKeys2.value.pages;
  isFetchingPassKeys.value = false;
}
</script>

<style scoped>
.custom-placeholer-color input::placeholder {
  color: red !important;
  opacity: 1;
}

.custom-label-color .v-label {
  color: red;
  opacity: 1;
}

.custom-placeholer-color input,
.custom-label-color input {
  color: red !important;
}

.placeHolderDarken ::placeholder {
  color: primary !important;
  opacity: 1;
}
</style>
