<template lang="pug">
  .password__header
    .new-contacts__arrow(v-if="isArrowVisible", @click="goBack")
      angle-icon
      span Back
    p.password__header-title
      span {{pageTitle}}
    .password__arrow.password__arrow-transform(v-if="!isArrowVisible")
      password-icon
</template>

<script src="./Header.ts" lang="ts"></script>

<style scoped src="./header.styl" lang="stylus"></style>
