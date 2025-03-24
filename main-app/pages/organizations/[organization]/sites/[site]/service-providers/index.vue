<template>
  <v-row no-gutters class="pa-8">
    <v-col cols="12">
      <g-card :loading="isTableLoadingSiteCollab">
        <v-row no-gutters>
          <v-col cols="12">
            <v-row>
              <v-col cols="12">
                <v-data-iterator :items="sitesCollab" :items-per-page="10">
                  <template v-slot:header>
                    <v-row no-gutters class="px-4 py-4">
                      <v-col cols="12">
                        <v-row align="center" no-gutters>
                          <v-col cols="12" class="mb-2">
                            <span class="font-weight-bold text-h6">
                              Service Provider
                            </span>
                          </v-col>

                          <v-col
                            cols="12"
                            lg="4"
                            md="5"
                            class="mb-2 mb-md-0 pr-md-1 pr-lg-0"
                          >
                            <v-row no-gutters>
                              <v-col cols="12" lg="11">
                                <search-text-field
                                  @on-search="onSearch($event)"
                                  @clear-search="callItBack"
                                ></search-text-field>
                              </v-col>
                            </v-row>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="12"
                            md="3"
                            lg="2"
                            class="mb-2 mb-md-0 pr-md-1"
                          >
                            <v-select
                              v-model:model-value="selectFilter"
                              :items="filterOpt"
                              hide-details
                              density="compact"
                              menu-icon="mdi-chevron-down"
                              @update:model-value="onFilter(selectFilter)"
                            >
                            </v-select>
                          </v-col>

                          <v-col cols="12" lg="6" md="4" sm="12">
                            <v-row no-gutters align="end" justify="end">
                              <v-col cols="6" md="6" lg="4" sm="6" class="pr-1">
                                <v-btn
                                  color="primary"
                                  variant="outlined"
                                  @click="isShowCollaborationDialog = true"
                                  class="w-100"
                                >
                                  <span v-if="$vuetify.display.xlAndUp"
                                    >Show&nbsp;</span
                                  >
                                  Pending Invites
                                </v-btn>
                              </v-col>

                              <v-col cols="6" md="6" lg="4" sm="6">
                                <v-btn
                                  color="primary"
                                  width="100%"
                                  @click="isShowDataListingDialog = true"
                                >
                                  Show&nbsp;
                                  <span v-if="$vuetify.display.xlAndUp"
                                    >Service Providers</span
                                  >
                                  <span v-else> Providers</span>
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-divider v-if="$vuetify.display.lgAndUp" />

                    <v-list-item v-if="$vuetify.display.smAndUp">
                      <v-list-item-title>
                        <v-row
                          no-gutters
                          class="pb-4 pb-lg-0 d-none d-sm-flex text-body-2 text-caption mt-2 mt-lg-0"
                        >
                          <template v-for="(col, idx) in columnHeader">
                            <v-col
                              :key="idx"
                              cols="12"
                              v-if="col.visible"
                              :sm="col.sm"
                              :md="col.md"
                              :lg="col.lg"
                              class="text-capitalize white--text text"
                            >
                              <v-row
                                no-gutters
                                class="fill-height"
                                align-content="center"
                              >
                                <span
                                  class="d-inline-block text-truncate text-capitalize w-100 font-weight-bold"
                                  :class="`text-${col.align}`"
                                >
                                  {{ col.title }}
                                </span>
                              </v-row>
                            </v-col>
                          </template>
                        </v-row>
                      </v-list-item-title>
                    </v-list-item>
                    <v-divider v-if="$vuetify.display.lgAndUp" />
                  </template>
                  <template #default="{ items }">
                    <v-list class="pa-0">
                      <template
                        v-for="(item, itemIndex) in items"
                        :key="item.raw._id"
                      >
                        <v-list-item class="py-4 px4">
                          <template #default>
                            <v-list-item-title
                              :class="
                                $vuetify.display.smAndDown ||
                                $vuetify.display.md
                                  ? 'py-2 border-md px-2 rounded-lg mb-2 my-2'
                                  : 'py-0 px-2 mx-2 my-0 text-body-2'
                              "
                            >
                              <v-row no-gutters>
                                <v-col
                                  cols="12"
                                  sm="4"
                                  md="4"
                                  lg="3"
                                  class="text-capitalize white--text text mb-2 mb-sm-0"
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
                                      class="mr-2 d-flex d-sm-none font-weight-bold"
                                      >Name:
                                    </span>
                                    <span
                                      class="text-truncate"
                                      v-if="
                                        item.raw.serviceProvider &&
                                        Boolean(item.raw.serviceProvider) &&
                                        typeof item.raw.serviceProvider ===
                                          'object' &&
                                        Object.keys(item.raw.serviceProvider)
                                          .length > 0
                                      "
                                      :style="
                                        $vuetify.display.smAndDown
                                          ? 'font-size: .8rem;'
                                          : ''
                                      "
                                    >
                                      <v-avatar
                                        :size="
                                          $vuetify.display.mdAndDown
                                            ? 'x-small'
                                            : 'small'
                                        "
                                        color="#FF5252"
                                        class="text-subtitle-2 mr-1"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="17"
                                          viewBox="0 0 16 17"
                                          fill="none"
                                        >
                                          <path
                                            d="M7.91682 13.5332C7.96127 13.5332 8.00571 13.5221 8.05016 13.4999C8.0946 13.4776 8.12793 13.4554 8.15016 13.4332L13.6168 7.96654C13.7502 7.8332 13.8474 7.6832 13.9085 7.51654C13.9696 7.34987 14.0002 7.1832 14.0002 7.01654C14.0002 6.83876 13.9696 6.66931 13.9085 6.5082C13.8474 6.34709 13.7502 6.20543 13.6168 6.0832L10.7835 3.24987C10.6613 3.11654 10.5196 3.01931 10.3585 2.9582C10.1974 2.89709 10.0279 2.86654 9.85016 2.86654C9.68349 2.86654 9.51682 2.89709 9.35016 2.9582C9.18349 3.01931 9.03349 3.11654 8.90016 3.24987L8.71682 3.4332L9.95016 4.6832C10.1168 4.83876 10.239 5.01654 10.3168 5.21654C10.3946 5.41654 10.4335 5.62765 10.4335 5.84987C10.4335 6.31654 10.2752 6.7082 9.95849 7.02487C9.64182 7.34154 9.25016 7.49987 8.78349 7.49987C8.56127 7.49987 8.34738 7.46098 8.14182 7.3832C7.93627 7.30543 7.75571 7.18876 7.60016 7.0332L6.35016 5.79987L3.43349 8.71654C3.40016 8.74987 3.37516 8.78598 3.35849 8.82487C3.34182 8.86376 3.33349 8.90543 3.33349 8.94987C3.33349 9.03876 3.36682 9.11931 3.43349 9.19154C3.50016 9.26376 3.57793 9.29987 3.66682 9.29987C3.71127 9.29987 3.75571 9.28876 3.80016 9.26654C3.8446 9.24431 3.87793 9.22209 3.90016 9.19987L6.16682 6.9332L7.10016 7.86654L4.85016 10.1332C4.81682 10.1665 4.79182 10.2026 4.77516 10.2415C4.75849 10.2804 4.75016 10.3221 4.75016 10.3665C4.75016 10.4554 4.78349 10.5332 4.85016 10.5999C4.91682 10.6665 4.9946 10.6999 5.08349 10.6999C5.12793 10.6999 5.17238 10.6888 5.21682 10.6665C5.26127 10.6443 5.2946 10.6221 5.31682 10.5999L7.58349 8.34987L8.51682 9.2832L6.26682 11.5499C6.23349 11.5721 6.20849 11.6054 6.19182 11.6499C6.17516 11.6943 6.16682 11.7388 6.16682 11.7832C6.16682 11.8721 6.20016 11.9499 6.26682 12.0165C6.33349 12.0832 6.41127 12.1165 6.50016 12.1165C6.5446 12.1165 6.58627 12.1082 6.62516 12.0915C6.66404 12.0749 6.70016 12.0499 6.73349 12.0165L9.00016 9.76654L9.93349 10.6999L7.66682 12.9665C7.63349 12.9999 7.60849 13.036 7.59182 13.0749C7.57516 13.1138 7.56682 13.1554 7.56682 13.1999C7.56682 13.2888 7.60293 13.3665 7.67516 13.4332C7.74738 13.4999 7.82793 13.5332 7.91682 13.5332ZM7.90016 14.8665C7.48904 14.8665 7.12516 14.7304 6.80849 14.4582C6.49182 14.186 6.30571 13.8443 6.25016 13.4332C5.87238 13.3776 5.55571 13.2221 5.30016 12.9665C5.0446 12.711 4.88904 12.3943 4.83349 12.0165C4.45571 11.961 4.14182 11.8026 3.89182 11.5415C3.64182 11.2804 3.48904 10.9665 3.43349 10.5999C3.01127 10.5443 2.66682 10.361 2.40016 10.0499C2.13349 9.73876 2.00016 9.37209 2.00016 8.94987C2.00016 8.72765 2.04182 8.51376 2.12516 8.3082C2.20849 8.10265 2.32793 7.92209 2.48349 7.76654L6.35016 3.91654L8.53349 6.09987C8.55571 6.1332 8.58904 6.1582 8.63349 6.17487C8.67793 6.19154 8.72238 6.19987 8.76682 6.19987C8.86682 6.19987 8.95016 6.16931 9.01682 6.1082C9.08349 6.04709 9.11682 5.96654 9.11682 5.86654C9.11682 5.82209 9.10849 5.77765 9.09182 5.7332C9.07516 5.68876 9.05016 5.65543 9.01682 5.6332L6.63349 3.24987C6.51127 3.11654 6.3696 3.01931 6.20849 2.9582C6.04738 2.89709 5.87793 2.86654 5.70016 2.86654C5.53349 2.86654 5.36682 2.89709 5.20016 2.9582C5.03349 3.01931 4.88349 3.11654 4.75016 3.24987L2.40016 5.61654C2.30016 5.71654 2.21682 5.8332 2.15016 5.96654C2.08349 6.09987 2.03905 6.2332 2.01682 6.36654C1.9946 6.49987 1.9946 6.63598 2.01682 6.77487C2.03905 6.91376 2.08349 7.04431 2.15016 7.16654L1.18349 8.1332C0.994601 7.87765 0.855712 7.59709 0.766823 7.29154C0.677934 6.98598 0.644601 6.67765 0.666823 6.36654C0.689045 6.05543 0.766823 5.75265 0.900156 5.4582C1.03349 5.16376 1.21682 4.89987 1.45016 4.66654L3.80016 2.31654C4.06682 2.06098 4.36404 1.86654 4.69182 1.7332C5.0196 1.59987 5.35571 1.5332 5.70016 1.5332C6.0446 1.5332 6.38071 1.59987 6.70849 1.7332C7.03627 1.86654 7.32793 2.06098 7.58349 2.31654L7.76682 2.49987L7.95016 2.31654C8.21682 2.06098 8.51404 1.86654 8.84182 1.7332C9.1696 1.59987 9.50571 1.5332 9.85016 1.5332C10.1946 1.5332 10.5307 1.59987 10.8585 1.7332C11.1863 1.86654 11.4779 2.06098 11.7335 2.31654L14.5502 5.1332C14.8057 5.38876 15.0002 5.6832 15.1335 6.01654C15.2668 6.34987 15.3335 6.68876 15.3335 7.0332C15.3335 7.37765 15.2668 7.71376 15.1335 8.04154C15.0002 8.36931 14.8057 8.66098 14.5502 8.91654L9.08349 14.3665C8.92793 14.5221 8.74738 14.6443 8.54182 14.7332C8.33627 14.8221 8.12238 14.8665 7.90016 14.8665Z"
                                            fill="white"
                                          />
                                        </svg>
                                      </v-avatar>
                                      <span
                                        :style="
                                          $vuetify.display.xs
                                            ? 'font-size: .8rem;'
                                            : ''
                                        "
                                        :class="
                                          $vuetify.display.smAndUp
                                            ? 'text-body-2'
                                            : ''
                                        "
                                      >
                                        {{
                                          item.raw.serviceProvider.name || "N/A"
                                        }}
                                      </span>
                                    </span>
                                    <span v-else>N/A</span>

                                    <span
                                      v-if="
                                        item.raw.serviceProvider &&
                                        Boolean(item.raw.serviceProvider) &&
                                        typeof item.raw.serviceProvider ===
                                          'object' &&
                                        Object.keys(item.raw.serviceProvider)
                                          .length > 0 &&
                                        ($vuetify.display.sm ||
                                          $vuetify.display.md)
                                      "
                                      :style="
                                        $vuetify.display.smAndDown
                                          ? 'font-size: .8rem;'
                                          : ''
                                      "
                                      class="w-100 text-lowercase mt-2 text-truncate mr-2"
                                    >
                                      <v-icon color="red" class="ml-1 mr-1">
                                        mdi-at
                                      </v-icon>
                                      {{
                                        item.raw.serviceProvider.email || "N/A"
                                      }}
                                    </span>

                                    <span
                                      v-if="
                                        item.raw.serviceProvider &&
                                        Boolean(item.raw.serviceProvider) &&
                                        typeof item.raw.serviceProvider ===
                                          'object' &&
                                        Object.keys(item.raw.serviceProvider)
                                          .length > 0 &&
                                        ($vuetify.display.sm ||
                                          $vuetify.display.md)
                                      "
                                      :style="
                                        $vuetify.display.smAndDown
                                          ? 'font-size: .8rem;'
                                          : ''
                                      "
                                      class="w-100 text-lowercase mt-2 text-truncate mr-2"
                                    >
                                      <v-icon class="ml-1 mr-1 mr-sm-2">
                                        mdi-phone </v-icon
                                      >{{
                                        item.raw.serviceProvider
                                          .contactNumber || "N/A"
                                      }}
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="2"
                                  lg="3"
                                  class="text mb-2 mb-sm-0"
                                  v-if="
                                    $vuetify.display.xs ||
                                    $vuetify.display.lgAndUp
                                  "
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
                                      >Email:
                                    </span>
                                    <span
                                      v-if="
                                        item.raw.serviceProvider &&
                                        Boolean(item.raw.serviceProvider) &&
                                        typeof item.raw.serviceProvider ===
                                          'object' &&
                                        Object.keys(item.raw.serviceProvider)
                                          .length > 0
                                      "
                                      :style="
                                        $vuetify.display.smAndDown
                                          ? 'font-size: .8rem;'
                                          : ''
                                      "
                                    >
                                      <v-icon color="red" class="ml-1 mr-1">
                                        mdi-at
                                      </v-icon>
                                      <span
                                        :style="
                                          $vuetify.display.xs
                                            ? 'font-size: .8rem;'
                                            : ''
                                        "
                                        :class="
                                          $vuetify.display.smAndUp
                                            ? 'text-body-2'
                                            : ''
                                        "
                                      >
                                        {{
                                          item.raw.serviceProvider.email ||
                                          "N/A"
                                        }}
                                      </span>
                                    </span>
                                    <span v-else>N/A</span>

                                    <span
                                      v-if="
                                        item.raw.serviceProvider &&
                                        Boolean(item.raw.serviceProvider) &&
                                        typeof item.raw.serviceProvider ===
                                          'object' &&
                                        Object.keys(item.raw.serviceProvider)
                                          .length > 0 &&
                                        $vuetify.display.lgAndUp
                                      "
                                      :style="
                                        $vuetify.display.smAndDown
                                          ? 'font-size: .8rem;'
                                          : ''
                                      "
                                      class="w-100 mt-2"
                                    >
                                      <v-icon class="ml-1 mr-1 mr-md-2">
                                        mdi-phone </v-icon
                                      ><span
                                        :style="
                                          $vuetify.display.xs
                                            ? 'font-size: .8rem;'
                                            : ''
                                        "
                                        :class="
                                          $vuetify.display.smAndUp
                                            ? 'text-body-2'
                                            : ''
                                        "
                                      >
                                        {{
                                          item.raw.serviceProvider
                                            .contactNumber || "N/A"
                                        }}
                                      </span>
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="2"
                                  class="text text-capitalize mb-2 mb-sm-0"
                                  v-if="$vuetify.display.xs"
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
                                      >Contact:
                                    </span>
                                    <span
                                      v-if="
                                        item.raw.serviceProvider &&
                                        Boolean(item.raw.serviceProvider) &&
                                        typeof item.raw.serviceProvider ===
                                          'object' &&
                                        Object.keys(item.raw.serviceProvider)
                                          .length > 0
                                      "
                                      :style="
                                        $vuetify.display.smAndDown
                                          ? 'font-size: .8rem;'
                                          : ''
                                      "
                                    >
                                      <v-icon class="ml-1 mr-1 mr-md-2">
                                        mdi-phone </v-icon
                                      >{{
                                        item.raw.serviceProvider
                                          .contactNumber || "N/A"
                                      }}
                                    </span>
                                    <span v-else>N/A</span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  sm="4"
                                  lg="3"
                                  class="text text-capitalize mb-2 mb-sm-0"
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
                                    ><span
                                      class="mr-2 d-flex d-sm-none font-weight-bold"
                                      >Service:
                                    </span>

                                    <span
                                      v-if="
                                        item.raw.serviceProvider &&
                                        Boolean(item.raw.serviceProvider) &&
                                        typeof item.raw.serviceProvider ===
                                          'object' &&
                                        Object.keys(item.raw.serviceProvider)
                                          .length > 0
                                      "
                                      :style="
                                        $vuetify.display.xs
                                          ? 'font-size: .8rem;'
                                          : ''
                                      "
                                      :class="
                                        $vuetify.display.smAndUp
                                          ? 'text-body-2'
                                          : ''
                                      "
                                      ><v-icon class="ml-1 mr-1">
                                        mdi-toolbox-outline
                                      </v-icon>
                                      <span
                                        v-if="
                                          typeof item.raw.serviceProvider
                                            .service === 'string'
                                        "
                                        >{{
                                          item.raw.serviceProvider.service ||
                                          "N/A"
                                        }}
                                      </span>
                                      <span v-else>
                                        {{
                                          (item.raw.serviceProvider.service &&
                                            item.raw.serviceProvider
                                              .service[0]) ||
                                          "N/A"
                                        }}
                                      </span>
                                    </span>
                                    <span v-else>N/A</span>

                                    <span
                                      v-if="
                                        item.raw.assignedGroup &&
                                        Boolean(item.raw.assignedGroup) &&
                                        typeof item.raw.assignedGroup ===
                                          'object' &&
                                        Object.keys(item.raw.assignedGroup)
                                          .length > 0 &&
                                        ($vuetify.display.sm ||
                                          $vuetify.display.md)
                                      "
                                      :style="
                                        $vuetify.display.smAndDown
                                          ? 'font-size: .8rem;'
                                          : ''
                                      "
                                      class="w-100 text-lowercase mt-2 text-truncate mr-2"
                                    >
                                      <v-icon class="ml-1 mr-1">
                                        mdi-account-group
                                      </v-icon>
                                      <span
                                        :style="
                                          $vuetify.display.xs
                                            ? 'font-size: .8rem;'
                                            : ''
                                        "
                                        :class="
                                          $vuetify.display.smAndUp
                                            ? 'text-body-2'
                                            : ''
                                        "
                                      >
                                        {{
                                          item.raw.assignedGroup.groupName ||
                                          "N/A"
                                        }}
                                      </span>
                                    </span>

                                    <span
                                      v-if="
                                        item.raw.assignedGroup &&
                                        Boolean(item.raw.assignedGroup) &&
                                        typeof item.raw.assignedGroup ===
                                          'object' &&
                                        Object.keys(item.raw.assignedGroup)
                                          .length > 0 &&
                                        $vuetify.display.lgAndUp
                                      "
                                      :style="
                                        $vuetify.display.smAndDown
                                          ? 'font-size: .8rem;'
                                          : ''
                                      "
                                      class="w-100 mt-2"
                                    >
                                      <v-icon class="ml-1 mr-1">
                                        mdi-account-group
                                      </v-icon>
                                      <span
                                        :style="
                                          $vuetify.display.xs
                                            ? 'font-size: .8rem;'
                                            : ''
                                        "
                                        :class="
                                          $vuetify.display.smAndUp
                                            ? 'text-body-2'
                                            : ''
                                        "
                                      >
                                        {{
                                          item.raw.assignedGroup.groupName ||
                                          "N/A"
                                        }}
                                      </span>
                                    </span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  md="2"
                                  class="text text-capitalize"
                                  v-if="$vuetify.display.xs"
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
                                    ><span
                                      class="mr-2 d-flex d-md-none font-weight-bold"
                                      >Assigned:
                                    </span>

                                    <span
                                      v-if="
                                        item.raw.assignedGroup &&
                                        Boolean(item.raw.assignedGroup) &&
                                        typeof item.raw.assignedGroup ===
                                          'object' &&
                                        Object.keys(item.raw.assignedGroup)
                                          .length > 0
                                      "
                                      :style="
                                        $vuetify.display.smAndDown
                                          ? 'font-size: .8rem;'
                                          : ''
                                      "
                                    >
                                      <v-icon class="ml-1 mr-1">
                                        mdi-account-group
                                      </v-icon>
                                      {{
                                        item.raw.assignedGroup.groupName ||
                                        "N/A"
                                      }}
                                    </span>
                                    <span v-else>N/A</span>
                                  </v-row>
                                </v-col>

                                <v-col
                                  cols="12"
                                  sm="3"
                                  lg="2"
                                  class="text text-capitalize mt-2 mt-sm-0"
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
                                    ><span
                                      class="mr-2 d-flex d-sm-none font-weight-bold"
                                      >Status: </span
                                    ><v-chip
                                      v-if="item.raw.status"
                                      class="text-capitalize"
                                      :color="
                                        item.raw.status === 'approved'
                                          ? 'green'
                                          : 'red'
                                      "
                                    >
                                      {{
                                        /approved/i.test(item.raw.status)
                                          ? "Collaborated"
                                          : "Pending"
                                      }}
                                    </v-chip>
                                  </v-row>
                                </v-col>
                                <v-col
                                  cols="12"
                                  sm="1"
                                  class="text text-capitalize mt-2 mt-sm-0"
                                >
                                  <v-row
                                    no-gutters
                                    justify="end"
                                    class="fill-height text-truncate"
                                    align-content="center"
                                  >
                                    <v-menu>
                                      <template v-slot:activator="{ props }">
                                        <v-icon
                                          density="compact"
                                          v-bind="props"
                                          class="pa-4 border-md rounded-xl"
                                        >
                                          mdi-dots-vertical
                                        </v-icon>
                                      </template>
                                      <v-list>
                                        <v-list-item
                                          :to="{
                                            name: 'organizations-organization-sites-site-service-providers-provider',
                                            params: {
                                              organization: orgId,
                                              site: siteId,
                                              provider:
                                                item.raw.serviceProvider._id,
                                            },
                                          }"
                                          @click="
                                            viewServiceProvider(item.raw._id)
                                          "
                                        >
                                          <template #title>
                                            <span class="text-caption">
                                              View Service Provider
                                            </span>
                                          </template>
                                        </v-list-item>
                                      </v-list>
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
                            Looks like there's No Service Provider Collaborated.
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
            <FooterPagination
              @next-page="nextPage()"
              @prev-page="prevPage()"
              :pageRange="pageRange"
              :page="page"
              :pages="pages"
            />
          </v-col>
        </v-row>
      </g-card>

      <organizations-sites-service-provider-collab
        v-if="isShowCollaborationDialog"
        :isShowCollaborationDialog="isShowCollaborationDialog"
        @on-hide-collaboration-dialog="isShowCollaborationDialog = false"
      />

      <organizations-sites-service-provider-table
        v-if="isShowDataListingDialog"
        :isShowDataListingDialog="isShowDataListingDialog"
        @on-hide-data-listing-dialog="isShowDataListingDialog = false"
        @on-show-invite-service-provider-dialog="
          isShowInviteServiceProviderDialog = true
        "
      />

      <organizations-sites-service-provider-add
        v-if="isShowInviteServiceProviderDialog"
        :isConfirmModal="isShowInviteServiceProviderDialog"
        @close-modal="isShowInviteServiceProviderDialog = false"
        @submit-data="submit($event)"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type organization from "~/middleware/organization";
