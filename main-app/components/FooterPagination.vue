<template>
    <v-row no-gutters justify="end" align-content="center">
        <span>{{ pageRange }}</span>
        <v-btn
            density="compact"
            variant="text"
            icon
            class="mx-2"
            :disabled="page === 1"
            @click="_prevPage()">
    
            <v-icon>mdi-chevron-left</v-icon>
        </v-btn>

        <v-btn
            density="compact"
            variant="text"
            icon
            class="mx-2"
            :disabled="page >= pages"
            @click="_nextPage()">

            <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
    </v-row>
</template>

<script setup lang="ts">
    const props = defineProps({
        pageRange: {
            type: String,
        },
        page: {
            type: Number,
            default: 1,
        },
        pages: {
            type: Number,
            default: 1,
        },
    })

    const emit = defineEmits(["nextPage","prevPage"]);

    async function _prevPage() {
        emit("prevPage");
    }
    
    async function _nextPage() {
        emit("nextPage");
    }
</script>