<template>
  <v-row no-gutters class="pa-8" justify="center">
    <v-col cols="12" xxl="4" xl="8" lg="8">
      <v-row no-gutters>
        <v-col cols="12">
          <v-row no-gutters class="fill-height" align="end">
            <v-col cols="6">
              <v-row no-gutters>
                <v-col
                  cols="12"
                  class="text-h6 font-weight-bold text-capitalize"
                  style="letter-spacing: 2px !important"
                  ><back-button /> {{ user.givenName }} {{ user.surname }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row no-gutters justify="end" align-content="end">
                <v-menu v-model="actionMenu" location="bottom">
                  <template #activator="{ props }">
                    <v-btn variant="text" v-bind="props">
                      <template #append>
                        <v-icon>{{
                          props["aria-expanded"] === "false"
                            ? "mdi-chevron-down"
                            : "mdi-chevron-up"
                        }}</v-icon>
                      </template>
                      Options
                    </v-btn>
                  </template>

                  <v-card>
                    <v-list density="compact" class="pa-0">
                      <template
                        v-for="(actionItem, actionIndex) in actions"
                        :key="actionItem.text"
                      >
                        <v-list-item
                          v-if="actionItem.display"
                          @click="openDialog(actionItem)"
                          :disabled="actionItem.disabled"
                        >
                          <template #title>
                            <span class="text-caption">
                              {{ actionItem.text }}
                            </span>
                          </template>
                        </v-list-item>

                        <v-divider
                          v-if="actionIndex + 1 !== actions.length"
                        ></v-divider>
                      </template>
                    </v-list>
                  </v-card>
                </v-menu>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" class="font-weight-light mt-4">
          <v-card
            width="100%"
            elevation="0"
            style="border-width: thin"
            min-height="368px"
            class="d-flex justify-center align-center"
          >
            <v-row no-gutters>
              <v-col cols="12" class="font-weight-light">
                <v-card width="100%" elevation="0">
                  <v-list class="pa-0" density="compact">
                    <template
                      v-for="(item, itemIndex) in items"
                      :key="item.text"
                    >
                      <v-list-item
                        :prepend-icon="item.image ? null : item.icon"
                        :prepend-avatar="item.image"
                        class="py-6"
                        density="compact"
                        @click="openDialog(item)"
                        :disabled="item.text == 'Tenant Documents'"
                      >
                        <v-list-item-title class="text-subtitle-1">
                          {{ item.text }}
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-subtitle-2">
                          <div
                            v-if="item.text == 'Address' && gettingAddress"
                            class="dot-pulse"
                          ></div>
                          <div v-else>
                            {{ item.subtitle }}
                            <v-icon
                              end
                              v-if="item.text == 'NRIC/Passport Number'"
                              @click.prevent.stop="showNRIC = !showNRIC"
                            >
                              {{ showNRIC ? "mdi-eye" : "mdi-eye-off" }}
                            </v-icon>
                          </div>
                        </v-list-item-subtitle>
                      </v-list-item>
                      <v-divider
                        v-if="itemIndex + 1 !== items.length"
                      ></v-divider>
                    </template>
                    <v-divider></v-divider>
                    <v-list-item class="py-6" density="compact">
                      <v-list-item-title>
                        <v-icon start class="mr-8"> mdi-file-document </v-icon>
                        Tenancy Agreements
                      </v-list-item-title>
                      <template v-if="user.tenantDocument.length">
                        <template
                          v-for="document in user.tenantDocument"
                          :key="document._id"
                        >
                          <v-list class="pa-0" density="compact">
                            <v-list-item density="compact">
                              <v-list-item-subtitle
                                class="text-subtitle-1 ml-11"
                              >
                                <NuxtLink
                                  :to="`/api/files/${document._id}`"
                                  target="_blank"
                                >
                                  {{ document.name }}
                                </NuxtLink>
                              </v-list-item-subtitle>
                            </v-list-item>
                          </v-list>
                        </template>
                      </template>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item class="py-6" density="compact">
                      <v-list-item-title>
                        <v-icon start class="mr-8"> mdi-comment-text </v-icon>
                        Remarks ({{ user.remarks.length }})
                      </v-list-item-title>
                      <v-list-item-subtitle v-if="user.remarks.length">
                        <v-expansion-panels class="my-4 ml-5" variant="popout">
                          <v-expansion-panel v-for="remark in user.remarks">
                            <v-expansion-panel-title v-slot="{ expanded }">
                              <v-row no-gutters align="center">
                                <v-col
                                  cols="12"
                                  md="3"
                                  class="d-flex justify-start"
                                >
                                  {{ remark.name }}
                                </v-col>
                                <v-col
                                  cols="12"
                                  md="4"
                                  class="d-flex justify-start mt-2 mt-md-0"
                                >
                                  {{
                                    `${standardFormatDate(
                                      new Date(remark.dateTime),
                                    )}&nbsp;&nbsp;&nbsp;${standardFormatTime(
                                      new Date(remark.dateTime),
                                    )}`
                                  }}
                                </v-col>
                                <v-col
                                  cols="12"
                                  md="5"
                                  class="d-flex justify-start text-capitalize mt-2 mt-md-0"
                                >
                                  <v-chip
                                    v-if="remark.status"
                                    class="text-capitalize"
                                    :color="
                                      remark.status === 'active'
                                        ? 'green'
                                        : remark.status === 'pending approval'
                                          ? 'blue'
                                          : 'red'
                                    "
                                  >
                                    {{ remark.status }}
                                  </v-chip>
                                </v-col>
                              </v-row>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                              <v-row no-gutters>
                                {{ remark.message }}
                              </v-row>
                            </v-expansion-panel-text>
                          </v-expansion-panel>
                        </v-expansion-panels>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item
                      class="py-6"
                      density="compact"
                      v-if="user.vehicleNo"
                    >
                      <v-list-item-title>
                        <v-icon start class="mr-8"> mdi-file-document </v-icon>
                        Car Registration Documents
                      </v-list-item-title>
                      <template v-if="user.carRegistration.length">
                        <template
                          v-for="document in user.carRegistration"
                          :key="document._id"
                        >
                          <v-list class="pa-0" density="compact">
                            <v-list-item density="compact">
                              <v-list-item-subtitle
                                class="text-subtitle-1 ml-11"
                              >
                                <NuxtLink
                                  :to="`/api/files/${document._id}`"
                                  target="_blank"
                                >
                                  {{ document.name }}
                                </NuxtLink>
                              </v-list-item-subtitle>
                            </v-list-item>
                          </v-list>
                        </template>
                      </template>
                    </v-list-item>
                    <v-divider></v-divider>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-col>

    <!-- dialog -->
    <v-dialog
      v-model="dialog"
      transition="dialog-right-transition"
      fullscreen
      persistent
      :class="`${$vuetify.display.mdAndUp && 'dialog_desktop'}`"
    >
      <v-card
        :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
        :class="`${theme == 'light' && 'bg-white'} px-3 h-100 ${$vuetify.display.mdAndUp && 'rounded-s-xl'}`"
      >
        <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
          <span class="font-weight-bold pl-4 pt-1 text-capitalize">
            {{ fieldType.text }}
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
          <v-row
            v-if="
              ![
                'Approve Resident',
                'Approve Deletion',
                'Reject Resident',
                'Reject Deletion',
                'Suspend Resident',
                'Resubmit Resident',
                'Reactivate Resident',
              ].includes(fieldType.text)
            "
            class="fill-height"
            justify="center"
            align-content="center"
          >
            <!-- Profile photo-->
            <v-col
              v-if="fieldType.text == 'Full Name'"
              cols="12"
              class="text-center"
            >
              <v-avatar size="300" class="mx-auto">
                <v-img
                  :src="profilePicture || '/images/default-profile.svg'"
                  cover
                ></v-img>
              </v-avatar>
            </v-col>
            <!-- First Name  -->
            <v-col v-if="fieldType.text == 'Full Name'" cols="12" class="mt-10">
              <v-text-field
                v-model="user.givenName"
                label="First Name"
                density="comfortable"
                :rules="[requiredInput]"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <!-- Last Name  -->
            <v-col v-if="fieldType.text == 'Full Name'" cols="12">
              <v-text-field
                v-model="user.surname"
                label="Last Name"
                density="comfortable"
                :rules="[requiredInput]"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <!-- Block  -->
            <v-col v-if="fieldType.text == 'Address'" cols="12" class="mb-4">
              <v-autocomplete
                v-model="user.block"
                :items="allBlocks"
                item-title="name"
                item-value="_id"
                label="Block"
                density="comfortable"
                hide-details
                :loading="isBlocksLoading"
                :rules="[requiredInput]"
                @update:modelValue="onSelectBlock(user.block as string)"
                clearable
              ></v-autocomplete>
            </v-col>
            <!-- Level  -->
            <v-col v-if="fieldType.text == 'Address'" cols="12" class="mb-4">
              <v-autocomplete
                v-model="user.level"
                :items="allBlockLevels"
                item-title="level"
                item-value="_id"
                label="Level"
                density="comfortable"
                hide-details
                :loading="isLevelsLoading"
                :rules="[requiredInput]"
                @update:modelValue="
                  onSelectBlockLevel(user.block as string, user.level as string)
                "
                clearable
              ></v-autocomplete>
            </v-col>
            <!-- Unit  -->
            <v-col v-if="fieldType.text == 'Address'" cols="12" class="mb-4">
              <v-autocomplete
                v-model="user.unitNumber"
                :items="allUnits"
                item-title="name"
                item-value="_id"
                label="Unit"
                density="comfortable"
                hide-details
                :loading="isUnitsLoading"
                :rules="[requiredInput]"
                clearable
              ></v-autocomplete>
            </v-col>
            <!-- Birthday -->
            <v-col v-if="fieldType.text == 'Birthday'" cols="12" class="mb-4">
              <v-menu :close-on-content-click="false" v-model="menu">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="formattedDate"
                    :rules="[requiredInput]"
                    label="Birthday"
                    density="comfortable"
                    v-bind="props"
                    @click="menu = true"
                    outlined
                  >
                    <template #prepend-inner>
                      <v-icon class="cursor-pointer">
                        mdi-calendar-month-outline
                      </v-icon>
                    </template>
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="dob"
                  :max="maxDate"
                  @update:modelValue="onDateSelected"
                  :format="customFormat"
                >
                  <template v-slot:header="{}"></template>
                </v-date-picker>
              </v-menu>
            </v-col>
            <!-- NRIC -->
            <v-col
              v-if="fieldType.text == 'NRIC/Passport Number'"
              cols="12"
              class="mb-4"
            >
              <v-text-field
                v-model="user.nric"
                label="NRIC/Passport Number"
                density="comfortable"
                :rules="[requiredInput]"
                clearable
              ></v-text-field>
            </v-col>
            <!-- Vehicle Color -->
            <v-col
              v-if="fieldType.text == 'Vehicle Color'"
              cols="12"
              class="mb-4"
            >
              <v-text-field
                v-model="user.vehicleColor"
                label="Vehicle Color"
                density="comfortable"
                :rules="[requiredInput]"
                clearable
              ></v-text-field>
            </v-col>
            <!-- Vehicle Model -->
            <v-col
              v-if="fieldType.text == 'Vehicle Model'"
              cols="12"
              class="mb-4"
            >
              <v-text-field
                v-if="fieldType.text == 'Vehicle Model'"
                v-model="user.vehicleModel"
                label="Vehicle Model"
                density="comfortable"
                :rules="[requiredInput]"
                clearable
              ></v-text-field>
            </v-col>
            <!-- Vehicle Number -->
            <v-col
              v-if="fieldType.text == 'Vehicle Number'"
              cols="12"
              class="mb-4"
            >
              <v-text-field
                v-if="fieldType.text == 'Vehicle Number'"
                v-model="user.vehicleNo"
                label="Vehicle Number"
                density="comfortable"
                :rules="[requiredInput]"
                clearable
              ></v-text-field>
            </v-col>
            <!-- Email -->
            <v-col v-if="fieldType.text == 'Email'" cols="12" class="mb-4">
              <v-text-field
                v-model="user.email"
                label="Email"
                density="comfortable"
                :rules="[requiredInput]"
                clearable
              ></v-text-field>
            </v-col>
            <!-- Resident Type-->
            <v-col
              v-if="fieldType.text == 'Resident Type'"
              cols="12"
              class="mb-4"
            >
              <v-select
                v-model="user.residentType"
                :items="['Home/Unit Owner', 'House/Unit Tenant']"
                label="Resident Type"
                density="comfortable"
                :rules="[requiredInput]"
                clearable
              ></v-select>
            </v-col>

            <!-- Contact Number -->
            <v-col
              v-if="fieldType.text == 'Contact Number'"
              cols="5"
              class="py-0 mt-2"
            >
              <v-autocomplete
                v-model="prefix"
                label="Country Code"
                density="comfortable"
                :items="prefixes"
                item-title="country"
                item-value="value"
                menu-icon="mdi-chevron-down"
                chips
              >
                <template v-slot:chip="{ props, item }">
                  <v-row no-gutters v-bind="props">
                    <v-col cols="5">
                      <v-avatar size="20" :image="item.raw.flag" class="mr-3">
                      </v-avatar>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="7">
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
                      <v-chip color="primary">{{ item.raw.country }}</v-chip>
                    </v-col>
                  </v-row>
                </template>
              </v-autocomplete>
            </v-col>
            <v-spacer v-if="fieldType.text == 'Contact Number'"></v-spacer>
            <v-col
              v-if="fieldType.text == 'Contact Number'"
              cols="7"
              class="mr py-0 mt-2"
            >
              <v-text-field
                class="mb-6"
                v-model="primaryPhone"
                :rules="[requiredInput]"
                label="Phone Number"
                density="comfortable"
                @input="validatePhoneNumber"
              ></v-text-field>
            </v-col>

            <!-- submit / cancel -->
            <v-col cols="12">
              <v-row no-gutters>
                <v-btn
                  theme="dark"
                  class="font-weight-bold"
                  :disabled="
                    fieldType.text == 'Full Name'
                      ? !user.givenName || !user.surname
                      : fieldType.text == 'Address'
                        ? !user.block || !user.level || !user.unitNumber
                        : fieldType.text == 'Birthday'
                          ? !formattedDate
                          : fieldType.text == 'NRIC/Passport Number'
                            ? !user.nric
                            : fieldType.text == 'Vehicle Color'
                              ? !user.vehicleColor
                              : fieldType.text == 'Vehicle Model'
                                ? !user.vehicleModel
                                : fieldType.text == 'Vehicle Number'
                                  ? !user.vehicleNo
                                  : fieldType.text == 'Email'
                                    ? !user.email
                                    : fieldType.text == 'Contact Number'
                                      ? !user.primaryPhone
                                      : fieldType.text == 'Resident Type'
                                        ? !user.residentType
                                        : false
                  "
                  @click="submit"
                  :loading="loading"
                >
                  submit
                </v-btn>
                <v-btn
                  variant="text"
                  class="font-weight-bold"
                  @click="closeDialog()"
                >
                  cancel
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
          <!-- Update status -->
          <v-row
            v-else
            class="fill-height"
            justify="center"
            align-content="center"
          >
            <v-col cols="12" class="text-h6 text-center">
              {{
                `Are you sure you want to ${fieldType.text == "Approve Resident" ? "approve" : fieldType.text == "Approve Deletion" ? "approve the deletion request of" : fieldType.text == "Reject Resident" ? "reject" : fieldType.text == "Reject Deletion" ? "reject the deletion request of" : fieldType.text == "Suspend Resident" ? "suspend" : fieldType.text == "Resubmit Resident" ? "resubmit" : "re-activate"} this user account?`
              }}
            </v-col>

            <v-col cols="12" class="mt-4">
              <v-row no-gutters justify="center">
                <v-dialog
                  v-if="
                    [
                      'Reject Deletion',
                      'Suspend Resident',
                      'Reject Resident',
                      'Resubmit Resident',
                    ].includes(fieldType.text)
                  "
                  max-width="500"
                >
                  <template v-slot:activator="{ props: activatorProps }">
                    <v-btn
                      theme="dark"
                      class="font-weight-bold"
                      v-bind="activatorProps"
                    >
                      Yes
                    </v-btn>
                  </template>

                  <template v-slot:default="{ isActive }">
                    <v-card title="Remarks">
                      <v-card-text>
                        <v-textarea
                          v-model="remarks"
                          label="Remarks"
                          :rules="[requiredInput]"
                          outlined
                          rows="3"
                          clearable
                        ></v-textarea>
                      </v-card-text>

                      <v-card-actions>
                        <v-btn text="Cancel" @click="isActive.value = false" />
                        <v-btn
                          text="Submit"
                          @click="submit"
                          :disabled="!remarks"
                          :loading="loading"
                        />
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
                <v-btn
                  v-else
                  theme="dark"
                  class="font-weight-bold"
                  @click="submit"
                  :loading="loading"
                >
                  Yes
                </v-btn>

                <v-btn
                  variant="text"
                  class="font-weight-bold"
                  @click="closeDialog()"
                >
                  No
                </v-btn>
              </v-row>
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
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "secure",
});