import vuetify from "~/plugins/vuetify";

definePageMeta({
  middleware: ["secure"],
});
const { currentUser } = useLocalAuth();
const { setSnackbar } = useLocal();
const {
  setSitesCollab,
  nextPage,
  prevPage,
  sitesCollab,
  page,
  pages,
  pageRange,
  isTableLoadingSiteCollab,
  searchSiteCollab,
  selectFilter,
} = useSiteCollab();
const { sendInviteLink, setServiceProviders } = useServiceProvider();
const route = useRoute();
const orgId = computed(() => route.params.organization as string);
const siteId = computed(() => {
  if (
    typeof currentUser.value.site === "object" ||
    currentUser.value.site === null
  ) {
    return String(route.params.site);
  }
  return currentUser.value.site;
});
const providerId = ref<any>();
function viewServiceProvider(id: any) {
  providerId.value = id;
}

const isShowInviteServiceProviderDialog = ref(false);
const isShowDataListingDialog = ref(false);
const isShowCollaborationDialog = ref(false);
const filterOpt = ref([
  "All",
  "Security",
  "Cleaning",
  "Pest Control",
  "Landscape",
  "Pool Maintenance",
  "Lift Maintenance",
  "M&E",
]);

const isLgAndUp = ref(window.innerWidth >= 1280);
window.addEventListener("resize", () => {
  isLgAndUp.value = window.innerWidth >= 1280;
});

