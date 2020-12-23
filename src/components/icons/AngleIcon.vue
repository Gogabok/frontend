<template lang="pug">
  svg(viewBox="0 0 29.86 58.31", :class="{ 'white': white === '' || white }")
    path.cls-1(d="M.35.35l28.8 28.8L.35 58")
</template>

<style lang="stylus" scoped>
  svg
    fill: none
    --stroke-width: 3px
    stroke: var(--graydarker)

    &.white
      stroke: white

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-width: var(--stroke-width)
</style>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop } from 'vue-property-decorator';

  @Component
  export default class AngleIcon extends Vue {
    @Prop({ default: false, type: undefined }) white;
  }
</script>
