<template>
  <div class="mb-4 text-right">
    <v-btn class="bg-blue-grey-darken-4" @click="showModal = true"
      >Add Event</v-btn
    >
    <v-dialog
      v-model="showModal"
      width="600"
      max-width="90vh"
      :persistent="true"
    >
      <v-card>
        <v-card-title> Add Event </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <v-form @submit.prevent="submit">
            <div class="mb-3">
                <v-select
                label="Service"
                v-model="service"
                :items="['Security', 'Cleaners', 'Managers']"
                hide-details="1"
                ></v-select>
            </div>
            <div class="my-3">
              <v-text-field
                label="Title"
                v-model="title"
                hide-details="1"
              ></v-text-field>
            </div>
            <v-row>
              <v-col cols="12" md="6" sm="12">
                <div class="my-3">
                  <v-text-field
                    label="From"
                    v-model="startDate"
                    hide-details="1"
                    type="date"
                  ></v-text-field>
                </div>
              </v-col>
              <v-col cols="12" md="6" sm="12">
                <div class="my-3">
                  <v-text-field
                    label="To"
                    v-model="endDate"
                    hide-details="1"
                    type="date"
                  ></v-text-field>
                </div>
              </v-col>
            </v-row>
            <div class="my-3">
              <v-text-field
                label="Description"
                v-model="description"
                hide-details="1"
              ></v-text-field>
            </div>
            <div class="my-0 py-0">
              <v-switch
                color="pink-darken-2"
                class="my-0 py-0"
                label="All Day"
                v-model="allDay"
              ></v-switch>
            </div>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <div class="d-flex justify-space-between w-100">
            <v-sheet>
              <v-btn @click="showModal = false"> [ Close ] </v-btn>
            </v-sheet>
            <v-sheet>
              <v-btn class="bg-blue-grey-darken-3" @click="submit">
                Save
              </v-btn>
            </v-sheet>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data: () => {
    return {
      showModal: false,
      title: "",
      description: "",
      allDay: false,
      startDate: null,
      endDate: null,
    };
  },
  methods: {
    submit() {
      alert("FOR BE INTEGRATION");
    },
  },
};
</script>