const gettingAddress = ref(false);

const { requiredInput } = useUtils();

const { theme } = useLocal();

const { mySite } = useFilter();
const { getUserById, setUser, user, updateUserDetails, updateResidentStatus } =
  useUser();

const { standardFormatDate, standardFormatTime } = useUtils();

const organization = computed(() => useRoute().params.organization as string);
const site = computed(() => useRoute().params.site as string);
const resident = computed(() => useRoute().params.resident as string);
const profilePicture = ref<string>("");
const address = ref<Record<string, any>>();
const showNRIC = ref(false);

onMounted(async () => {
  const _user = (await getUserById(resident.value)) as TUser;
  if (_user) {
    setUser(_user);
  }

  gettingAddress.value = true;
  const getSite = await getSiteById(user.value.site! as string);
  const getBlock = await getBlockById(user.value.block!);
  const getLevel = await getBlockLevelById(user.value.level!);
  const getUnit = await getUnitById(user.value.unitNumber!);

  const dataAddr = {
    site: getSite?.name,
    block: (getBlock as TBlock[])[0]?.name,
    level: (getLevel as TBlockLevel[])[0].level,
    unit: (getUnit as TBlockLevelUnit[])[0]?.name,
  };
  address.value = dataAddr;
  gettingAddress.value = false;

  const getProfilePic = await useLocalFetch(
    `/api/files/${user.value.profilePicture}`,
  );

  profilePicture.value =
    URL.createObjectURL(getProfilePic.data.value as Blob) ?? "";
});

