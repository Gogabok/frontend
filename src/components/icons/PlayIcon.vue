<template lang="pug">
  svg(viewBox="0 0 33.38 60.6", :class="{ 'white': white === '' || white }")
    path.cls-1(d="M31.88 30.3L16.62 44.56 1.5 59.1l.07-28.8L1.5 1.5 16.62 16z")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: round($iconSize * 0.68)
    transform: "translateX(%s) translateY(%s)" % (@height * 0.1 round(@height * 0.3) * 0.1)
    fill: none
    stroke: var(--superdarkgray)

    &.white
      stroke: var(--white)

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-linecap: round
    stroke-linejoin: round
    stroke-width: 3px
</style>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component
  export default class PlayIcon extends Vue {
    @Prop({ default: false, type: undefined }) white;
  }
</script>
