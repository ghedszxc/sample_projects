<template>
  <v-row no-gutters class="pa-md-8 pa-4">
    <v-col cols="12">
      <v-card width="100%" elevation="3" height="100%" :loading="isUsersLoaded">
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
            <v-row no-gutters>
              <v-col cols="12" class="d-flex ga-4 items-center pa-4">
                <v-btn
                  fav
                  density="compact"
                  icon="mdi-arrow-left"
                  variant="text"
                  class="mb-1"
                  @click="useRouter().push('/facilities')"
                />
                <h1 class="titleDesign">Facility</h1>
              </v-col>
              <v-divider></v-divider>

              <v-row no-gutters class="pa-0 ma-0">
                <v-col cols="12" md="4" lg="4" xl="4" class="pa-4 ma-0">
                  <v-row no-gutters>
                    <v-col cols="12">
                      <h3 class="titleDesign pb-1 font-weight-medium">
                        Facility Information
                      </h3>
                      <v-text-field
                        v-model="facility.name"
                        label="Facility name"
                        variant="solo-filled"
                        :rules="[requiredInput]"
                        style="margin-bottom: 10px"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" align="center">
                      <v-card
                        variant="outlined"
                        width="100"
                        height="100"
                        style="
                          border-radius: 757.819px;
                          align-content: center;
                          margin-bottom: 10px;
                        "
                      >
                        <v-img
                          :src="
                            !facility.icon
                              ? `/icons/facility/badminton-blue.svg`
                              : `/icons/facility/${theme === 'dark' ? 'dark' : 'light'}/${facility.icon}`
                          "
                          elevation="0"
                          style="width: 61px; height: 61px; margin: auto"
                        ></v-img>
                      </v-card>
                      <v-autocomplete
                        v-model="facility.icon"
                        :items="facilityIcons"
                        variant="filled"
                        label="Select Icon"
                        :rules="[requiredInput]"
                        prepend-inner-icon="mdi-image"
                        style="margin-bottom: 10px"
                      >
                        <template v-slot:selection="{ item, index }">
                          {{ facility.icon?.split(".svg")[0] }}
                        </template>
                        <template v-slot:item="{ props, item }">
                          <v-row no-gutters v-bind="props" class="px-3">
                            <v-col cols="10" class="pa-2">
                              <v-row no-gutters>
                                <v-col cols="1">
                                  <v-icon size="x-large">
                                    <v-img
                                      :src="`/icons/facility/${theme === 'dark' ? 'dark' : 'light'}/${item.raw}`"
                                      cover
                                    ></v-img>
                                  </v-icon>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="9" class="text-caption">
                                  <v-row
                                    no-gutters
                                    class="fill-height"
                                    align-content="center"
                                  >
                                    {{ item.raw.split(".svg")[0] }}
                                  </v-row>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </template>
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-col cols="12" sm="12">
                    <v-row no-gutters>
                      <v-col cols="12" sm="6" md="12">
                        <v-row no-gutters>
                          <v-col cols="12" sm="11" md="12">
                            <span>Featured Image</span>
                            <v-img
                              class="mx-auto border-md"
                              height="300"
                              lazy-src="/images/facility/empty.jpg"
                              max-width="500"
                              :src="
                                facility.featuredImage?._id
                                  ? `/api/files/${facility.featuredImage?._id}`
                                  : '/images/facility/empty.jpg'
                              "
                            >
                              <template v-slot:placeholder>
                                <div
                                  class="d-flex align-center justify-center fill-height"
                                >
                                  <v-progress-circular
                                    color="grey-lighten-4"
                                    indeterminate
                                  ></v-progress-circular>
                                </div>
                              </template>
                            </v-img>
                            <v-file-input
                              class="mt-2"
                              v-model="featuredImage"
                              label="Upload Featured"
                              prepend-icon="mdi-camera"
                              variant="filled"
                              @change="saveFeaturedImage"
                              accept="image/*"
                            ></v-file-input>
                            <v-col
                              cols="12"
                              class="mt-1"
                              v-if="facility.featuredImage"
                            >
                              <v-chip-group column multiple>
                                <NuxtLink
                                  :to="`/api/files/${facility.featuredImage?._id}`"
                                  target="_blank"
                                  style="color: #eb261e"
                                >
                                  <v-chip
                                    closable
                                    @click:close="
                                      removeFile(facility.featuredImage._id)
                                    "
                                    class="text-wrap text-caption pa-6"
                                  >
                                    {{ facility?.featuredImage?.name }}
                                  </v-chip>
                                </NuxtLink>
                              </v-chip-group>
                            </v-col>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="12" sm="6" md="12">
                        <span>Gallery</span>
                        <skeleton-loader-component
                          v-if="loader"
                          :loading="loader"
                        />
                        <v-carousel height="300" v-else>
                          <v-carousel-item
                            :show-arrows="false"
                            v-if="facility.gallery.length === 0"
                            :src="'/images/facility/empty.jpg'"
                            cover
                            eager
                          >
                          </v-carousel-item>
                          <v-carousel-item
                            v-else
                            lazy-src="/images/facility/empty.jpg"
                            eager
                            v-for="(item, i) in facility.gallery"
                            :key="i"
                            :src="
                              item._id
                                ? `/api/files/${item._id}`
                                : '/images/facility/empty.jpg'
                            "
                            cover
                          >
                          </v-carousel-item>
                        </v-carousel>
                        <v-file-input
                          class="mt-2"
                          v-model="files"
                          label="Upload Photo"
                          prepend-icon="mdi-camera"
                          variant="filled"
                          @change="handleFile"
                          multiple
                          accept="image/*"
                        ></v-file-input>

                        <v-chip-group column multiple>
                          <template
                            v-for="file in facility?.gallery"
                            :key="file._id"
                          >
                            <NuxtLink
                              :to="`/api/files/${file?._id}`"
                              target="_blank"
                              style="color: #eb261e"
                            >
                              <v-chip
                                closable
                                @click:close="removeFileGallery(file._id)"
                                class="text-wrap text-caption pa-6"
                              >
                                {{ file.name }}
                              </v-chip>
                            </NuxtLink>
                          </template>
                        </v-chip-group>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-col>
                <v-divider :thickness="1" vertical></v-divider>
                <v-col cols="12" md="4" lg="4" xl="3" class="pa-4 ma-0">
                  <v-row no-gutters>
                    <v-col cols="8">
                      <h3 class="titleDesign">Facility Hour Interval:</h3>
                    </v-col>
                    <v-col cols="4">
                      <v-autocomplete
                        v-model="facility.hourInterval"
                        :items="hourIntervalList"
                        hide-details
                      />
                    </v-col>
                  </v-row>

                  <h3 class="titleDesign mt-4">Facility Availability</h3>
                  <v-card class="ma-2">
                    <v-col
                      cols="12"
                      v-for="(day, index) in daysList"
                      :key="index"
                    >
                      <v-row no-gutters>
                        <v-col cols="6" class="text-capitalize">
                          {{ day }}
                        </v-col>
                        <v-col cols="6" class="text-end">
                          <v-icon
                            @click="
                              facility[day].isEnabled = !facility[day].isEnabled
                            "
                            :color="facility[day].isEnabled ? 'green' : ''"
                          >
                            {{
                              facility[day].isEnabled
                                ? "mdi-check-circle"
                                : "mdi-check-circle-outline"
                            }}
                          </v-icon>
                        </v-col>
                      </v-row>

                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          sm="6"
                          md="6"
                          lg="6"
                          xl="6"
                          :class="{
                            'pr-0': $vuetify.display.smAndDown,
                            'pr-2': $vuetify.display.smAndUp,
                          }"
                        >
                          <span class="text-combobox">Time Slot Start</span>
                          <div @click="handleClick(!facility[day].isEnabled)">
                            <v-combobox
                              :items="timeList"
                              v-model="facility[day].startTime"
                              :disabled="!facility[day].isEnabled"
                              hide-details
                            ></v-combobox>
                          </div>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                          md="6"
                          lg="6"
                          xl="6"
                          :class="{
                            'pr-0': $vuetify.display.smAndDown,
                            'pr-2': $vuetify.display.smAndUp,
                          }"
                        >
                          <span class="text-combobox">Time Slot End</span>
                          <div @click="handleClick(!facility[day].isEnabled)">
                            <v-combobox
                              :items="
                                day === 'monday'
                                  ? endTimeListMonday
                                  : day === 'tuesday'
                                    ? endTimeListTuesday
                                    : day === 'wednesday'
                                      ? endTimeListWednesday
                                      : day === 'thursday'
                                        ? endTimeListThursday
                                        : day === 'friday'
                                          ? endTimeListFriday
                                          : day === 'saturday'
                                            ? endTimeListSaturday
                                            : day === 'sunday'
                                              ? endTimeListSunday
                                              : []
                              "
                              v-model="facility[day].endTime"
                              :disabled="!facility[day].isEnabled"
                              hide-details
                            ></v-combobox>
                          </div>
                        </v-col>
                      </v-row>
                      <v-row
                        no-gutters
                        v-if="facility[day].startTime && facility[day].endTime"
                      >
                        <span
                          class="mt-1 text-caption"
                          style="cursor: pointer"
                          @click="
                            openApplyTimeSlotsToSelectedDaysDialog(
                              facility[day].startTime,
                              facility[day].endTime,
                              day,
                            )
                          "
                        >
                          <v-icon size="small">mdi-content-copy</v-icon>
                          Apply to rest of the days
                        </span>
                      </v-row>
                    </v-col>
                  </v-card>
                </v-col>

                <v-divider :thickness="1" vertical></v-divider>
                <v-col cols="12" md="4" lg="4" xl="4" class="pa-2 ma-0">
                  <h3 class="titleDesign">Facility Description</h3>
                  <v-col cols="12" class="pa-0 ma-0">
                    <tiptap-editor
                      @content-updated="handleDescriptionUpdated"
                    />
                  </v-col>

                  <h3 class="titleDesign py-5">Facility Rules and Policies</h3>

                  <v-col cols="12" class="pa-0 ma-0">
                    <tiptap-editor @content-updated="handleRulesUpdated" />
                  </v-col>

                  <v-card class="mx-auto"> </v-card>
                </v-col>
              </v-row>
            </v-row>
          </v-col>

          <v-divider></v-divider>

          <v-col cols="12" class="pa-4">
            <v-row no-gutters justify="end" align-content="center">
              <v-btn
                :block="$vuetify.display.xs"
                rounded="lg"
                color="#1867C0"
                class="px-6"
                @click="saveData"
                :loading="loading"
                :disabled="!$ability.can('create', 'create-facility')"
              >
                Add facility
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <!-- dialog -->
    <v-dialog
      v-model="applyTimeSlotsToSelectedDaysDialog"
      transition="dialog-bottom-transition"
      persistent
      location="center"
      width="60vh"
      :style="`margin-left: ${$vuetify.display.mdAndUp ? '40' : '8'}px;`"
    >
      <v-card
        :style="{ border: `${theme == 'light' && 'thin solid #E8E8E8'}` }"
        :class="`${theme == 'light' && 'bg-white'} px-3 h-100`"
      >
        <v-toolbar :color="`${theme == 'dark' ? 'grey-darken-4' : 'white'}`">
          <span class="font-weight-bold pl-4 pt-1">
            Select the days below where you want to apply the time slot:
          </span>

          <v-spacer></v-spacer>
          <v-btn
            size="x-small"
            color="grey-darken-1"
            icon="mdi-close"
            @click="closeDialog()"
          ></v-btn>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text>
          <v-col cols="12">
            <v-row no-gutters>
              <v-col
                v-for="(day, i) in [
                  'monday',
                  'tuesday',
                  'wednesday',
                  'thursday',
                  'friday',
                  'saturday',
                  'sunday',
                ]"
                :key="i"
                cols="12"
                md="5"
                class="text-capitalize"
              >
                <v-checkbox
                  v-model="selectedDaysToApplyTheSelectedTimeSlot"
                  :label="day"
                  :value="day"
                  hide-details
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-col>

          <!-- submit / cancel -->
          <v-col cols="12">
            <v-row no-gutters>
              <v-btn
                flat
                color="error"
                class="font-weight-bold mr-4"
                @click="
                  applyTimeSlotsToSelectedDays(
                    selectedDaysToApplyTheSelectedTimeSlot,
                  )
                "
                :loading="loading"
                :disabled="!selectedDaysToApplyTheSelectedTimeSlot.length"
              >
                submit
              </v-btn>
              <v-btn
                flat
                variant="text"
                class="font-weight-bold"
                @click="closeDialog()"
              >
                close
              </v-btn>
            </v-row>
          </v-col>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure", "role"],
});