const actionMenu = ref(false);
const params = ref({
  organization: organization.value,
  site: site.value,
  resident: resident.value,
});

const actions = computed(() => {
  return [
    {
      text: "Approve Resident",
      status: "approve-account",
      //to: "organizations-organization-sites-site-residents-resident-approve-account",
      params: params.value,
      disabled: false,
      display:
        /^(pending approval|pending approval\/resubmitted|rejected|resubmit)$/i.test(
          user.value.status,
        ) && !user.value.deletionRequested,
    },
    {
      text: "Approve Deletion",
      status: "approve-deleted",
      //to: "organizations-organization-sites-site-residents-resident-approve-deletion-request",
      params: params.value,
      disabled: false,
      display: user.value.deletionRequested,
    },
    {
      text: "Reject Resident",
      status: "reject-account",
      //to: "organizations-organization-sites-site-residents-resident-reject",
      params: params.value,
      disabled: false,
      display:
        /^(pending approval|pending approval\/resubmitted|resubmit)$/i.test(
          user.value.status,
        ) && !user.value.deletionRequested,
    },
    {
      text: "Reject Deletion",
      status: "reject-deleted",
      //to: "organizations-organization-sites-site-residents-resident-reject-deletion-request",
      params: params.value,
      disabled: false,
      display: user.value.deletionRequested,
    },
    {
      text: "Suspend Resident",
      status: "suspended",
      //to: "organizations-organization-sites-site-residents-resident-suspend",
      params: params.value,
      disabled: false,
      display:
        /^(active)$/i.test(user.value.status) && !user.value.deletionRequested, //user.value.status === "active" ? true : false,
    },
    {
      text: "Resubmit Resident",
      status: "resubmit",
      //to: "organizations-organization-sites-site-residents-resident-resubmit",
      params: params.value,
      disabled: false,
      display:
        /^(pending approval|pending approval\/resubmitted|rejected)$/i.test(
          user.value.status,
        ) && !user.value.deletionRequested, //user.value.status === "suspended" ? true : false,
    },
    {
      text: "Reactivate Resident",
      status: "re-activate",
      //to: "organizations-organization-sites-site-residents-resident-activate",
      params: params.value,
      disabled: false,
      display:
        /^(suspended)$/i.test(user.value.status) &&
        !user.value.deletionRequested, //user.value.status === "suspended" ? true : false,
    },
  ];
});

