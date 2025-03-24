<template>
  <v-card v-resize="onResize" variant="flat">
    <v-row no-gutters class="mt-3">
      <v-col
        cols="12"
        :class="`${$vuetify.display.mdAndUp ? 'pt-2 px-7' : 'px-3'}`"
      >
        <v-row no-gutter class="pt-4">
          <v-col cols="12" class="py-0 px-1" style="position: relative">
            <iframe
              :src="cctv.ip"
              :style="{
                width: '100%',
                zIndex: 2000,
                pointerEvents: 'unset !important',
                minHeight: `${windowSize - 220}px`,
              }"
            />

            <v-chip
              variant="elevated"
              :style="{
                width: 'auto',
                height: '20px',
                position: 'absolute',
                bottom: '27px',
                right: '20px',
                color: '#000',
                background: '#fff',
                fontSize: '10px',
              }"
            >
              {{ cctv.name == "" ? "No Name" : cctv.name }}
            </v-chip>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" class="mt-4">
        <v-row no-gutters class="px-5 align-center" justify="start">
          <v-col cols="12" lg="8">
            <v-row
              no-gutters
              class="d-flex fill-height align-center justify-start"
              align-content="center"
              justify-content="start"
            >
              <v-col cols="1">
                <v-btn
                  density="compact"
                  size="large"
                  rounded="lg"
                  icon="mdi-chevron-left"
                  :class="$vuetify.display.mdAndDown && 'mt-1'"
                  flat
                  @click="goBack()"
                ></v-btn>
              </v-col>

              <v-col cols="11" lg="4">
                <template v-if="isEditing">
                  <v-text-field
                    v-model="cctv.name"
                    flat
                    density="compact"
                    variant="solo"
                    placeholder="Enter camera name"
                    persistent-placeholder
                    hide-details
                    class="custom-field elevation-0 px-4 rounded-xl"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon icon="mdi-cctv" color="#052439" />
                    </template>
                  </v-text-field>
                </template>
                <template v-else>
                  <v-sheet
                    class="pill d-flex align-center justify-start px-4 py-2"
                  >
                    <v-icon size="20" icon="mdi-cctv" color="#052439"> </v-icon>
                    <span class="pl-4 font-weight-medium text-truncate">
                      {{ cctv.name == "" ? "Enter camera name" : cctv.name }}
                    </span>
                  </v-sheet>
                </template>
              </v-col>

              <v-col
                cols="12"
                lg="7"
                :class="$vuetify.display.mdAndDown && 'my-2'"
              >
                <template v-if="isEditing">
                  <v-text-field
                    v-model="cctv.ip"
                    flat
                    density="compact"
                    variant="solo"
                    placeholder="Enter live feed/port"
                    persistent-placeholder
                    hide-details
                    class="custom-field elevation-0 px-4 rounded-xl"
                  >
                    <template v-slot:prepend-inner>
                      <v-icon icon="mdi-broadcast" color="#052439" />
                    </template>
                  </v-text-field>
                </template>
                <template v-else>
                  <v-sheet
                    class="pill d-flex align-center justify-start px-4 py-2"
                  >
                    <v-icon size="20" icon="mdi-broadcast" color="#052439">
                    </v-icon>
                    <span class="pl-4 font-weight-medium text-truncate">
                      {{ cctv.ip == "" ? "Enter live feed/port" : cctv.ip }}
                    </span>
                  </v-sheet>
                </template>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" lg="4">
            <v-row justify="end">
              <v-col
                v-if="$ability.can('update', 'edit-cctv')"
                cols="12"
                lg="7"
              >
                <template v-if="!isEditing">
                  <v-btn
                    block
                    color="blue-darken-3"
                    size="small"
                    variant="flat"
                    style="height: 40px"
                    @click="setEditing()"
                  >
                    Configure
                  </v-btn>
                </template>
                <template v-else>
                  <v-btn
                    block
                    color="blue-darken-3"
                    size="small"
                    variant="flat"
                    style="height: 40px"
                    @click="saveConfig()"
                  >
                    Save Configuration
                  </v-btn>
                </template>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure"],
});
const { $ability } = useNuxtApp();
const { cctv, getCctvById, updateCCTVIpName } = useCCTV();
const { drawer } = useDrawer();
const { getSitesOptionsForFiltering, mySite } = useFilter();

const isEditing = ref(false);
const _id = computed(() => String(useRoute().params.cctvid));
onMounted(async () => {
  drawer.value = false;
  const [res] = await Promise.all([
    getCctvById(_id.value),
    getSitesOptionsForFiltering(),
  ]);
  cctv.value = res as TCctv;
});

function setEditing() {
  isEditing.value = true;
}

const windowSize = ref(0);
async function onResize() {
  windowSize.value = window.innerHeight;
}

const { setSnackbar } = useLocal();
async function saveConfig() {
  isEditing.value = false;
  cctv.value.isActive = cctv.value.ip !== "" ? true : false;
  try {
    const res = await updateCCTVIpName(cctv.value);
    setSnackbar({
      text: "Successfull Configured the CCTV",
      modal: true,
      type: "success",
    });
    goBack();
  } catch (error) {
    setSnackbar({ text: error as string, modal: true, type: "error" });
  }
}

function goBack() {
  // useRouter().back();
  navigateTo({
    path: `/cctv/${cctv.value.cctvBlock}`,
    query: {
      site: mySite.value,
    },
  });
}
</script>
