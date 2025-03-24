<template>
    <FormsElectronicAccessCardView/>
  </template>
  
  <script setup lang="ts">

  definePageMeta({
    middleware: "secure",
  });
  </script>
  
  <style>
  .w-45 {
    width: 45%;
  }
  </style>
  