const items = computed(() => {
  return [
    {
      text: "Full Name",
      image: profilePicture.value,
      //to: "organizations-organization-sites-site-residents-resident-name",
      params: params.value,
      icon: "mdi-account-circle",
      subtitle: `${user.value.givenName} ${user.value.surname}`,
    },
    {
      text: "Address",
      //to: "organizations-organization-sites-site-residents-resident-address",
      params: params.value,
      icon: "mdi-map-marker",
      subtitle: `${address.value?.site} ${address.value?.block} ${address.value?.level} ${address.value?.unit}`,
    },
    {
      text: "Birthday",
      //to: "organizations-organization-sites-site-residents-resident-birthday",
      params: params.value,
      icon: "mdi-cake-variant",
      subtitle: standardFormatDate(
        new Date(user.value.dateOfBirth?.toString()!),
      ),
    },
    {
      text: "NRIC/Passport Number",
      // to: "organizations-organization-sites-site-residents-resident-nric",
      params: params.value,
      icon: "mdi-barcode",
      subtitle: !showNRIC.value
        ? nricChecker(user.value.nric as string)
        : user.value.nric,
    },
    {
      text: "Vehicle Color",
      // to: "organizations-organization-sites-site-residents-resident-vehicleColor",
      params: params.value,
      icon: "mdi-palette",
      subtitle: user.value.vehicleColor,
    },
    {
      text: "Vehicle Model",
      //to: "organizations-organization-sites-site-residents-resident-vehicleModel",
      params: params.value,
      icon: "mdi-car",
      subtitle: user.value.vehicleModel,
    },
    {
      text: "Vehicle Number",
      //to: "organizations-organization-sites-site-residents-resident-vehicleNumber",
      params: params.value,
      icon: "mdi-numeric-8-box",
      subtitle: user.value.vehicleNo,
    },
    {
      text: "Email",
      //to: "organizations-organization-sites-site-residents-resident-email",
      params: params.value,
      icon: "mdi-email",
      subtitle: user.value.email,
    },
    {
      text: "Contact Number",
      //to: "organizations-organization-sites-site-residents-resident-contactNumber",
      params: params.value,
      icon: "mdi-phone",
      subtitle: user.value.primaryPhone,
    },
    {
      text: "Resident Type",
      // to: "organizations-organization-sites-site-residents-resident-type",
      params: params.value,
      icon: "mdi-account-group",
      subtitle: user.value.residentType,
    },
  ];
});

