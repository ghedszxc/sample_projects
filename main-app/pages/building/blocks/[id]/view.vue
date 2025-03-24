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

        <v-card-title class="pt-3 font-weight-bold">
          <v-row no-gutters align="center">
            <v-col cols="12" md="4">
              <back-button></back-button>
              View Unit
              <span class="text-subtitle-1 ml-3">
                (
                {{
                  `${selectedUnit.block.name} / ${selectedUnit.level.level} / ${selectedUnit.name}`
                }}
                )
              </span>
            </v-col>

            <v-col cols="12" md="8" class="px-sm-0 px-md-4">
              <v-row
                no-gutters
                align="center"
                :class="`${$vuetify.display.smAndDown ? 'px-2' : 'justify-end'}`"
              >
                <v-col cols="12" sm="6" md="4">
                  <v-row
                    no-gutters
                    align="center"
                    :justify="`${$vuetify.display.smAndDown ? 'start' : 'end'}`"
                  >
                    <span
                      class="text-body-2"
                      style="word-break: break-word; white-space: normal"
                    >
                      Assigned Physical NFC Card
                      <span class="text-body-1 ml-2">
                        {{ 200 }}
                        <v-icon
                          class="ml-2 pb-1 cursor-pointer"
                          color="primary"
                          size="medium"
                        >
                          mdi-eye
                        </v-icon>
                      </span>
                    </span>
                  </v-row>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-row
                    no-gutters
                    align="center"
                    :justify="`${$vuetify.display.smAndDown ? 'start' : 'end'}`"
                    ><span
                      class="text-body-2"
                      style="word-break: break-word; white-space: normal"
                    >
                      Available Physical NFC Card
                      <span class="text-body-1 ml-2">
                        {{ 100 }}
                        <v-icon
                          class="ml-2 pb-1 cursor-pointer"
                          color="primary"
                          size="medium"
                        >
                          mdi-eye
                        </v-icon>
                      </span>
                    </span></v-row
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="3"
              :class="{ 'pr-5': $vuetify.display.mdAndUp }"
              :style="{
                borderRight: $vuetify.display.mdAndUp
                  ? theme == 'light'
                    ? '1px solid #E0E0E0'
                    : '1px solid #424242'
                  : '',
              }"
            >
              <v-tabs
                v-model="tab"
                slider-color="primary"
                align-tabs="center"
                grow
              >
                <v-tab value="generalInfo">General Info</v-tab>
                <v-tab value="features">Features</v-tab>
                <v-tab value="documents">Documents</v-tab>
              </v-tabs>

              <v-tabs-window v-model="tab">
                <v-tabs-window-item value="generalInfo">
                  <v-row no-gutters justify="center">
                    <v-col cols="12" class="mt-4">
                      <span class="font-weight-bold"> Unit Information </span>

                      <v-list density="compact">
                        <v-list-item class="pl-0">
                          Block / Level / Unit
                          <template v-slot:append>
                            {{
                              `${unitSetupDetails?.block.name} / ${unitSetupDetails?.level.level} / ${unitSetupDetails?.name}`
                            }}
                          </template>
                        </v-list-item>
                        <v-divider></v-divider>

                        <v-list-item class="pl-0">
                          Unit Area
                          <template v-slot:append>
                            {{ unitSetupDetails?.unitArea }}
                          </template>
                        </v-list-item>
                        <v-divider></v-divider>

                        <v-list-item class="pl-0">
                          Unit Category
                          <template v-slot:append>
                            {{ unitSetupDetails?.category }}
                          </template>
                        </v-list-item>
                        <v-divider></v-divider>

                        <v-list-item class="pl-0">
                          Unit Owner
                          <template v-slot:append>
                            {{
                              `${unitSetupDetails?.unitOwner?.givenName || ""} ${unitSetupDetails?.unitOwner?.surname || ""}`
                            }}

                            <v-icon
                              v-if="
                                unitSetupDetails?.unitOwner?.givenName ||
                                unitSetupDetails?.unitOwner?.surname
                              "
                              class="ml-3"
                              size="sm"
                              @click="
                                onDisplayProfile(
                                  unitSetupDetails?.unitOwner?._id,
                                )
                              "
                            >
                              mdi-eye
                            </v-icon>
                          </template>
                        </v-list-item>
                        <v-divider></v-divider>

                        <v-list-item class="pl-0">
                          Moved In Date
                          <template v-slot:append>
                            {{ unitSetupDetails?.unitOwner?.moveInDate }}
                          </template>
                        </v-list-item>
                        <v-divider></v-divider>

                        <v-list-item class="pl-0">
                          Parking Lot No.
                          <template v-slot:append>
                            {{ unitSetupDetails?.unitOwner?.parkingLotNo }}
                          </template>
                        </v-list-item>
                        <v-divider></v-divider>

                        <v-list-item class="pl-0">
                          Vehicle No.
                          <template v-slot:append>
                            {{ unitSetupDetails?.unitOwner?.vehicleNo }}
                          </template>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item class="pl-0">
                          Vehicle Model
                          <template v-slot:append>
                            {{ unitSetupDetails?.unitOwner?.vehicleModel }}
                          </template>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item class="pl-0">
                          Vehicle Color
                          <template v-slot:append>
                            {{ unitSetupDetails?.unitOwner?.vehicleColor }}
                          </template>
                        </v-list-item>
                        <v-divider></v-divider>
                      </v-list>
                    </v-col>
                    <v-col cols="12" class="mt-4">
                      <span class="font-weight-bold"> Billing Address</span>

                      <v-list density="compact">
                        <v-list-item class="pl-0">
                          Line 1
                          <template v-slot:append>
                            {{
                              unitSetupDetails?.unitOwner?.billingAddress?.line1
                            }}
                          </template>
                        </v-list-item>
                        <v-divider></v-divider>

                        <v-list-item class="pl-0">
                          Line 2
                          <template v-slot:append>
                            {{
                              unitSetupDetails?.unitOwner?.billingAddress?.line2
                            }}
                          </template>
                        </v-list-item>
                        <v-divider></v-divider>

                        <v-list-item class="pl-0">
                          City
                          <template v-slot:append>
                            {{
                              unitSetupDetails?.unitOwner?.billingAddress?.city
                            }}
                          </template>
                        </v-list-item>
                        <v-divider></v-divider>

                        <v-list-item class="pl-0">
                          Postal Code
                          <template v-slot:append>
                            {{
                              unitSetupDetails?.unitOwner?.billingAddress
                                ?.postalCode
                            }}
                          </template>
                        </v-list-item>
                        <v-divider></v-divider>

                        <v-list-item class="pl-0">
                          State
                          <template v-slot:append>
                            {{
                              unitSetupDetails?.unitOwner?.billingAddress?.state
                            }}
                          </template>
                        </v-list-item>
                        <v-divider></v-divider>

                        <v-list-item class="pl-0">
                          Country
                          <template v-slot:append>
                            {{
                              unitSetupDetails?.unitOwner?.billingAddress
                                ?.country
                            }}
                          </template>
                        </v-list-item>
                        <v-divider></v-divider>
                      </v-list>
                    </v-col>
                  </v-row>
                </v-tabs-window-item>

                <v-tabs-window-item value="features">
                  <v-row no-gutters justify="center">
                    <v-col cols="12" class="mt-4">
                      <span class="font-weight-bold"> Features </span>

                      <v-list density="compact">
                        <template v-for="(data, key) in features" :key="key">
                          <v-list-item class="pl-0">
                            <v-icon
                              class="mr-1"
                              :color="
                                unitSetupDetails?.features
                                  ? unitSetupDetails?.features?.findIndex(
                                      (find) => find.label == data.label,
                                    ) != -1
                                    ? 'green'
                                    : 'grey'
                                  : 'grey'
                              "
                            >
                              {{
                                unitSetupDetails?.features
                                  ? unitSetupDetails?.features?.findIndex(
                                      (find) => find.label == data.label,
                                    ) != -1
                                    ? "mdi-check-circle"
                                    : "mdi-radiobox-blank"
                                  : "mdi-radiobox-blank"
                              }}
                            </v-icon>
                            {{ data.label }}
                          </v-list-item>
                          <v-divider></v-divider>
                        </template>
                      </v-list>
                    </v-col>
                  </v-row>
                </v-tabs-window-item>

                <v-tabs-window-item value="documents">
                  <v-row no-gutters justify="center">
                    <v-col cols="12" class="mt-4">
                      <span class="font-weight-bold"> Documents </span>

                      <v-list
                        density="compact"
                        v-if="selectedUnit?.uploadedDocuments?.length"
                      >
                        <template
                          v-for="(data, key) in selectedUnit?.uploadedDocuments"
                          :key="key"
                        >
                          <template
                            v-for="(file, index) in data?.files"
                            :key="index"
                          >
                            <v-list-item
                              class="mb-3 rounded-sm py-3"
                              :style="{
                                border: $vuetify.display.mdAndUp
                                  ? theme == 'light'
                                    ? '1px solid #E0E0E0'
                                    : '1px solid #424242'
                                  : '',
                              }"
                            >
                              {{ file?.name }}
                              <template v-slot:append>
                                <v-icon @click=""
                                  >mdi-download-box-outline</v-icon
                                >
                              </template>
                            </v-list-item>
                          </template>
                        </template>
                      </v-list>

                      <template v-else>
                        <v-row no-gutters justify="center" class="my-5">
                          <v-col cols="12">
                            <v-row no-gutters justify="center">
                              <span class="caption text-disabled">
                                No documents included for this unit.
                              </span>
                            </v-row>
                          </v-col>
                        </v-row>
                      </template>
                    </v-col>
                  </v-row>
                </v-tabs-window-item>
              </v-tabs-window>
            </v-col>
            <v-col
              cols="12"
              md="9"
              :class="{ 'pl-5': $vuetify.display.mdAndUp }"
            >
              <v-data-iterator
                :page="page"
                :items="unitSetupDetails?.residents?.items"
                :items-per-page="itemsPerPage"
              >
                <template v-slot:header>
                  <v-row no-gutters class="pa-4">
                    <v-col cols="12">
                      <v-row no-gutters align="center">
                        <v-col
                          cols="12"
                          :class="{
                            'pb-2': !$vuetify.display.mdAndUp,
                            'pr-0': $vuetify.display.mdAndUp,
                          }"
                        >
                          <v-row no-gutter>
                            <v-col
                              cols="12"
                              md="5"
                              class="d-flex align-center pr-6"
                            >
                              <span class="text-h6 font-weight-bold mr-4">
                                {{
                                  unitSetupDetails?.category
                                    ? ["Resident", "Residential"].includes(
                                        unitSetupDetails?.category,
                                      )
                                      ? "Residents"
                                      : "Tenants"
                                    : "Residents / Tenants"
                                }}
                              </span>

                              <v-text-field
                                v-model="search"
                                placeholder="Search name, id"
                                hide-details
                                density="compact"
                                append-inner-icon="mdi-magnify"
                              >
                              </v-text-field>
                              <!-- @update:modelValue="onSearch" -->
                            </v-col>

                            <v-col cols="12" md="7">
                              <v-row align="center" justify="end">
                                <v-col
                                  cols="12"
                                  md="4"
                                  :class="
                                    $vuetify.display.mdAndUp
                                      ? 'mt-0 pl-sm-3 pl-md-2'
                                      : 'mt-4 mb-3 pl-sm-3'
                                  "
                                >
                                  <v-row no-gutters>
                                    <v-col cols="12" md="12">
                                      <v-autocomplete
                                        :items="['All']"
                                        label="Filter"
                                        hide-details
                                      />
                                    </v-col>
                                  </v-row>
                                </v-col>
                                <v-col cols="12" md="4">
                                  <v-btn
                                    color="blue-darken-3"
                                    block
                                    variant="flat"
                                    size="small"
                                    style="height: 40px"
                                    @click="onRequestNFC()"
                                    :disabled="!unitOwner"
                                    >Request Access Card</v-btn
                                  >
                                </v-col>
                                <v-col cols="12" md="4">
                                  <v-menu location="bottom">
                                    <template #activator="{ props }">
                                      <v-btn
                                        v-bind="props"
                                        color="primary"
                                        block
                                        variant="flat"
                                        size="small"
                                        style="height: 40px"
                                        :disabled="!unitOwner"
                                      >
                                        Assign NFC
                                      </v-btn>
                                    </template>
                                    <v-list density="compact" class="pa-0">
                                      <template
                                        v-for="(
                                          item, itemIndex
                                        ) in assignNFCActions"
                                        :key="itemIndex"
                                      >
                                        <v-list-item
                                          class="text-body-2"
                                          @click="item.action"
                                        >
                                          {{ item.text }}
                                        </v-list-item>
                                        <v-divider
                                          v-if="
                                            itemIndex + 1 !==
                                            assignNFCActions.length
                                          "
                                        ></v-divider>
                                      </template>
                                    </v-list>
                                  </v-menu>
                                  <entry-pass-assign-multiple-dialog
                                    :type="accessCardType"
                                    :users="users"
                                    @on-assign="onAssign"
                                  />
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-divider class="mb-3" />

                  <v-list
                    class="pa-0"
                    density="compact"
                    v-if="$vuetify.display.mdAndUp"
                  >
                    <v-list-item>
                      <v-list-item-title>
                        <v-row no-gutters align="center">
                          <v-col cols="12" sm="3">
                            <span class="text-capitalize text-body-2">
                              Name
                            </span>
                          </v-col>

                          <v-col cols="12" sm="2">
                            <span
                              class="text-capitalize text-body-2 text-center"
                              style="
                                word-break: break-word;
                                white-space: normal;
                              "
                              >Access Card
                            </span>
                          </v-col>

                          <v-col cols="12" sm="2">
                            <span
                              class="text-capitalize text-body-2 text-center"
                              style="
                                word-break: break-word;
                                white-space: normal;
                              "
                              >Physical NFC Card
                            </span>
                          </v-col>

                          <v-col cols="12" sm="2">
                            <span
                              class="d-flex text-capitalize text-body-2 text-center"
                              style="
                                word-break: break-word;
                                white-space: normal;
                              "
                              >QR Code Access
                            </span>
                          </v-col>

                          <v-col cols="12" sm="2">
                            <v-row no-gutters class="fill-height">
                              <span
                                class="d-inline-block text-truncate text-capitalize text-body-2"
                              >
                                Category
                              </span>
                            </v-row>
                          </v-col>

                          <v-col cols="12" sm="1">
                            <v-row
                              no-gutters
                              class="fill-height"
                              align-content="center"
                            >
                              <span
                                class="d-inline-block text-truncate text-capitalize text-body-2"
                                >Actions
                              </span>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-list-item-title>
                    </v-list-item>
                    <v-divider />
                  </v-list>
                </template>

                <template v-if="$vuetify.display.mdAndUp" #default="{ items }">
                  <v-list class="pa-0 mt-2">
                    <template
                      v-for="(item, itemIndex) in items"
                      :key="itemIndex"
                    >
                      <v-list-item
                        class="rounded-sm my-2"
                        :style="{
                          border: $vuetify.display.mdAndUp
                            ? theme == 'light'
                              ? '1px solid #E0E0E0'
                              : '1px solid #424242'
                            : '',
                        }"
                      >
                        <v-list-item-title>
                          <v-row no-gutters align="center">
                            <v-col cols="12" md="3" class="text-capitalize">
                              <v-row no-gutters align="center">
                                <span class="mr-2">
                                  <v-avatar
                                    size="x-small"
                                    :color="materialColors[itemIndex]"
                                    class="mr-2 pa-4"
                                  >
                                    {{ getInitial(`${item.raw?.givenName}`) }}
                                  </v-avatar>

                                  <span
                                    class="text-capitalize text-body-2"
                                    style="
                                      word-break: break-word;
                                      white-space: normal;
                                    "
                                  >
                                    {{
                                      `${item.raw?.givenName} ${item.raw?.surname}`
                                    }}
                                  </span>
                                </span>
                              </v-row>
                            </v-col>

                            <v-col cols="12" md="2" class="text-capitalize">
                              <v-row no-gutters align="center">
                                <span class="mr-2">
                                  <span
                                    class="text-capitalize text-body-2"
                                    style="
                                      word-break: break-word;
                                      white-space: normal;
                                    "
                                  >
                                    {{
                                      item.raw.physical || item.raw.non_physical
                                        ? "Yes"
                                        : "N/A"
                                    }}
                                  </span>
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              md="2"
                              class="text text-capitalize"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  :class="`d-inline-block text-truncate text-capitalize text-body-2 ${item.raw.physical.isActivated ? 'text-blue' : 'text-grey'} cursor-pointer`"
                                  @click="
                                    useRouter().push(
                                      `/building/blocks/${unitId}/accessCard/${item.raw.physical._id}?site=${mySite}`,
                                    )
                                  "
                                  v-if="item.raw.physical"
                                >
                                  {{ item.raw.physical.cardNo }}
                                </span>
                                <span v-else class="text-body-2">N/A</span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              md="2"
                              class="text text-capitalize"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  v-if="item.raw.non_physical"
                                  :class="`d-inline-block text-truncate text-capitalize text-body-2 ${item.raw.non_physical.isActivated ? 'text-blue' : 'text-grey'} cursor-pointer`"
                                  @click="
                                    useRouter().push(
                                      `/building/blocks/${unitId}/accessCard/${item.raw.non_physical._id}?site=${mySite}`,
                                    )
                                  "
                                  :disabled="!item.raw.non_physical.isActivated"
                                >
                                  {{ item.raw.non_physical.cardNo }}
                                </span>
                                <span v-else class="text-body-2">N/A</span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              md="2"
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
                                  {{ item?.raw?.residentType }}
                                </span>
                              </v-row>
                            </v-col>

                            <v-col
                              cols="12"
                              md="1"
                              class="text text-capitalize"
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
                                    @click="onDisplayProfile(item?.raw._id)"
                                    class="mr-1"
                                  >
                                    mdi-eye
                                  </v-icon>
                                  <v-icon
                                    @click="deleteDialog = true"
                                    class="ml-1"
                                  >
                                    mdi-delete-outline
                                  </v-icon>
                                  <building-delete-resident-tenant
                                    :_id="item?.raw._id"
                                  />

                                  <!-- <v-icon class="ml-1" @click="">
                                    mdi-dots-vertical
                                  </v-icon> -->

                                  <v-menu>
                                    <template v-slot:activator="{ props }">
                                      <v-icon
                                        class="ml-1"
                                        @click="selected = item.raw"
                                        v-bind="props"
                                      >
                                        mdi-dots-vertical
                                      </v-icon>
                                    </template>

                                    <v-list class="pa-0">
                                      <template
                                        v-for="(item, itemIndex) in actions"
                                        :key="itemIndex"
                                      >
                                        <v-list-item
                                          class="text-body-2"
                                          @click="item.action"
                                          :disabled="item.disabled"
                                        >
                                          {{ item.text }}
                                        </v-list-item>
                                        <v-divider
                                          v-if="
                                            itemIndex + 1 !== actions.length
                                          "
                                        ></v-divider>
                                      </template>
                                    </v-list>
                                  </v-menu>

                                  <building-transfer-access-card
                                    :title="cardDialogOptions"
                                    :users="
                                      cardDialogOptions === 'physical'
                                        ? noPhysicalCard
                                        : noNonPhysicalCard
                                    "
                                    @on-transfer="onTransfer($event)"
                                  />

                                  <building-reactive-deactive-access-card
                                    :title="cardDialogOptions"
                                    :action="cardDialogAction"
                                    @on-update="onUpdateCardStatus"
                                  />
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
                <template v-else #default="{ items }">
                  <v-list class="pa-0">
                    <template
                      v-for="(item, itemIndex) in items"
                      :key="itemIndex"
                    >
                      <v-list-item
                        class="mb-4 rounded"
                        :style="{
                          border:
                            theme == 'light'
                              ? '1px solid #E0E0E0'
                              : '1px solid #424242',
                        }"
                      >
                        <v-list-item-title>
                          <v-row no-gutters>
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
                                  >Name:
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
                                    size="x-small"
                                    :color="materialColors[itemIndex]"
                                    class="mr-2 pa-4"
                                  >
                                    {{ getInitial(`${item.raw?.givenName}`) }}
                                  </v-avatar>

                                  <span
                                    class="text-capitalize text-body-2"
                                    style="
                                      word-break: break-word;
                                      white-space: normal;
                                    "
                                  >
                                    {{
                                      `${item.raw?.givenName} ${item.raw?.surname}`
                                    }}
                                  </span>
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
                                  >Access Card:
                                </span>
                                <span
                                  class="text-truncate mt-1"
                                  :style="
                                    $vuetify.display.smAndDown
                                      ? 'font-size: .8rem;'
                                      : ''
                                  "
                                >
                                  {{
                                    item.raw.physical || item.raw.non_physical
                                      ? "Yes"
                                      : "N/A"
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
                                  >Physical NFC Card:
                                </span>
                                <span
                                  v-if="item.raw.physical"
                                  :class="`text-truncate mt-1 ${item.raw.physical.isActivated ? 'text-blue' : 'text-grey'}`"
                                  :style="
                                    $vuetify.display.smAndDown
                                      ? 'font-size: .8rem;'
                                      : ''
                                  "
                                >
                                  {{ item.raw.physical.cardNo }}
                                </span>
                                <span v-else class="text-body-2">N/A</span>
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
                                  >QR Code Access:
                                </span>
                                <span
                                  v-if="item.raw.non_physical"
                                  :class="`text-truncate mt-1 ${item.raw.non_physical.isActivated ? 'text-blue' : 'text-grey'}`"
                                  :style="
                                    $vuetify.display.smAndDown
                                      ? 'font-size: .8rem;'
                                      : ''
                                  "
                                >
                                  {{ item.raw.non_physical.cardNo }}
                                </span>
                                <span v-else class="text-body-2">N/A</span>
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
                                  {{ item?.raw?.residentType }}
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
                                  >Actions:
                                </span>
                                <span
                                  class="text-truncate mt-1"
                                  :style="
                                    $vuetify.display.smAndDown
                                      ? 'font-size: .8rem;'
                                      : ''
                                  "
                                >
                                  <v-icon
                                    @click="onDisplayProfile(item?.raw._id)"
                                    class="mr-1"
                                  >
                                    mdi-eye
                                  </v-icon>
                                  <v-icon
                                    @click="deleteDialog = true"
                                    class="ml-1"
                                  >
                                    mdi-delete-outline
                                  </v-icon>
                                  <v-icon class="ml-1"
                                    >mdi-dots-vertical</v-icon
                                  >
                                  <building-delete-resident-tenant
                                    :_id="item?.raw._id"
                                  ></building-delete-resident-tenant>
                                </span>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-list-item-title>
                      </v-list-item>
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
                        <span class="font-weight-bold text-h5">
                          Residents / Tenants
                        </span>
                      </v-row>
                    </v-col>

                    <v-col cols="12">
                      <v-row no-gutters justify="center">
                        <span class="caption text-disabled">
                          You don't have list of residents/tenants yet.
                        </span>
                      </v-row>
                    </v-col>
                  </v-row>
                </template>
              </v-data-iterator>

              <v-row v-if="pages > 0">
                <v-col cols="12" class="pa-4 mt-2">
                  <v-row no-gutters justify="end" align-content="center">
                    <span class="pt-1 pr-2">{{
                      unitSetupDetails?.residents?.pageRange
                    }}</span>
                    <v-btn
                      density="compact"
                      variant="text"
                      icon
                      class="mx-2"
                      :disabled="canPrevPage"
                    >
                      <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>

                    <v-btn
                      density="compact"
                      variant="text"
                      icon
                      class="mx-2"
                      :disabled="!canNextPage"
                    >
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-dialog v-model="profileDialog">
    <v-card>
      <template v-slot:loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="orange"
          height="8"
          indeterminate
        ></v-progress-linear>
      </template>
      <v-card-text>
        <v-row no-gutters class="pa-6 mb-1 profile-card" justify="center">
          <v-col cols="12" md="10" xxl="10" xl="10" lg="10">
            <BuildingProfile :userId="selectedProfileId" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

definePageMeta({
  middleware: "secure",
});

const {
  isUnitsLoaded,
  viewUnitSetup,
  units,
  setBlockLevelUnits,
  filterBySite,

  unitSetupDetails,
  canPrevPage,
  canNextPage,
  deleteDialog,
  page,
  pages,
  itemsPerPage,

  transferAccessCardDialog,
  reactiveDeactiveAccessCardDialog,
} = useBlockLevelUnit();

const {
  assignMultipleDialog,
  assignAccessCards,
  isAssigningNFC,
  transferAccessCards,
  updateAccessCardStatus,
} = useEntryPass();

const { materialColors, getInitial } = useUtils();
const { theme, setSnackbar } = useLocal();
const { mySite, myOrg } = useFilter();
const route = useRoute();
const router = useRouter();

const tab = ref("generalInfo");

const features = ref([
  { label: "Enable EntryPass (NFC) Card", value: false },
  { label: "Enable QR Code Access", value: false },
  { label: "Enable Resident / Tenant Access Card", value: false },
]);

const selectedUnit = ref({
  block: {
    name: "",
  },
  level: {
    level: "",
  },
  name: "",
});

const profileDialog = ref(false);
const selectedProfileId = ref("");

const search = ref("");
const unitOwner = ref("");
const selected = ref();
const cardDialogOptions = ref("");
const cardDialogAction = ref("");

const actions = computed(() => [
  {
    text: "Transfer Physical Card",
    action: () => {
      cardDialogOptions.value = "physical";
      transferAccessCardDialog.value = true;
    },
    disabled:
      !selected.value.physical && !isActivated(selected.value, "physical"),
  },
  {
    text: "Transfer QR Code Access Card",
    action: () => {
      cardDialogOptions.value = "qr code access";
      transferAccessCardDialog.value = true;
    },
    disabled:
      !selected.value.non_physical &&
      !isActivated(selected.value, "non_physical"),
  },
  {
    text: `${isActivated(selected.value, "physical") ? "Deactivate" : "Activate"} Physical Card`,
    action: () => {
      cardDialogOptions.value = "physical";
      cardDialogAction.value = isActivated(selected.value, "physical")
        ? "deactivate"
        : "activate";
      reactiveDeactiveAccessCardDialog.value = true;
    },
    disabled: !selected.value.physical,
  },
  {
    text: `${isActivated(selected.value, "non_physical") ? "Deactivate" : "Activate"} QR Code Access Card`,
    action: () => {
      cardDialogOptions.value = "non physical";
      cardDialogAction.value = isActivated(selected.value, "non_physical")
        ? "deactivate"
        : "activate";
      reactiveDeactiveAccessCardDialog.value = true;
    },
    disabled: !selected.value.non_physical,
  },
]);

const users = ref<any>([]);

const unitId = computed(() => route.params.id);

const noPhysicalCard = computed(() => {
  const items = getAllUsers();
  return items.filter((item: any) => !item.physical);
});

const noNonPhysicalCard = computed(() => {
  const items = getAllUsers();
  return items.filter((item: any) => !item.non_physical);
});

const noBothCards = computed(() => {
  const items = getAllUsers();
  return items.filter((item: any) => !item.non_physical && !item.physical);
});

const accessCardType = ref("");
const assignNFCActions = computed(() => [
  {
    text: "Physical Access Card",
    action: () => {
      accessCardType.value = "physical";
      assignMultipleDialog.value = true;
      users.value = noPhysicalCard.value;
    },
  },
  {
    text: "QR Code Access Card",
    action: () => {
      accessCardType.value = "qr code access";
      assignMultipleDialog.value = true;
      users.value = noNonPhysicalCard.value;
    },
  },
  {
    text: "Both",
    action: () => {
      accessCardType.value = "physical & qr code access";
      assignMultipleDialog.value = true;
      users.value = noBothCards.value;
    },
  },
]);

watch(search, (newValue: string) => {
  debouncedSearch(newValue);
});

watch(
  unitSetupDetails,
  (value: any) => {
    if (value && value.unitOwner) unitOwner.value = value.unitOwner._id;
  },
  { deep: true },
);

const debouncedSearch = debounce(async (value: string) => {
  await viewUnitSetup(route.params.id, 1, value);
}, 500);

onMounted(async () => {
  await setBlockLevelUnits({
    organization: myOrg.value ?? "",
    site: filterBySite.value || mySite.value,
  });

  selectedUnit.value = units.value.find((find) => find._id == route.params.id);

  await viewUnitSetup(route.params.id, 1, "");
});

function isActivated(card: any, type: string) {
  if (!card[type]) return false;
  if (!card[type].isActivated) return false;

  return true;
}

function getAllUsers() {
  const items = [] as any;

  if (unitSetupDetails.value && unitSetupDetails.value.unitOwner)
    items.push(unitSetupDetails.value.unitOwner);

  if (unitSetupDetails.value && unitSetupDetails.value.residents)
    items.push(...unitSetupDetails.value.residents.items);

  return items;
}

async function onUpdateCardStatus() {
  try {
    isAssigningNFC.value = true;
    const result = await updateAccessCardStatus({
      userId: selected.value._id,
      type: cardDialogOptions.value,
      status: cardDialogAction.value,
    });

    if (result && result.status == "error") {
      setSnackbar({
        text: result.message,
        type: result.status,
        modal: true,
      });
    }
    setSnackbar({
      text: `Access Card ${cardDialogAction.value}d successfully!`,
      type: "success",
      modal: true,
    });

    isAssigningNFC.value = false;
    reactiveDeactiveAccessCardDialog.value = false;
    await viewUnitSetup(unitId.value as string, 1, "");
  } catch (error: any) {
    setSnackbar({
      text: error,
      type: "error",
      modal: true,
    });
    isAssigningNFC.value = false;
  }
}

async function onTransfer(user: any) {
  try {
    isAssigningNFC.value = true;
    const result = await transferAccessCards({
      from: selected.value._id,
      to: user.value._id,
      type: cardDialogOptions.value,
    });

    if (result && result.status == "error") {
      setSnackbar({
        text: result.message,
        type: result.status,
        modal: true,
      });
    }
    setSnackbar({
      text: "Access Card transferred successfully!",
      type: "success",
      modal: true,
    });

    isAssigningNFC.value = false;
    transferAccessCardDialog.value = false;
    await viewUnitSetup(unitId.value as string, 1, "");
  } catch (error: any) {
    setSnackbar({
      text: error,
      type: "error",
      modal: true,
    });
    isAssigningNFC.value = false;
  }
}

async function onAssign(selected: string[]) {
  const type = ["physical", "qr code access"].includes(accessCardType.value)
    ? accessCardType.value
    : "both";

  try {
    isAssigningNFC.value = true;
    const result = await assignAccessCards({
      assignees: selected,
      type: type,
      unit: unitId.value as string,
    });

    if (result) {
      setSnackbar({
        text: result.message,
        type: result.status,
        modal: true,
      });
    }

    isAssigningNFC.value = false;
    assignMultipleDialog.value = false;
    await viewUnitSetup(unitId.value as string, 1, "");
  } catch (error: any) {
    setSnackbar({
      text: error,
      type: "error",
      modal: true,
    });
    isAssigningNFC.value = false;
  }
}

async function onRequestNFC() {
  // router.push(
  //   `/building/blocks/${unitOwner.value}/assign-nfc?site=${mySite.value}`,
  // );

  router.push({
    name: "forms-add-electronic-access-card",
    query: {
      site: mySite.value,
    },
  });
}

async function onAssignNFC() {
  router.push(
    `/building/blocks/${unitOwner.value}/assign-nfc?site=${mySite.value}`,
  );
}

async function onDisplayProfile(id: string) {
  profileDialog.value = true;
  selectedProfileId.value = id;
}
</script>

<style scoped>
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

:deep() .v-selection-control .v-label {
  font-size: 13px;
}
</style>