const { $ability } = useNuxtApp();

const { currentUser } = useLocalAuth();

const { addFacility, facility, setFacility } = useFacility();

const { setSnackbar } = useLocal();

const { requiredInput } = useUtils();

const { theme } = useLocal();

const loading = ref(false);

const applyTimeSlotsToSelectedDaysDialog = ref<boolean>(false);
const selectedDay = ref<string>("");
const selectedStartTime = ref<string>("");
const selectedEndTime = ref<string>("");
const selectedDaysToApplyTheSelectedTimeSlot = ref<string[]>([]);

const file = ref();
const files = ref<File[]>([]);
const featuredImage = ref<File[]>([]);
const loader = ref(true);

onMounted(() => {
  setFacility();
  facility.value.site = currentUser.value.site as string;
  loader.value = false;
});

const handleDescriptionUpdated = (newContent: any) => {
  // descriptionContent.value = newContent;
  facility.value.description = newContent;
};

const handleRulesUpdated = (newContent: any) => {
  facility.value.rulesAndPolicies = newContent;

  // rulesContent.value = newContent;
};

const facilityIcons = [
  "001-coffee-4.svg",
  "001-football.svg",
  "001-ice-cream-3.svg",
  "001-skin oil.svg",
  "002-basketball.svg",
  "002-cezve.svg",
  "002-lollipop.svg",
  "002-manicure.svg",
  "003-aromatherapy.svg",
  "003-latte.svg",
  "003-sweet.svg",
  "003-volleyball.svg",
  "004-boxing.svg",
  "004-chocolate.svg",
  "004-honey.svg",
  "004-hot tub.svg",
  "005-candle.svg",
  "005-coffee-grinder.svg",
  "005-flour.svg",
  "005-shuttlecock.svg",
  "006-cake-3.svg",
  "006-chess.svg",
  "006-tea-bag-1.svg",
  "006-teapot.svg",
  "007-baseball.svg",
  "007-cake-2.svg",
  "007-juice.svg",
  "007-wash feet.svg",
  "008-baseball.svg",
  "008-break.svg",
  "008-cucumber slice.svg",
  "008-tea-bag.svg",
  "009-american football.svg",
  "009-coffee-3.svg",
  "009-gingerbread-man.svg",
  "009-room heater.svg",
  "010-coffee-2.svg",
  "010-helmet.svg",
  "010-sauna.svg",
  "010-shrimp-1.svg",
  "011-artichoke.svg",
  "011-bowling.svg",
  "011-can.svg",
  "011-hot stone.svg",
  "012-avocado.svg",
  "012-soak.svg",
  "012-Surfboard.svg",
  "012-syrup.svg",
  "013-beef.svg",
  "013-kettle-1.svg",
  "013-ping pong.svg",
  "013-yoga mat.svg",
  "014-carrot.svg",
  "014-comb.svg",
  "014-expresso.svg",
  "014-football.svg",
  "015-bucket.svg",
  "015-coffee-machine-2.svg",
  "015-ice-cream.svg",
  "015-whistle.svg",
  "016-coffee-machine-1.svg",
  "016-coffee-shop.svg",
  "016-football.svg",
  "016-lotion.svg",
  "017-basketball.svg",
  "017-chinese-food.svg",
  "017-coffee-machine.svg",
  "017-humidifier.svg",
  "018-chocolate.svg",
  "018-medal.svg",
  "018-olive branch.svg",
  "018-orange-1.svg",
  "019-brush.svg",
  "019-kiwi.svg",
  "019-mocha.svg",
  "019-trophy.svg",
  "020-lemon.svg",
  "020-podium.svg",
  "020-tea-1.svg",
  "020-towel.svg",
  "021-badminton.svg",
  "021-bottle.svg",
  "021-firewood.svg",
  "021-pomegranate.svg",
  "022-bullseye.svg",
  "022-map.svg",
  "022-noodles-1.svg",
  "022-sponge.svg",
  "023-mortar.svg",
  "023-onigiri.svg",
  "023-rafting.svg",
  "023-spoons.svg",
  "024-bamboo.svg",
  "024-cocktail.svg",
  "024-dart.svg",
  "024-pie.svg",
  "025-blender.svg",
  "025-ice hockey.svg",
  "025-potato.svg",
  "025-sleeping mask.svg",
  "026-chips.svg",
  "026-football.svg",
  "026-hair dryer.svg",
  "026-sugar.svg",
  "027-bathrobe.svg",
  "027-croissant.svg",
  "027-goal box.svg",
  "027-spoon.svg",
  "028-basketball.svg",
  "028-sandals.svg",
  "028-sandwich.svg",
  "028-toast.svg",
  "029-donut.svg",
  "029-massage.svg",
  "029-pretzel.svg",
  "029-ski.svg",
  "030-frappe.svg",
  "030-rice-cooker-1.svg",
  "030-sauna.svg",
  "030-ski goggles.svg",
  "031-beauty treatment.svg",
  "031-flippers.svg",
  "031-tea-pot.svg",
  "031-watermelon.svg",
  "032-apple.svg",
  "032-cookies.svg",
  "032-snorkeling.svg",
  "032-wax.svg",
  "033-archery.svg",
  "033-skewer.svg",
  "033-tea-bag.svg",
  "034-cake-1.svg",
  "034-milkshake.svg",
  "034-tennis.svg",
  "035-coffee-1.svg",
  "035-pastry.svg",
  "035-running shoe.svg",
  "036-bowling.svg",
  "036-french-press.svg",
  "036-ham.svg",
  "037-dumbbell.svg",
  "037-milk.svg",
  "037-pasta.svg",
  "038-biscuit.svg",
  "038-caviar.svg",
  "038-kayak.svg",
  "039-coffee-beans.svg",
  "039-cricket.svg",
  "039-shrimp.svg",
  "040-golf.svg",
  "040-pepper.svg",
  "040-tea.svg",
  "041-billiard.svg",
  "041-coffee.svg",
  "041-sauces.svg",
  "042-bowling.svg",
  "042-piece-of-cake.svg",
  "042-pot.svg",
  "043-coffee-maker.svg",
  "043-golf.svg",
  "043-popcorn.svg",
  "044-bicycle.svg",
  "044-rice-cooker.svg",
  "044-water.svg",
  "045-basketball.svg",
  "045-kettle.svg",
  "045-vegetables-1.svg",
  "046-cake.svg",
  "046-coffee-machine.svg",
  "046-water bottle.svg",
  "047-coffee-bag.svg",
  "047-muffin.svg",
  "047-tennis.svg",
  "048-ice-cream-2.svg",
  "048-muffin.svg",
  "048-stopwatch.svg",
  "049-croissant.svg",
  "049-karate.svg",
  "049-olives.svg",
  "050-doughnut.svg",
  "050-skipping rope.svg",
  "050-take-away.svg",
  "051-lobster.svg",
  "052-breakfast.svg",
  "053-fish-2.svg",
  "054-burger.svg",
  "055-steak.svg",
  "056-ice-cream-1.svg",
  "057-star-fruit.svg",
  "058-salt.svg",
  "059-cheese.svg",
  "060-cracker.svg",
  "061-turnip.svg",
  "062-ribs-1.svg",
  "063-tuna-1.svg",
  "064-fried-egg-1.svg",
  "065-tuna.svg",
  "066-ribs.svg",
  "067-feeder.svg",
  "068-milk.svg",
  "069-fish-1.svg",
  "070-turkey.svg",
  "071-vegetables.svg",
  "072-fried-egg.svg",
  "073-roast-chicken.svg",
  "074-spaghetti.svg",
  "075-french-fries.svg",
  "076-fruit.svg",
  "077-cake.svg",
  "078-cinnamon-roll.svg",
  "079-fish.svg",
  "080-soup-1.svg",
  "081-jelly.svg",
  "082-dishes.svg",
  "083-oil-bottle.svg",
  "084-napkin.svg",
  "085-meat-grinder-1.svg",
  "086-meat-grinder.svg",
  "087-soup.svg",
  "088-ice-cream.svg",
  "089-taco-1.svg",
  "090-taco.svg",
  "091-toaster.svg",
  "092-sushi-2.svg",
  "093-sushi-1.svg",
  "094-sushi.svg",
  "095-noodles.svg",
  "096-rice.svg",
  "097-corkscrew.svg",
  "098-pear.svg",
  "099-orange.svg",
  "100-tomato.svg",
];