const dialog = ref(false);
const loading = ref(false);
const fieldType = ref({} as any);

// Address
const { getSiteById } = useSite();
const { getBlockById } = useBlock();
const { getBlockLevelById } = useBlockLevel();
const { getUnitById } = useBlockLevelUnit();

const isBlocksLoading = ref(false);
const isLevelsLoading = ref(false);
const isUnitsLoading = ref(false);

const { allBlocks, getAllBlocks } = useBlock();
const { allBlockLevels, getAllLevelsUsingBlock } = useBlockLevel();
const { getAllUnitsUsingLevel, allUnits } = useBlockLevelUnit();

async function onSelectBlock(block: string) {
  user.value.level = "";
  user.value.unitNumber = "";
  allBlockLevels.value = [];
  allUnits.value = [];

  isLevelsLoading.value = true;
  const results = await getAllLevelsUsingBlock(block, mySite.value);
  allBlockLevels.value = results;
  isLevelsLoading.value = false;
}
async function onSelectBlockLevel(block: string, blockLevel: string) {
  user.value.unitNumber = "";
  allUnits.value = [];

  isUnitsLoading.value = true;
  const results = await getAllUnitsUsingLevel({
    block: block,
    level: blockLevel,
    site: mySite.value,
  });
  allUnits.value = results;
  isUnitsLoading.value = false;
}

