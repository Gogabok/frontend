<template lang="pug">
  svg(viewBox="0 0 54.1 46.2", :class="{ 'reflectY': reflectY === '' || reflectY }")
    path.cls-1(d="M32.68 1.5L51.9 20.72 32.68 37.5M1.5 44.7c0-19.15 14.4-31.18 31.18-31.18V1.5M1.5 44.7c9.58-16.78 14.4-19.15 31.18-19.15M32.68 25.55v12")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: round($iconSize * 0.45)
    fill: none
    stroke: var(--graydarker)
    transition: var(--icon-transition) stroke

    &.active-icon
    &.active
      stroke: var(--blue) !important

  &.reflectY
    transform-origin: center center
    backface-visibility: visible
    transform: rotateY(180deg)

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-linecap: round
    stroke-width: 2px


</style>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component
  export default class ForwardIcon extends Vue {
    @Prop({ default: false, type: undefined }) reflectY;
  }
</script>
