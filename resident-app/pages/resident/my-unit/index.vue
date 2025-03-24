<template>
  <v-row no-gutters>
    <!-- go back -->
    <v-col
      cols="6"
      :class="`mt-6 ${$vuetify.display.smAndUp ? 'px-12' : 'px-3'}`"
      @click="goBack()"
    >
      <v-icon start size="x-large" style="position: relative; right: 5px">
        <v-img
          class="pl-0 ml-0 mt-2"
          src="/dark-mode/utility-all/right-arrow.svg"
          cover
        ></v-img>
      </v-icon>
      <span style="position: relative; right: 15px; color: baseColor">
        My Unit
      </span>
    </v-col>
    <!-- add resident -->
    <v-col
      cols="6"
      :class="`mt-6 d-flex justify-end ${
        $vuetify.display.smAndUp ? 'px-12' : 'px-3'
      }`"
      @click="useRouter().push({ name: 'resident-my-unit-add-resident' })"
    >
      <v-icon start size="40" style="position: relative; left: 3px">
        <v-img
          class="pl-0 ml-0 mt-2"
          src="/dark-mode/utility-all/add-visitor.svg"
          cover
        ></v-img>
      </v-icon>
      <span style="position: relative; top: 2px; left: -5px">
        Add Resident
      </span>
    </v-col>

    <!-- header -->
    <v-col
      cols="12"
      :class="`mt-6 ${$vuetify.display.smAndUp ? 'px-6' : 'px-3'}`"
    >
      <v-card :class="`${cardHeader} pa-3`">
        <v-row no-gutters class="fill-height" align-content="center">
          <!-- profile image -->
          <v-col :cols="$vuetify.display.smAndUp ? '5' : '4'">
            <v-img
              cover
              :src="
                currentUser.profilePicture
                  ? `/api/files/${currentUser.profilePicture}`
                  : '/default-profile.svg'
              "
              class="profile-image"
              elevation="0"
            ></v-img>
          </v-col>
          <!-- full name, block name, level name, unit name -->
          <v-col cols="5">
            <v-row no-gutters class="fill-height" align-content="center">
              <!-- full name -->
              <v-col
                cols="12"
                :class="`${residentName} text-capitalize font-weight-bold`"
              >
                {{ currentUser.givenName }} {{ currentUser.surname }}
              </v-col>
              <!-- block name, level name, unit name -->
              <v-col cols="12" :class="blockLevelUnit">
                {{ currentUser.blockName }}
                {{ currentUser.levelName }}
                {{ currentUser.unitName }}
              </v-col>
            </v-row>
          </v-col>
          <!-- resident type -->
          <v-col :cols="$vuetify.display.smAndUp ? '1' : '3'">
            <v-row no-gutters class="fill-height" align-content="center">
              <v-chip variant="outlined" size="small" class="chip">
                <span class="chip-text text-capitalize">
                  {{ currentUser.type }}
                </span>
              </v-chip>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <!-- title -->
    <v-col
      cols="12"
      :class="`${myResidentsTitle} mt-5 ${
        $vuetify.display.smAndUp ? 'px-13' : 'px-6'
      }`"
    >
      My Residents
    </v-col>

    <!-- list of residents -->
    <v-infinite-scroll
      mode="manual"
      @load="load"
      style="width: 100%"
      v-if="residents.length"
      :class="`${$vuetify.display.smAndUp ? 'px-9' : 'px-3'}`"
    >
      <v-col cols="12">
        <v-row no-gutters>
          <template v-for="resident in residents">
            <v-col cols="12" class="mt-4">
              <v-card :class="cardMenuItems" elevation="0">
                <v-row no-gutters class="fill-height" align-content="center">
                  <v-col cols="1" class="ml-4">
                    <v-avatar
                      class="text-uppercase"
                      style="
                        color: var(--White, #fff);
                        height: 32px;
                        width: 32px;
                        border-radius: 32px;
                        background: var(--Primary, #eb261e);
                      "
                    >
                      {{ resident.firstName[0] }}
                    </v-avatar>
                  </v-col>
                  <v-col cols="5" class="ml-6 text-capitalize">
                    <v-row
                      no-gutters
                      class="fill-height"
                      align-content="center"
                    >
                      <v-col cols="12" :class="myResidentName">
                        {{ resident.firstName }} {{ resident.lastName }}
                      </v-col>
                      <v-col cols="12" :class="myResidentRelationShip">
                        {{ resident.relationship }}
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-col>

      <!-- load residents -->
      <template v-slot:load-more="{ props }">
        <v-btn
          flat
          tile
          size="small"
          :variant="!canNextPage ? 'text' : 'outlined'"
          class="mt-4"
          v-bind="props"
          :disabled="!canNextPage"
        >
          {{ !canNextPage ? "No more residents to load." : "Load More more" }}
        </v-btn>
      </template>
    </v-infinite-scroll>

    <!-- if there are no residents -->
    <v-col v-if="!residents.length" cols="12" class="mt-10">
      <v-row no-gutters justify="center">
        <v-card class="no-my-residents-icon">
          <v-img
            src="/icons/resident/home/no-my-residents.svg"
            style="width: 124px; height: 124px"
          ></v-img>
        </v-card>
      </v-row>
    </v-col>

    <v-col
      v-if="!residents.length"
      cols="12"
      :class="`${noMyResidentsText} mt-6`"
    >
      You don't have resident added.
    </v-col>

    <v-col v-if="!residents.length" cols="12" class="text-center mt-8">
      <v-btn
        @click="useRouter().push({ name: 'resident-my-unit-add-resident' })"
        color="#eb261e"
        style="
          width: 260px;
          height: 52px;
          padding: 0px 16px;
          justify-content: center;
          align-items: center;
          background: var(--Primary, #eb261e);
          box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
        "
      >
        Add Resident
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});

const { theme } = useLocal();

const back = computed(() =>
  theme.value === "dark" ? "go-back-dark" : "go-back-light",
);

const addResidentIcon = computed(() =>
  theme.value === "dark"
    ? "/icons/resident/home/dark/add.svg"
    : "/icons/resident/home/light/add.svg",
);

const addResident = computed(() =>
  theme.value === "dark" ? "add-resident-dark" : "add-resident-light",
);

const cardHeader = computed(() =>
  theme.value === "dark" ? "card-header-dark" : "card-header-light",
);

const residentName = computed(() =>
  theme.value === "dark" ? "resident-name-dark" : "resident-name-light",
);

const blockLevelUnit = computed(() =>
  theme.value === "dark" ? "block-level-unit-dark" : "block-level-unit-light",
);

const cardMenuItems = computed(() =>
  theme.value === "dark" ? "card-menu-dark" : "card-menu-light",
);

const myResidentsTitle = computed(() =>
  theme.value === "dark"
    ? "my-residents-title-dark"
    : "my-residents-title-light",
);

const myResidentName = computed(() =>
  theme.value === "dark" ? "my-resident-name-dark" : "my-resident-name-light",
);

const myResidentRelationShip = computed(() =>
  theme.value === "dark"
    ? "my-resident-relationship-dark"
    : "my-resident-relationship-light",
);

const noMyResidentsText = computed(() =>
  theme.value === "dark"
    ? "no-my-residents-text-dark"
    : "no-my-residents-text-light",
);

const { currentUser } = useLocalAuth();

const { getUnitResident } = useMyUnit();

const page = ref<number>(1);
const pages = ref<number>(0);

const canNextPage = computed(() => pages.value > page.value);
const residents = ref<Record<string, any>>([]);

onMounted(async () => {
  if (!theme.value) theme.value = "light";

  const res = await getUnitResident();
  pages.value = res.pages;
  residents.value = res.items;
  console.log("Guest", res.items);
});

function goBack() {
  useRouter().push({ name: "resident" });
}
</script>

<style scoped>
.chevron-icon {
  filter: drop-shadow(0px 4px 10px #d01b1b);
}
.go-back-light {
  color: var(--Secondary-Dark, #0f131c);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  margin-top: 3px;
}
.go-back-dark {
  color: #fcfcfc;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  margin-top: 3px;
}

.add-resident-icon {
  filter: drop-shadow(0px 12px 14px rgba(233, 38, 30, 0.2));
}

.add-resident-light {
  color: var(--Secondary-Dark, #0f131c);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.add-resident-dark {
  color: #fcfcfc;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.card-header-light {
  height: 129px;
  width: 100%;
  border-radius: 16px;
  border: 2px solid var(--stroke-light-mode, rgba(185, 184, 192, 0.2));
  background: var(--White, #fff);
  box-shadow: 0px 5px 14px 0px rgba(15, 14, 20, 0.1);
}
.card-header-dark {
  height: 129px;
  width: 100%;
  border-radius: 16px;
  border: 2px solid var(--dark-grey-border, #343a45);
  background: var(--Corporate-blue, #111723);
  box-shadow: 0px 0px 14px 0px rgba(255, 255, 255, 0.1);
}
.profile-image {
  width: 81px;
  height: 81px;
  border-radius: 757.819px;
  border: 2px solid var(--Primary, #eb261e);
  box-shadow: 0px 12px 14px 0px rgba(224, 36, 28, 0.5);
}
.resident-name-light {
  color: var(--Secondary-Dark, #0f131c);
  font-size: 14px;
  font-style: normal;
  line-height: 24px;
}
.resident-name-dark {
  color: var(--Light, #dfe2e9);
  font-size: 14px;
  font-style: normal;
  line-height: 24px;
}
.block-level-unit-light {
  color: var(--Grey-sub-text, #555e6f);
  text-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3), 0px 16px 30px rgba(0, 0, 0, 0.9);
  font-size: 12px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  opacity: 0.7;
}
.block-level-unit-dark {
  color: var(--Light, #dfe2e9);
  text-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3), 0px 16px 30px rgba(0, 0, 0, 0.9);
  font-size: 12px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  opacity: 0.7;
}
.chip {
  padding: var(--f-spacing-40, 4px) 16px;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  border: 1px solid var(--Primary, #eb261e);
  background: var(--Primary, #eb261e);
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}
.chip-text {
  color: #fff;
  text-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3), 0px 16px 30px rgba(0, 0, 0, 0.9);
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  opacity: 0.6;
  margin-top: 1px;
}
.my-residents-title-light {
  color: var(--Secondary-Dark, #0f131c);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 36px;
}
.my-residents-title-dark {
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 36px;
}
.card-menu-light {
  height: 64px;
  border-radius: 8px;
  border: 1px solid var(--black-004, rgba(0, 0, 0, 0.04));
  background: var(--White, #fff);
}
.card-menu-dark {
  height: 64px;
  border: 1px solid var(--black-004, rgba(0, 0, 0, 0.04));
  background: var(--Corporate-blue, #111723);
  box-shadow: 0px 0px 14px 0px rgba(255, 255, 255, 0.1);
}
.my-resident-name-light {
  color: var(--Secondary-Dark, #0f131c);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}
.my-resident-name-dark {
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}
.my-resident-relationship-light {
  color: var(--Grey-sub-text, #555e6f);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}
.my-resident-relationship-dark {
  color: var(--Grey-sub-text, #555e6f);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}

.no-my-residents-icon {
  display: flex;
  width: 124px;
  height: 124px;
  padding: 30px;
  justify-content: space-between;
  align-items: center;
  border-radius: 80px;
  border: 10px solid var(--icon-gradient-light-mode, #72707d);
  box-shadow: 0px 10px 20px 0px rgba(201, 201, 201, 0.3);
}
.no-my-residents-text-light {
  color: var(--Secondary-Dark, #0f131c);
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}
.no-my-residents-text-dark {
  color: #fff;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 19px;
}
</style>
