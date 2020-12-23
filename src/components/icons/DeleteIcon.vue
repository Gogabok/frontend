<template lang="pug">
  svg(viewBox="0 0 50 60.6", :class="{ 'white': white === '' || white} ")
    path.cls-1(d="M43.8 7.26l-2.35 48.31c-.12 1.94-1.23 3.53-2.82 3.53H11.37c-1.59 0-2.7-1.58-2.82-3.53L6.2 7.26M18.82 16.17l.35 34M32.17 16.17l-.35 34M1.5 7.26h47M15.6 7.26V3.08a1.47 1.47 0 011.29-1.58h16.22a1.47 1.47 0 011.29 1.58v4.18")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: $iconSize
    fill: none
    stroke: var(--graydarker)

    &.active
    &.active-icon
      stroke: var(--blue)

    &.white
      stroke: var(--white)

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-linecap: round
    stroke-width: 3px
    transition: var(--icon-transition) stroke
</style>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component
  export default class DeleteIcon extends Vue {
    @Prop({ default: false, type: undefined }) white;
  }
</script>
