<template>
    <div>
        <p style="word-wrap: break-word;" class="text-justify">
            {{ !isExpanded ? props.text : truncatedText }}
            <button class="read-more font-weight-bold" v-if="showReadMore" @click="expandText">
                {{ !isExpanded ? 'View Less' : 'View More' }}
            </button>
        </p>

    </div>
  </template>
  
<script setup lang="ts">
const props = defineProps({
    text: {
        type: String,
    },
    maxLength: {
        type: Number,
        default: 100
    },
   
});
const isExpanded = ref("false")
const truncatedText = computed(() => {
    if (props.text.length <= props.maxLength) {
        return props.text;
    } else {
        return props.text.substring(0, props.maxLength) + '...';
    }
});

const showReadMore = computed(() => {
    return props.text.length > props.maxLength;
});

const expandText = () => {
    isExpanded.value = !isExpanded.value;
};


</script>
  
<style>
.read-more{
    color:blue;
}
</style>