<template lang="pug">
  svg(viewBox="0 0 67.44 61.76", :class="{ 'filled': fill === '' || fill }")
    path.cls-1(d="M53.84 48.16c7.92-5.18 12.1-12.82 12.1-20.45 0-14.47-14.47-26.21-32.26-26.21S1.5 13.24 1.5 27.71s14.4 26.21 32.18 26.21a37.69 37.69 0 009.07-1C47.36 55 52 57 56.65 59.1l-2.81-10.94z")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: round(0.9 * $iconSize)
    fill: none
    stroke: var(--graydarker)

    &.filled
      fill: var(--white)

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-width: 3px
</style>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component
  export default class ChatsIcon extends Vue {
    @Prop({ default: false, type: undefined }) fill;
  }
</script>
