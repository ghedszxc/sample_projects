<template>
    <v-card :style="{ width: `${$vuetify.display.lgAndUp ? '15%' : '100%'}`, border: `thin solid ${theme == 'dark' ? '#000000' : '#EEEEEE'} !important`, borderRadius: '15px' }"
        class="override_shadow">
        
        <template v-if="loading">
            <v-skeleton-loader
                type="list-item-two-line, avatar"
            ></v-skeleton-loader>
        </template>
        

        <template v-else>
            <v-card-title class="py-4">
                <v-row justify="space-between">
                    <v-col cols="8" class="align-self-center text-body-2 text-wrap font-weight-medium">
                        {{ dataProps.title }}
                    </v-col>
                    <v-col cols="4" class="text-end">
                        <v-icon size="small" :color="dataProps.color">{{ dataProps.icon }}</v-icon>
                    </v-col>
                </v-row>
            </v-card-title>

            <v-card-text>
                <v-row justify="space-between">
                    <v-col cols="8" class="text-h3 pt-2">
                        {{ dataProps.value }}
                    </v-col>

                    <v-col cols="4" class="d-flex align-end" v-if="dataProps.percentage">
                        <v-spacer></v-spacer>
                        <v-avatar
                            variant="outlined"
                            color="surface-variant">
                            <v-icon :size="13">mdi-trending-up</v-icon>
                        </v-avatar>
                        <span class="text-caption font-weight-medium ml-2">
                            {{ dataProps.percentage }}
                        </span>
                    </v-col>
                </v-row>
            </v-card-text>
        </template>
    </v-card>
</template>

<script setup>
defineProps({
    dataProps: Object,
    loading: Boolean
});

const { theme } = useLocal();
</script>

<style scoped>
:deep() .v-avatar {
    height: 20px !important;
    width: 20px !important;
    border-radius: 15% !important;
}

.override_shadow {
    box-shadow: 0px 13px 19px -13px rgba(0,0,0,0.15);
    -webkit-box-shadow: 0px 13px 19px -13px rgba(0,0,0,0.15);
    -moz-box-shadow: 0px 13px 19px -13px rgba(0,0,0,0.15);
}
</style>