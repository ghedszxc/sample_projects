<template>
  <v-row no-gutters class="pa-8">
    <!-- back -->
    <!-- <v-btn
      fav
      density="compact"
      icon="mdi-arrow-left"
      variant="text"
      class="mb-1"
      @click="useRouter().push('/facilities')"
    /> -->

    <v-col cols="12">
      <v-card
        width="100%"
        elevation="3"
        height="100%"
        :loading="isTemplatesLoading"
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
                  :items="templateQrCodes"
                  :items-per-page="itemsPerPage"
                >
                  <!-- header -->
                  <template v-slot:header>
                    <v-row no-gutters class="pa-4">
                      <v-col cols="12" md="4">
                        <v-row align="center">
                          <v-col
                            cols="12"
                            md="1"
                            v-if="$vuetify.display.smAndDown"
                          >
                            <span class="font-weight-bold text-h6">
                              Template
                            </span>
                          </v-col>

                          <v-col cols="12" class="d-flex">
                            <span
                              class="font-weight-bold text-h6 mr-3 pt-1"
                              v-if="$vuetify.display.mdAndUp"
                            >
                              Template
                            </span>

                            <v-text-field
                              v-model="search"
                              placeholder="Search template"
                              hide-details
                              density="compact"
                              append-inner-icon="mdi-magnify"
                              :class="$vuetify.display.mdAndUp ? 'mr-3' : ''"
                              clearable
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col cols="12" md="8">
                        <v-row
                          :class="$vuetify.display.mdAndUp ? 'justify-end' : ''"
                        >
                          <!-- filter by template -->
                          <!-- <v-col
                            cols="12"
                            md="3"
                            lg="3"
                            xl="3"
                            :class="{ 'mt-5': $vuetify.display.smAndDown }"
                          >
                            <v-autocomplete
                              v-model="filterByTemplateName"
                              label="Filter by name"
                              :items="templateList"
                              hide-details
                              density="compact"
                              menu-icon="mdi-chevron-down"
                              @update:modelValue="
                                onFilterByTemplate(filterByTemplateName)
                              "
                              :loading="isTemplateListLoading"
                            />
                          </v-col> -->

                          <!-- select date -->
                          <!-- <v-col cols="12" md="2">
                            <v-btn
                              flat
                              variant="outlined"
                              @click="dateDialog = true"
                            >
                              <v-icon start>mdi-calendar-month-outline</v-icon>
                              <span class="text-caption font-weight-bold">
                                Select Date
                              </span>
                            </v-btn>
                          </v-col>
                          <v-dialog v-model="dateDialog" max-width="355">
                            <v-card>
                              <v-toolbar>
                                <v-spacer></v-spacer>
                                <v-btn
                                  color="grey-darken-1"
                                  icon="mdi-close"
                                  @click="dateDialog = false"
                                ></v-btn>
                              </v-toolbar>
                              <v-divider></v-divider>
                              <v-card-subtitle>
                                <v-date-picker
                                  width="320"
                                  v-model="date"
                                  :locale="locale"
                                ></v-date-picker>
                              </v-card-subtitle>
                              <v-card-action>
                                <v-btn
                                  color="blue-darken-3"
                                  block
                                  tile
                                  @click="updateFilter"
                                  :loading="isApplyingFilterByDate"
                                >
                                  Apply
                                </v-btn>
                              </v-card-action>
                            </v-card>
                          </v-dialog> -->

                          <!-- add template -->

                          <v-col
                            cols="12"
                            md="3"
                            lg="3"
                            xl="3"
                            v-if="$ability.can('create', 'create-keys')"
                          >
                            <v-btn
                              color="blue-darken-3"
                              block
                              variant="flat"
                              style="height: 40px"
                              :to="{
                                name: 'keys-manage-pass-template-add',
                                query: {
                                  site: mySite,
                                },
                              }"
                            >
                              Add Template
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>

                    <!-- tabs -->
                    <v-col cols="12" class="mt-2 mb-4">
                      <v-row no-gutters>
                        <v-col
                          cols="6"
                          class="text-center font-weight-bold"
                          @click="switchTab('active')"
                          style="cursor: pointer; font-size: 16px"
                          :style="
                            tab === 'active'
                              ? 'border-bottom: 3px solid #0077b6; padding: .5rem; color: #0077b6;'
                              : 'border-bottom: 3px solid gray; padding: .5rem'
                          "
                        >
                          Active
                        </v-col>
                        <v-col
                          cols="6"
                          class="text-center font-weight-bold"
                          @click="switchTab('deleted')"
                          style="cursor: pointer; font-size: 16px"
                          :style="
                            tab === 'deleted'
                              ? 'border-bottom: 3px solid #0077b6; padding: .5rem; color: #0077b6;'
                              : 'border-bottom: 3px solid gray; padding: .5rem'
                          "
                        >
                          Deleted
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-divider></v-divider>
                    <v-list
                      v-if="$vuetify.display.mdAndUp"
                      class="pa-0"
                      density="compact"
                    >
                      <v-list-item class="pt-1 px-8">
                        <v-list-item-title>
                          <v-row no-gutters>
                            <v-col cols="12" md="4">
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

                            <v-col cols="12" md="2" class="my-1">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Entry Date
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" md="2" class="my-1">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  A4 Size
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" md="2" class="my-1">
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-caption font-weight-bold"
                                >
                                  Standard Credit Card Size
                                </span>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider />
                    </v-list>
                  </template>
                  <!-- items -->
                  <template #default="{ items }">
                    <v-list class="pa-0" density="compact">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="item.raw._id"
                      >
                        <v-list-item class="pt-1 px-8">
                          <template #default>
                            <v-list-item-title>
                              <v-row no-gutters>
                                <v-col
                                  cols="12"
                                  md="4"
                                  :class="
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  "
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span
                                      :class="`d-flex align-center text-capitalize text-truncate text-body-2 ${$vuetify.display.mdAndUp ? '' : 'pl-9'}`"
                                    >
                                      {{ item.raw.name }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="2"
                                  :class="
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  "
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span class="d-inline-block text-body-2">
                                      {{
                                        standardFormatDateTime(
                                          item.raw.createdAt,
                                        )
                                      }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="2"
                                  :class="
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  "
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span
                                      v-if="!item.raw.A4Enabled"
                                      class="d-inline-block text-body-2"
                                    >
                                      N/A
                                    </span>
                                    <span
                                      v-else
                                      class="d-inline-block text-capitalize text-body-2 text-decoration-underline text-primary"
                                      style="cursor: pointer"
                                      @click="
                                        openDialog(item.raw, 'view-a4-sample')
                                      "
                                    >
                                      view sample (a4 size)
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="3"
                                  :class="
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  "
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    <span
                                      v-if="!item.raw.CCEnabled"
                                      class="d-inline-block text-body-2"
                                    >
                                      N/A
                                    </span>
                                    <span
                                      v-else
                                      class="d-inline-block text-capitalize text-body-2 text-decoration-underline text-primary"
                                      style="cursor: pointer"
                                      @click="
                                        openDialog(item.raw, 'view-cc-sample')
                                      "
                                    >
                                      view sample (Standard Credit Card Size)
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="1"
                                  :class="
                                    $vuetify.display.mdAndUp ? 'my-1' : 'mb-2'
                                  "
                                >
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                    justify="end"
                                  >
                                    <v-menu
                                      v-if="item.raw.status !== 'deleted'"
                                    >
                                      <template #activator="{ props }">
                                        <v-icon
                                          v-bind="props"
                                          class="pa-4 rounded-xl border-md"
                                          density="compact"
                                        >
                                          mdi-dots-vertical
                                        </v-icon>
                                      </template>

                                      <v-card>
                                        <v-list-item
                                          :to="{
                                            name: 'keys-manage-pass-template-edit-id',
                                            params: { id: item.raw._id || '' },
                                            query: {
                                              status: item.raw.status,
                                              view: 'true',
                                              site: mySite,
                                            },
                                          }"
                                          @click="
                                            useRouter().push({
                                              path: '/keys/manage-pass-template/edit/id',
                                              query: {
                                                id: item.raw._id,
                                                status: item.raw.status,
                                                view: 'true',
                                                site: useRoute().query.site,
                                                ...(useRoute().query.site && {
                                                  site: useRoute().query.site,
                                                }),
                                              },
                                            })
                                          "
                                        >
                                          <template #title>
                                            <span class="text-caption">
                                              View Template
                                            </span>
                                          </template>
                                        </v-list-item>
                                        <!-- <v-list-item
                                          @click="
                                            useRouter().push({
                                              name: 'keys-visitor',
                                              query: {
                                                site: mySite,
                                                template: item.raw._id,
                                                status: item.raw.status,
                                                ...(useRoute().query.site && {
                                                  site: useRoute().query.site,
                                                }),
                                              },
                                            })
                                          "
                                        >
                                          <template #title>
                                            <span class="text-caption">
                                              View Pass & Keys
                                            </span>
                                          </template>
                                        </v-list-item> -->
                                        <v-list-item
                                          v-if="
                                            $ability.can('update', 'edit-keys')
                                          "
                                          :to="{
                                            name: 'keys-manage-pass-template-edit-id',
                                            params: { id: item.raw._id || '' },
                                            query: {
                                              status: item.raw.status,
                                              site: mySite,
                                            },
                                          }"
                                        >
                                          <template #title>
                                            <span class="text-caption">
                                              Edit
                                            </span>
                                          </template>
                                        </v-list-item>
                                        <v-list-item
                                          v-if="
                                            $ability.can(
                                              'delete',
                                              'delete-keys',
                                            )
                                          "
                                          @click="
                                            openDialog(item.raw, 'deleted')
                                          "
                                        >
                                          <template #title>
                                            <span class="text-caption">
                                              Delete
                                            </span>
                                          </template>
                                        </v-list-item>
                                      </v-card>
                                    </v-menu>
                                    <v-btn
                                      v-if="
                                        $ability.can('delete', 'delete-keys') &&
                                        item.raw.status == 'deleted'
                                      "
                                      variant="outlined"
                                      flat
                                      @click="openDialog(item.raw, 'active')"
                                    >
                                      Undelete
                                    </v-btn>
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
                  <!-- if no items-->
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
                            No templates found.
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
                    // name: !filterByTemplateName
                    //   ? ''
                    //   : filterByTemplateName.toLowerCase() === 'all'
                    //     ? ''
                    //     : filterByTemplateName.toLowerCase(),
                    statuses: [tab],
                    // date: moment
                    //   .tz(moment(date, 'DD/MM/YYYY'), 'Asia/Singapore')
                    //   .toDate(),
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
                    // name: !filterByTemplateName
                    //   ? ''
                    //   : filterByTemplateName.toLowerCase() === 'all'
                    //     ? ''
                    //     : filterByTemplateName.toLowerCase(),
                    statuses: [tab],
                    // date: moment
                    //   .tz(moment(date, 'DD/MM/YYYY'), 'Asia/Singapore')
                    //   .toDate(),
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
      :max-width="
        !['active', 'deleted'].includes(dialogStatus) ? '2480px' : '420px'
      "
      persistent
    >
      <v-card rounded="lg">
        <v-card-title class="d-flex justify-end align-center">
          <v-btn color="red" icon="mdi-close" @click="dialog = false"></v-btn>
        </v-card-title>

        <!-- active/delete -->
        <div
          v-if="['active', 'deleted'].includes(dialogStatus)"
          class="text-center"
        >
          <v-card-text>
            <v-img height="129px" src="/images/keys/trash.svg"></v-img>
            <div class="mt-6">
              Are you sure you want to
              {{ dialogStatus == "active" ? "re-activate" : "delete" }} this
              template
            </div>
          </v-card-text>
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
        </div>
        <!-- view a4 sample -->
        <div v-else-if="dialogStatus == 'view-a4-sample'">
          <!-- front -->
          <v-col cols="12" class="pa-5 d-flex justify-center position-relative">
            <v-card class="a4-size" tile>
              <p class="watermark" style="font-size: 3em">[ Front ]</p>
              <VuetifyViewer
                class="a4-size"
                :maxWidth="'8.27in'"
                :value="templateQrCode.A4FrontWysiwyg"
                markdown-theme="github"
              />

              <qrcode-vue
                :size="templateQrCode.A4FrontQRCodeSize"
                level="H"
                margin="3"
                :style="{
                  top: templateQrCode.A4FrontQRCodeTop + '%',
                  left: templateQrCode.A4FrontQRCodeLeft + '%',
                  transform: 'translate(-50%, -50%)',
                }"
                class="position-absolute"
              />

              <div
                :style="{
                  top: templateQrCode.A4FrontPassTop + '%',
                  left: templateQrCode.A4FrontPassLeft + '%',
                  transform: 'translate(-50%, -50%)',
                }"
                class="position-absolute text-center"
              >
                Pass Number: 00000
              </div>
            </v-card>
          </v-col>
          <!-- back -->
          <v-col cols="12" class="pa-5 d-flex justify-center position-relative">
            <v-card class="a4-size" tile>
              <p class="watermark" style="font-size: 3em">[ Back ]</p>
              <VuetifyViewer
                class="a4-size"
                :maxWidth="'8.27in'"
                :value="templateQrCode.A4BackWysiwyg"
                markdown-theme="github"
              />

              <qrcode-vue
                :size="templateQrCode.A4BackQRCodeSize"
                level="H"
                margin="3"
                :style="{
                  top: templateQrCode.A4BackQRCodeTop + '%',
                  left: templateQrCode.A4BackQRCodeLeft + '%',
                  transform: 'translate(-50%, -50%)',
                }"
                class="position-absolute"
              />

              <div
                :style="{
                  top: templateQrCode.A4BackPassTop + '%',
                  left: templateQrCode.A4BackPassLeft + '%',
                  transform: 'translate(-50%, -50%)',
                }"
                class="position-absolute text-center"
              >
                Pass Number: 00000
              </div>
            </v-card>
          </v-col>
        </div>
        <!-- view cc sample -->
        <div v-else>
          <v-col
            cols="12"
            class="border-thin pa-5 d-flex justify-center position-relative"
          >
            <v-card
              :style="{
                height: '1123.2px',
                width: '796.8px',
              }"
              elevation="16"
            >
              <v-row no-gutters class="pa-5 position-relative">
                <v-col
                  cols="6"
                  v-for="n in 3"
                  :key="n"
                  class="ma-0"
                  :style="{
                    flex: flexEnabled ? 1 : 0,
                  }"
                >
                  <!-- front -->
                  <v-card
                    class="border-dashed border-md ma-0 pa-0 position-relative pa-2"
                    :height="
                      templateQrCode.CCOrientation === 'portrait'
                        ? '369.950px'
                        : '243.712px'
                    "
                    :width="
                      templateQrCode.CCOrientation === 'portrait'
                        ? '243.712px'
                        : '369.950px'
                    "
                    :class="creditCardSizeClassPortraitOrLandscape"
                  >
                    <p class="watermark" style="font-size: 1em">[Front]</p>
                    <!-- <VuetifyViewer
                      :class="creditCardSizeClassPortraitOrLandscape"
                      :maxWidth="'8.27in'"
                      :value="templateQrCode.CCFrontWysiwyg"
                      markdown-theme="github"
                    /> -->
                    <VuetifyViewer
                      :class="creditCardSizeClassPortraitOrLandscape"
                      :style="{
                        maxWidth:
                          templateQrCode.CCOrientation === 'portrait'
                            ? '243.712px'
                            : '369.950px',
                      }"
                      :value="templateQrCode.CCFrontWysiwyg"
                      markdown-theme="github"
                    />
                    <!-- <qrcode-vue
                      :size="templateQrCode.CCFrontQRCodeSize"
                      level="H"
                      margin="3"
                      :style="{
                        top: templateQrCode.CCFrontQRCodeTop + '%',
                        left: templateQrCode.CCFrontQRCodeLeft + '%',
                        transform: 'translate(-50%, -50%)',
                      }"
                      class="position-absolute"
                    /> -->
                    <qrcode-vue
                      v-if="templateQrCode.CCFrontQREnabled"
                      :size="templateQrCode.CCFrontQRCodeSize"
                      level="H"
                      :style="{
                        top: `${templateQrCode.CCFrontQRCodeTop - 45}%`,
                        left: `${templateQrCode.CCFrontQRCodeLeft}%`,
                      }"
                      class="position-absolute"
                    />
                    <div
                      :style="{
                        top: `${templateQrCode.CCFrontPassTop - 45}%`,
                        left: `${templateQrCode.CCFrontPassLeft}%`,
                        fontSize: templateQrCode.CCFrontPassSize + 'px',
                        textWrap: 'nowrap',
                      }"
                      class="position-absolute"
                    >
                      Pass Number: C01
                    </div>
                  </v-card>
                  <!-- back -->
                  <v-card
                    class="border-dashed border-md ma-0 pa-0 position-relative pa-2"
                    :class="creditCardSizeClassPortraitOrLandscape"
                    :height="
                      templateQrCode.CCOrientation === 'portrait'
                        ? '369.950px'
                        : '243.712px'
                    "
                    :width="
                      templateQrCode.CCOrientation === 'portrait'
                        ? '243.712px'
                        : '369.950px'
                    "
                  >
                    <p class="watermark" style="font-size: 1em">[Back]</p>
                    <VuetifyViewer
                      :class="creditCardSizeClassPortraitOrLandscape"
                      :style="{
                        maxWidth:
                          templateQrCode.CCOrientation === 'portrait'
                            ? '243.712px'
                            : '369.950px',
                      }"
                      :value="templateQrCode.CCBackWysiwyg"
                      markdown-theme="github"
                    />

                    <qrcode-vue
                      v-if="templateQrCode.CCBackQREnabled"
                      :size="templateQrCode.CCBackQRCodeSize"
                      level="H"
                      :style="{
                        top: `${templateQrCode.CCBackQRCodeTop - 45}%`,
                        left: `${templateQrCode.CCBackQRCodeLeft}%`,
                      }"
                      class="position-absolute"
                    />

                    <div
                      v-if="templateQrCode.CCBackQREnabled"
                      :style="{
                        top: `${templateQrCode.CCBackPassTop - 45}%`,
                        left: `${templateQrCode.CCBackPassLeft}%`,
                        fontSize: templateQrCode.CCBackPassSize + 'px',
                        textWrap: 'nowrap',
                      }"
                      class="position-absolute"
                    >
                      Pass Number: C01
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import QrcodeVue from "qrcode.vue";
definePageMeta({
  middleware: "secure",
});

