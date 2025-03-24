<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-row no-gutters>
        <v-col cols="12" class="header">
          <!-- <v-card
            width="118"
            height="118"
            variant="flat"
            rounded="xl"
            class="profile-image d-flex justify-center align-center"
          >
            <v-img
              class="inner-image"
              src="https://cdn.vuetifyjs.com/images/john.jpg"
            ></v-img>
          </v-card> -->
          <v-card
            variant="flat"
            width="100"
            height="100"
            :class="cardProfileImage"
          >
            <v-img
              src="https://cdn.vuetifyjs.com/images/john.jpg"
              class="profile-image"
              :style="{ marginLeft: theme === 'dark' ? '0px' : '10px' }"
              elevation="0"
            ></v-img>
          </v-card>
          <v-img
            src="/images/resident/announcement/site-sample.png"
            cover
            class="header-background-image"
          >
            <v-row no-gutters class="fill-height px-4" align-content="end">
              <v-col cols="12">
                <v-row no-gutters>
                  <v-col cols="5"> </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="7" class="text-white text-capitalize">
                    <v-row no-gutters class="fill-height" align="end">
                      <v-col cols="12" class="mb-2">
                        <v-row no-gutters>
                          <v-col
                            cols="12"
                            class="text-truncate text-textWhite"
                            style="font-size: 32px"
                          >
                            Aircon Uncle
                          </v-col>
                          <v-col
                            cols="12"
                            style="font-size: 12px; opacity: 0.7"
                            class="text-truncate text-textWhite"
                          >
                            Aircon Service
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-img>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" class="container-card-announcements mt-10 px-6">
      <v-carousel
        height="255"
        :show-arrows="false"
        hide-delimiter-background
        continuous
        cycle
        touch
        color="#EB261E"
      >
        <v-carousel-item v-for="(item, i) in announcements" :key="item.index">
          <nuxt-link class="no-underline">
            <v-card variant="flat" class="card-announcements rounded-xl">
              <v-img
                height="140px"
                src="/icons/feedback/sample-image.jpg"
                cover
              ></v-img>

              <v-row no-gutters class="d-flex" justify="center">
                <v-col cols="2" class="align-self-center text-center">
                  <v-avatar>
                    <v-img
                      alt="John"
                      src="https://cdn.vuetifyjs.com/images/john.jpg"
                    ></v-img>
                  </v-avatar>
                </v-col>
                <v-col cols="10">
                  <v-card-title class="pb-0 text-textWhite">
                    Aircon Servicing
                  </v-card-title>

                  <v-card-subtitle class="text-textWhite">
                    10% off on all services
                  </v-card-subtitle>
                </v-col>
              </v-row>
            </v-card>
          </nuxt-link>
        </v-carousel-item>
      </v-carousel>
    </v-col>
    <v-col cols="12" class="px-6 pt-3">
      <h4 class="header-about">About</h4>
      <p class="text-details pt-4">
        Lorem ipsum dolor sit amet. Ut nemo fuga hic voluptatum quia non
        cupiditate dicta id unde sapiente et pariatur quia et dicta iste id iste
        esse! Ex quam reiciendis sed similique nemo a facere eligendi? Et iusto
        sapiente ut laudantium iusto ut officia nihil eos vero eaque aut autem
        nobis.
      </p>
      <h3 class="text-services pt-4">Services</h3>
      <p class="text-details pt-4">
        <span class="text-services-title">Installtion:</span> Putting in a new
        HVAC system in your home or office
      </p>
      <p class="text-details">
        <span class="text-services-title">Maintenance:</span> Regular check-ups
        and cleaning to make sure your HVAC system keeps working well.
      </p>
      <p class="text-details">
        <span class="text-services-title">Repair:</span> Fixing any problems
        with your heating, ventilation, or air conditioning
      </p>
      <p class="text-details">
        <span class="text-services-title">Replacement:</span> Swapping out old
        or broken parts of your HVAC system with new ones.
      </p>
      <p class="text-details">
        <span class="text-services-title">Consultation:</span>  Experts giving
        advice on the best HVAC system for your needs
      </p>

      <v-card class="style-card mt-4" flat>
        <v-row no-gutters class="mx-6 my-3">
          <v-col cols="12" class="d-flex align-center justify-center">
            <v-avatar rounded="0" size="32" left>
              <v-img src="/icons/facility-booking/whatsapp.png"></v-img>
            </v-avatar>
            <v-card-title class="text-time">
              <span>Contact Aircon Uncle </span>
            </v-card-title>
          </v-col>
        </v-row>
      </v-card>
      <v-card class="style-card mt-4 mb-5" flat>
        <v-row no-gutters class="mx-6 my-6">
          <v-col cols="2" class="d-flex align-center justify-center">
            <v-avatar rounded="2" size="24">
              <v-img src="/icons/facility-booking/clock.svg"></v-img>
            </v-avatar>
          </v-col>
          <v-col cols="10" class="d-flex align-center">
            <v-card-title class="text-time">
              <span>Monday - Sunday 8:00am to 5:00pm </span>
            </v-card-title>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const { theme } = useLocal();
definePageMeta({
  layout: "resident-bottom-navigation",
  middleware: "secure",
});

const announcements = ref([
  {
    _id: "1",
    title: "Announcement 1",
    createdAt: new Date(),
    index: 0,
  },
  {
    _id: "2",
    title: "Announcement 2",
    createdAt: new Date(),
    index: 1,
  },
]);

const cardProfileImage = computed(() =>
  theme.value === "dark"
    ? "card-profile-image-dark"
    : "card-profile-image-light",
);
</script>

<style scoped>
.header {
  position: relative;
}
.header-background-image {
  height: 240px;
  flex-shrink: 0;
}
.profile-image {
  position: absolute;
  bottom: -25px;
  left: 26px;
  z-index: 1;
  box-shadow: 0px 5px 14px 0px rgba(0, 0, 0, 0.12);
}

.card-announcements {
  border-radius: 16px;
  height: 200px;
  align-content: center;
  border: 1px solid var(--dark-grey-border, #343a45);
  background: var(--Corporate-blue, #111723);
  /* button-s-red */
  box-shadow: 0px 12px 14px 0px rgba(233, 38, 30, 0.2);
}

.no-underline {
  text-decoration: none;
}

.header-about {
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 100% */
}

.sub-header {
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
}

.text-details {
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 32px;
}

.style-card {
  border-radius: 16px;
  border: 1px solid #343a45;
}

.text-time {
  text-align: right;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.text-services {
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.text-services-title {
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px;
}

.text-white {
  font-feature-settings: "clig" off, "liga" off;
  font-family: Roboto;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
}

.card-profile-image-light {
  position: absolute;
  bottom: -35px;
  left: 15px;
  z-index: 1;
  border-radius: 757.819px;
  align-content: center;
}
.card-profile-image-dark {
  position: absolute;
  bottom: -35px;
  left: 15px;
  z-index: 1;
  border-radius: 757.819px;
  border: 11.89px solid #131218;
  align-content: center;
}
</style>