// Birthday
const menu = ref(false);
const dob = ref(null);

const maxDate = computed(() => {
  const now = new Date();
  now.setDate(now.getDate() - 1); // Set maximum date to yesterday
  return now.toISOString().substr(0, 10);
});
const formattedDate = computed(() => {
  if (!user.value.dateOfBirth) return null;
  const date = new Date(user.value.dateOfBirth);
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + 8 * 60); // Adjust to SGT
  return `${pad(date.getDate())}/${pad(
    date.getMonth() + 1,
  )}/${date.getFullYear()}`;
});
const customFormat = (value: any) => {
  if (!value) return null;
  const [year, month, day] = value.split("-");
  return `${pad(month)}/${pad(day)}/${year}`;
};
const pad = (number: number) => {
  if (number < 10) {
    return "0" + number;
  }
  return number;
};
const onDateSelected = <T,>(value: T) => {
  user.value.dateOfBirth = value as any;
  menu.value = false;
};

// Contact Number
import phoneCode from "@/components/phone-code.json";
const prefixes = phoneCode;
const prefix = ref<string | undefined>("");
const primaryPhone = ref("");

const validatePhoneNumber = () => {
  user.value.primaryPhone = user.value.primaryPhone.replace(/\D/g, "");
};

function nricChecker(data: string) {
  const length = data.length;
  if (length) {
    const masked = "*".repeat(length - 4); // Replace all but last 4 characters with asterisks
    const lastFour = data.slice(-4); // Get last 4 characters
    return masked + lastFour; // Combine masked part with the last 4 characters
  }
}