import debounce from "lodash/debounce";
//import moment from "moment-timezone";
const { $ability } = useNuxtApp();
const { mySite } = useFilter();

const { standardFormatDateTime } = useUtils();

const { setSnackbar } = useLocal();

const {
  tab,
  setTemplates,
  setTemplate,
  getTemplatesByPageSearch,
  isTemplatesLoading,
  templateQrCodes,
  templateQrCode,
  page,
  itemsPerPage,
  pageRange,
  search,
  canNextPage,
  nextPage,
  canPrevPage,
  prevPage,
  updateTemplateStatus,
} = useTemplateReusable();

const templateList = ref<any>([]);
const isTemplateListLoading = ref(false);

//const filterByTemplateName = ref("All");

const dialog = ref(false);
const dialogStatus = ref("");
const isUpdatingStatus = ref(false);

const creditCardSizeClassPortraitOrLandscape = computed(() => {
  return templateQrCode.value.CCOrientation
    ? "credit-card-size-portrait"
    : "credit-card-size-landscape";
});

const addUrl = ref("/keys/manage-pass-template/add");

onMounted(async () => {
  await setTemplates({
    sites: [mySite.value],
    statuses: ["active"],
  });

  await getTemplateNameList("active");
});

watch(search, (newValue: string) => {
  // filterByTemplateName.value = "All";
  debouncedSearch(newValue);
});

