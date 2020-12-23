<template lang="pug">
  svg(viewBox="0 0 76 55", :class="{ 'filled': fill === '' || fill }")
    path.cls-1(d="M5.93 1.5H49a4.34 4.34 0 014.5 4.21v43.56A4.34 4.34 0 0149 53.5H5.93a4.32 4.32 0 01-4.43-4.21V5.72A4.32 4.32 0 015.91 1.5zM53.52 23.6l16.71-13.2a3 3 0 013.69.33 2 2 0 01.58 1.38v32.62a2.44 2.44 0 01-2.63 2.19 2.94 2.94 0 01-1.74-.56L53.5 31.86")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: round($iconSize * 0.9)
    fill: none
    stroke: var(--graydarker)

    &.filled
      fill: var(--white)
      stroke: var(--lightgrey2)

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-width: 3px
</style>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component
  export default class VideoCameraIcon extends Vue {
    @Prop({ default: false, type: undefined }) fill;
  }
</script>
