<template lang="pug">
  .page
    .side(v-show="showSidePanel")
      slot(name="side")
    .main-content-wrapper
      slot(name="main-content")
</template>

<script src="./DefaultPage.ts" lang="ts"></script>

<style src="./default-page.styl" lang="stylus" scoped></style>