async function reFetch() {
  const _user = (await getUserById(resident.value)) as TUser;
  if (_user) {
    setUser(_user);
  }

  const getSite = await getSiteById(user.value.site! as string);
  const getBlock = await getBlockById(user.value.block!);
  const getLevel = await getBlockLevelById(user.value.level!);
  const getUnit = await getUnitById(user.value.unitNumber!);

  const dataAddr = {
    site: getSite?.name,
    block: (getBlock as TBlock[])[0]?.name,
    level: (getLevel as TBlockLevel[])[0].level,
    unit: (getUnit as TBlockLevelUnit[])[0]?.name,
  };
  address.value = dataAddr;
}

async function openDialog(item: any) {
  fieldType.value = item;
  let usr = user.value;
  user.value = JSON.parse(JSON.stringify(usr));

  if (item.text == "Address") {
    isBlocksLoading.value = true;
    const blockResults = await getAllBlocks(mySite.value);
    allBlocks.value = blockResults;
    isBlocksLoading.value = false;

    isLevelsLoading.value = true;
    const levelResults = await getAllLevelsUsingBlock(
      user.value.block,
      mySite.value,
    );
    allBlockLevels.value = levelResults;
    isLevelsLoading.value = false;

    isUnitsLoading.value = true;
    const unitResults = await getAllUnitsUsingLevel({
      block: user.value.block,
      level: user.value.level,
      site: mySite.value,
    });
    allUnits.value = unitResults;
    isUnitsLoading.value = false;
  }

  if (item.text == "Contact Number") {
    primaryPhone.value = user.value.primaryPhone.split(" ")[1];

    prefix.value = phoneCode.find(
      (i) => i.dial_code === user.value.primaryPhone.split(" ")[0],
    )?.country;
  }

  dialog.value = true;
}