const columnHeader = computed(() => {
  const baseHeaders = [
    {
      sm: "4",
      md: "4",
      lg: "3",
      title: "Name / Email / Contact",
      align: "left",
      visible: true,
    },
    {
      sm: "4",
      md: "4",
      lg: "3",
      title: "Service / Assigned",
      align: "left",
      visible: true,
    },
    {
      sm: "3",
      md: "3",
      lg: "2",
      title: "Status",
      align: "left",
      visible: true,
    },
  ];
  if (isLgAndUp.value) {
    baseHeaders[0].title = "Name";
    baseHeaders.splice(1, 0, {
      sm: "3",
      md: "3",
      lg: "3",
      title: "Email / Contact",
      align: "left",
      visible: true,
    });
  }

  return baseHeaders;
}) as unknown as {
  sm: string;
  md: string;
  lg: string;
  title: string;
  align: string;
  visible: any;
}[];

onMounted(async () => {
  await getAllSiteCollabs();
});

async function getAllSiteCollabs() {
  await setSitesCollab({
    site: siteId.value,
    service: selectFilter.value,
    status: "approved",
  });
}

const submit = async (email: any) => {
  try {
    const result = await sendInviteLink({
      email,
      site: siteId.value || String(route.params.site),
    });
    setSnackbar({ text: result, modal: true, type: "success" });
    isShowInviteServiceProviderDialog.value = false;
    await setServiceProviders();
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
};

async function onSearch(keywords: string) {
  searchSiteCollab.value = keywords;
  page.value = 1; // reset when search keywords
  await getAllSiteCollabs();
}

async function callItBack() {
  searchSiteCollab.value = "";
  await getAllSiteCollabs();
}

async function onFilter(value: string) {
  await getAllSiteCollabs();
}
</script>
