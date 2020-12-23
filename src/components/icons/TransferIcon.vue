<template lang="pug">
  svg(
    viewBox="0 0 56.72 55.92",
    :class="{ 'active': isActive === '' || isActive }",
  )
    path.cls-1(d="M1.5 5.82l31.81-.14M17.23 1.5v4.18M28.53 5.81c-.35 8.85-13.28 30.68-24.47 36.56M7.82 13c2 6.8 12.45 22.27 19.11 26.52M42.69 22.72l-12.47 31.7M42.76 22.6l12.46 31.75M36 41.44h13.32")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: round($iconSize * 1.18)
    fill: none
    stroke: var(--graydarker)

    &.active
      stroke: var(--blue)

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-linecap: round
    stroke-width: 3px
</style>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component
  export default class TransferIcon extends Vue {
    @Prop({ default: false, type: undefined }) isActive;
  }
</script>