async function closeDialog() {
  fieldType.value = {};
  remarks.value = "";
  dialog.value = false;
  await reFetch();
}

const { setSnackbar } = useLocal();

const remarks = ref("");

async function submit() {
  loading.value = true;
  try {
    if (
      ![
        "Approve Resident",
        "Approve Deletion",
        "Reject Resident",
        "Reject Deletion",
        "Suspend Resident",
        "Resubmit Resident",
        "Reactivate Resident",
      ].includes(fieldType.value.text)
    ) {
      if (fieldType.value.text == "Contact Number") {
        const dial_code = phoneCode.find(
          (i) => i.country === prefix.value,
        )?.dial_code;
        const data: any = {
          primaryPhone: primaryPhone.value,
          prefix: dial_code,
        };
        await updateUserDetails({
          id: resident.value,
          data,
        });
      } else {
        const data: any = {
          givenName: user.value.givenName,
          surname: user.value.surname,
          block: { _id: user.value.block },
          level: { _id: user.value.level },
          unitNumber: { _id: user.value.unitNumber },
          dateOfBirth: user.value.dateOfBirth,
          nric: user.value.nric,
          vehicleColor: user.value.vehicleColor,
          vehicleModel: user.value.vehicleModel,
          vehicleNo: user.value.vehicleNo,
          email: user.value.email,
          residentType: user.value.residentType,
        };
        await updateUserDetails({
          id: resident.value,
          data,
        });
      }
      setSnackbar({
        text: "Resident's account details successfully updated!",
        modal: true,
        type: "success",
      });
    } else {
      await updateResidentStatus({
        id: resident.value,
        status: fieldType.value.status,
        remarks: remarks.value || "",
      });
      setTimeout(async () => {
        await navigateTo(
          {
            name: "organizations-organization-sites-site-residents",
            query: { site: mySite.value },
          },
          {
            replace: true,
          },
        );
      }, 1000);
      setSnackbar({
        text: "Resident's account status successfully updated!",
        modal: true,
        type: "success",
      });
    }
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
  loading.value = false;
  closeDialog();
}
</script>

<style scoped>
.dot-pulse {
  position: relative;
  left: -9999px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #9880ff;
  color: #9880ff;
  box-shadow: 9999px 0 0 -5px;
  animation: dot-pulse 1.5s infinite linear;
  animation-delay: 0.25s;
}
.dot-pulse::before,
.dot-pulse::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #9880ff;
  color: #9880ff;
}
.dot-pulse::before {
  box-shadow: 9984px 0 0 -5px;
  animation: dot-pulse-before 1.5s infinite linear;
  animation-delay: 0s;
}
.dot-pulse::after {
  box-shadow: 10014px 0 0 -5px;
  animation: dot-pulse-after 1.5s infinite linear;
  animation-delay: 0.5s;
}

@keyframes dot-pulse-before {
  0% {
    box-shadow: 9984px 0 0 -5px;
  }
  30% {
    box-shadow: 9984px 0 0 2px;
  }
  60%,
  100% {
    box-shadow: 9984px 0 0 -5px;
  }
}
@keyframes dot-pulse {
  0% {
    box-shadow: 9999px 0 0 -5px;
  }
  30% {
    box-shadow: 9999px 0 0 2px;
  }
  60%,
  100% {
    box-shadow: 9999px 0 0 -5px;
  }
}
@keyframes dot-pulse-after {
  0% {
    box-shadow: 10014px 0 0 -5px;
  }
  30% {
    box-shadow: 10014px 0 0 2px;
  }
  60%,
  100% {
    box-shadow: 10014px 0 0 -5px;
  }
}

.grey-field {
  pointer-events: none;
  background-color: #f2f2f2;
}
.dialog_desktop {
  margin: 0 0 0 auto;
  max-width: 28%;
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

:deep() .v-text-field input {
  font-size: 13px !important;
}

:deep() .v-textarea .v-field__input {
  font-size: 13px !important;
}

:deep() .v-switch .v-label {
  padding-right: 10px;
  font-size: 13px;
}

:deep() .v-switch .v-selection-control {
  display: flex;
  flex-direction: row-reverse;
}
</style>