const debouncedSearch = debounce(async (value: string) => {
  page.value = 1;
  setTemplates({
    sites: [mySite.value],
    search: value,
    statuses: [tab.value],
    // date: moment
    //   .tz(moment(date.value, "DD/MM/YYYY"), "Asia/Singapore")
    //   .toDate(),
  });
}, 500);

async function getTemplateNameList(status: string) {
  console.log("template list ", mySite.value);
  isTemplateListLoading.value = true;
  templateList.value = [];
  const result: any = await getTemplatesByPageSearch({
    sites: [mySite.value],
    limit: 0,
    statuses: [status],
  });

  if (result?.items.length) {
    templateList.value = result?.items.map((item: any) => item.name);
    templateList.value.unshift("All");
  }
  isTemplateListLoading.value = false;
}

// async function onFilterByTemplate(template: string) {
//   search.value = "";
//   template = template === "All" ? "" : template;
//   filterByTemplateName.value = template;
//   await updateFilter();
// }

async function switchTab(Tab: string) {
  templateQrCodes.value = [];
  tab.value = Tab;
  page.value = 1;
  await updateFilter();
}

async function updateFilter() {
  try {
    setTemplates({
      sites: [mySite.value],
      search: search.value,
      // name: filterByTemplateName.value || "",
      statuses: [tab.value],
      // date: moment
      //   .tz(moment(date.value, "DD/MM/YYYY"), "Asia/Singapore")
      //   .toDate(),
    });
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}

function openDialog(data: any, status: string) {
  setTemplate(data);
  dialogStatus.value = status;
  dialog.value = true;
}

async function updateStatus() {
  isUpdatingStatus.value = true;
  try {
    await updateTemplateStatus({
      _id: templateQrCode.value._id,
      site: mySite.value,
      status: dialogStatus.value,
    });
    dialog.value = false;
    await updateFilter();
    setSnackbar({
      text: `Successfully ${dialogStatus.value !== "deleted" ? "re-activated" : dialogStatus.value}.` as string,
      modal: true,
      type: "success",
    });
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
  isUpdatingStatus.value = false;
}
</script>

<style scoped>
.a4-size {
  width: 794px;
  height: 1123px;
  padding: 20px;
}
.credit-card-size-landscape {
  height: 203.904px;
  width: 323.52px;
}
.credit-card-size-portrait {
  width: 203.904px;
  height: 323.52px;
}
.watermark {
  color: rgba(128, 128, 128, 0.17);
  position: absolute;
  font-family: "Denk One", sans-serif;
  text-transform: uppercase;
  padding-left: 65%;
  top: 0;
}
</style>