function handleClick(disabled: boolean) {
  if (disabled) {
    setSnackbar({
      text: "Please check the day to select the time slot",
      modal: true,
      type: "error",
    });
  }
}

function openApplyTimeSlotsToSelectedDaysDialog(
  startTime: string,
  endTime: string,
  Day: string,
) {
  selectedDay.value = Day;
  selectedStartTime.value = startTime;
  selectedEndTime.value = endTime;
  applyTimeSlotsToSelectedDaysDialog.value = true;
  selectedDaysToApplyTheSelectedTimeSlot.value.push(Day);
}

async function applyTimeSlotsToSelectedDays(Days: string[]) {
  for await (const day of Days) {
    facility.value[day].isEnabled = true;
    facility.value[day].startTime = selectedStartTime.value;
  }

  for await (const day of Days) {
    facility.value[day].endTime = selectedEndTime.value;
  }
  closeDialog();
}

function closeDialog() {
  applyTimeSlotsToSelectedDaysDialog.value = false;
  selectedDay.value = "";
  selectedStartTime.value = "";
  selectedEndTime.value = "";
}

function handleFile() {
  file.value = files.value.map((file: any) => ({
    name: file.name,
    data: file,
    progress: 0,
    url: URL.createObjectURL(file),
  }));

  for (let i = 0; i < file.value.length; i++) {
    const formData = new FormData();
    formData.append("file", file.value[i].data);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/files/upload?status=draft");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        file.value[i].progress = Math.round((event.loaded / event.total) * 100);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);

        file.value[i].id = response.id;
        if (response.id) {
          facility.value.gallery.push({
            _id: response.id,
            name: file.value[i].name,
          });
        }
      }
    };

    xhr.send(formData);
  }
}

