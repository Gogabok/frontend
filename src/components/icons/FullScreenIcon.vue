<template lang="pug">
  svg(viewBox="0 0 60.6 60.6", :class="{ 'white': white === '' || white }")
    path.cls-1(d="M1.5 1.5l19.22 19.22M1.5 15.9V1.5h14.4M59.1 59.1L39.88 39.88M59.1 44.7v14.4H44.7M1.5 59.1l19.22-19.22M15.9 59.1H1.5V44.7M59.1 1.57L39.8 20.65M44.7 1.5l14.4.07L59 16")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: round($iconSize * 0.9)
    stroke: var(--graydarker)

    &.white
      stroke: var(--white)

  .cls-1
    fill: none
    stroke: inherit
    stroke-linecap: round
    stroke-linejoin: round
    stroke-width: 3px
</style>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component
  export default class FullScreenIcon extends Vue {
    @Prop({ default: false, type: undefined }) white;
  }
</script>
