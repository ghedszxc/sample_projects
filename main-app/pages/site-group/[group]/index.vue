<template>
  <v-row no-gutters class="pa-8" justify="center">
    <v-col cols="12">
      <v-row no-gutters>
        <v-col cols="12">
          <v-row no-gutters class="fill-height" align="center">
            <v-col cols="12" lg="6">
              <v-row no-gutters>
                <v-col
                  cols="12"
                  class="text-h5 font-weight-bold text-capitalize"
                  style="letter-spacing: 2px !important"
                >
                  <v-btn
                    icon="mdi-arrow-left"
                    elevation="0"
                    @click="goBack()"
                  ></v-btn>
                  {{ theGroup.groupName }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>

        <v-col
          cols="12"
          md="4"
          v-for="(item, itemIndex) in items"
          :key="item.text"
          class="my-3"
        >
          <template v-if="item.isLink">
            <div :class="item.isDisabledCard">
              <v-card
                class="w-100 pa-8"
                elevation="1"
                style="border-radius: 24px"
                height="368px"
                link
                :to="{
                  name: item.to,
                  params: item.params,
                }"
              >
                <v-row no-gutters class="fill-height" align-content="center">
                  <v-col cols="12">
                    <v-row no-gutters justify="center">
                      <v-img
                        :src="item.img"
                        style="width: 119.538px; height: 91.2px; flex-shrink: 0"
                      ></v-img>
                    </v-row>
                  </v-col>

                  <v-col
                    cols="12"
                    class="text-caption text-center mt-5"
                    style="font-size: 14px"
                  >
                    {{ item.text }}
                  </v-col>
                  <v-col cols="12" :class="item.class" style="font-size: 20px">
                    {{ item.value }}
                  </v-col>
                </v-row>
              </v-card>
            </div>
          </template>

          <template v-else>
            <div class="px-2">
              <v-card
                elevation="1"
                style="border-radius: 24px"
                height="368px"
                class="pa-8 w-100"
                @click="
                  openDialog({
                    img: item.img,
                    inputVal: item.value,
                    ...item.dialogData,
                  })
                "
              >
                <v-row no-gutters class="fill-height" align-content="center">
                  <v-col cols="12">
                    <v-row no-gutters justify="center">
                      <v-img
                        :src="item.img"
                        style="width: 119.538px; height: 91.2px; flex-shrink: 0"
                      ></v-img>
                    </v-row>
                  </v-col>

                  <v-col
                    cols="12"
                    class="text-caption text-center mt-5"
                    style="font-size: 14px"
                  >
                    {{ item.text }}
                  </v-col>
                  <v-col cols="12" :class="item.class" style="font-size: 20px">
                    {{ item.value }}
                  </v-col>
                </v-row>
              </v-card>
            </div>
          </template>
        </v-col>
      </v-row>

      <v-dialog
        v-model="dialog"
        transition="dialog-right-transition"
        fullscreen
        :style="{
          'margin-left': 'auto',
          'margin-right': '0',
          'max-width': '551px',
        }"
      >
        <v-card class="px-3 h-100">
          <v-toolbar color="white">
            <v-btn icon="mdi-arrow-left" @click="dialog = false"></v-btn>
            <v-toolbar-title>{{ theGroup.groupName }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
          </v-toolbar>

          <v-divider></v-divider>

          <v-card-text>
            <v-row class="h-100 align-center">
              <v-form
                v-model="isSpGroupValid"
                @submit.prevent="dialogData.action"
                class="w-100"
              >
                <v-col cols="12">
                  <v-row class="justify-center mb-7">
                    <v-img
                      :src="dialogData.img"
                      width="190px"
                      height="190px"
                    ></v-img>
                  </v-row>

                  <v-responsive class="mx-auto">
                    <div class="text-subtitle-1 text-medium-emphasis">
                      {{ dialogData.label }}
                    </div>
                    <template v-if="dialogData.type == 'text'">
                      <v-text-field
                        :rules="[requiredInput]"
                        v-model="dialogData.inputVal"
                        density="comfortable"
                        hint=""
                        :persistent-hint="false"
                      ></v-text-field>
                    </template>
                    <template v-else>
                      <v-select
                        v-model="dialogData.inputVal"
                        :rules="[requiredInput]"
                        :items="dialogData.options"
                        item-title="text"
                        item-value="value"
                        density="comfortable"
                        hint=""
                        :persistent-hint="false"
                      ></v-select>
                    </template>
                    <v-btn
                      color="#1867C0"
                      :disabled="!isSpGroupValid"
                      type="submit"
                      class="py-4 w-100 rounded-lg"
                      height="52px"
                    >
                      Update
                    </v-btn>
                  </v-responsive>
                </v-col>
              </v-form>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["secure", "service-provider-group"],
});
const { requiredInput } = useUtils();
const { setSnackbar } = useLocal();
const { spGroup, isSpGroupValid, updateNameById } = useSPGroup();
const theGroup = computed(() => spGroup.value);

const goBack = () => {
  useRouter().back();
};

const dialog = ref(false);
const dialogData = ref({
  img: "",
  inputVal: "",
  type: "",
  label: "",
  options: [],
  action: () => {},
});

const params = computed(() => ({ groupId: "" }));

const items = computed(() => {
  return [
    {
      text: "Dashboards",
      value: "",
      img: "/images/sites/dashboard.svg",
      isLink: true,
      to: "site-group-group-dashboard",
      params: params.value,
      dialogData: {},
      class: "text-center",
    },
    {
      text: "Group Name",
      value: theGroup.value?.groupName,
      img: "/images/sites/name.svg",
      isLink: false,
      dialogData: {
        type: "text",
        label: "Group Name",
        action: async () => {
          try {
            if (
              theGroup.value.groupName.toLocaleLowerCase() ===
              dialogData.value.inputVal.toLocaleLowerCase()
            )
              throw new Error("Cannot updated same group name");
            await updateNameById(theGroup.value._id || "", {
              groupName: dialogData.value.inputVal,
            });
            dialog.value = false;
            setSnackbar({
              text: "Successfully Updated!",
              modal: true,
              type: "success",
            });
          } catch (error: any) {
            setSnackbar({
              text: error || error.message,
              modal: true,
              type: "error",
            });
          }
        },
      },
      class: "text-center",
    },
    {
      text: "Members",
      value: theGroup.value.members || 0,
      img: "/images/sites/team.svg",
      isLink: true,
      to: "site-group-group-member",
      params: params.value,
      dialogData: {},
      class: "text-center",
    },
    {
      text: "Assigned Sites",
      value:
        typeof theGroup.value?.site === "object"
          ? theGroup.value?.site?.name
          : "N/A",
      img: "/images/sites/residents.svg",
      isLink: true,
      to: "site-group-group-assigned",
      params: params.value,
      dialogData: {},
      class: " text-center",
      isDisabledCard:
        theGroup.value.status && /^(connected)$/i.test(theGroup.value.status)
          ? "px-2 disabled-card"
          : "px-2",
    },
  ];
});

function openDialog(data: any) {
  dialog.value = true;
  dialogData.value = data;
}
</script>

<style scoped>
.disabled-card {
  pointer-events: none; /* Disable interactions */
  opacity: 0.5; /* Make the card look disabled */
}
</style>