function saveFeaturedImage() {
  file.value = featuredImage.value.map((file: any) => ({
    name: file.name,
    data: file,
    progress: 0,
    url: URL.createObjectURL(file),
  }));

  const formData = new FormData();
  formData.append("file", file.value[0].data);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/files/upload?status=draft");

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      file.value[0].progress = Math.round((event.loaded / event.total) * 100);
    }
  };

  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);

      file.value[0].id = response.id;

      if (response.id) {
        facility.value.featuredImage = {
          _id: response.id,
          name: file.value[0].name,
        };
      }
    }
  };

  xhr.send(formData);
}

async function saveData() {
  loading.value = true;

  try {
    await addFacility(facility.value);

    setSnackbar({
      text: "Facility successfully added!",
      modal: true,
      type: "success",
    });
    useRouter().push({ name: "facilities" });
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
  loading.value = false;
}

function removeFileGallery(id: string) {
  facility.value.gallery = facility.value.gallery.filter(
    (item) => item._id !== id,
  );
}

function removeFile(id: string) {
  if (facility.value.featuredImage._id === id) {
    facility.value.featuredImage = {};
  }
}

const endTimeListMonday = computed(() => getEndTimeList("monday"));
const endTimeListTuesday = computed(() => getEndTimeList("tuesday"));
const endTimeListWednesday = computed(() => getEndTimeList("wednesday"));
const endTimeListThursday = computed(() => getEndTimeList("thursday"));
const endTimeListFriday = computed(() => getEndTimeList("friday"));
const endTimeListSaturday = computed(() => getEndTimeList("saturday"));
const endTimeListSunday = computed(() => getEndTimeList("sunday"));

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const daysList = ref([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

daysList.value.forEach((day) => {
  watch(
    () => facility.value[day].startTime,
    () => {
      facility.value[day].endTime = "";
    },
  );
});

function getEndTimeList(day) {
  if (facility.value[day]) {
    const startIndex = timeList.value.indexOf(facility.value[day].startTime);

    // just make it 1 when you want 30 mins interval
    return startIndex >= 0
      ? timeList.value.slice(startIndex + 2)
      : timeList.value;
  } else {
    return timeList.value;
  }
}

// const timeList = computed(() => {
//   let times = [];
//   let hours, minutes;
//   for (var i = 0; i <= 1440; i += 30) {
//     hours = Math.floor(i / 60);
//     minutes = i % 60;
//     if (hours < 10) {
//       hours = "0" + hours;
//     }
//     if (minutes < 10) {
//       minutes = "0" + minutes;
//     }
//     let s = hours + ":" + minutes;
//     times.push(s);
//   }
//   return times;
// });

const timeList = computed(() => {
  let times = [];
  let hours, minutes;
  for (var i = 30; i <= 1440; i += 30) {
    hours = Math.floor(i / 60);
    minutes = i % 60;
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    let s = hours + ":" + minutes;
    times.push(s);
  }
  return times;
});

const hourIntervalList = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
</script>

<style scoped>
.titleDesign {
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px;
}

.text-combobox {
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}
</style>
