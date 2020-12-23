<template lang="pug">
  svg(viewBox="0 0 58.74 58.71")
    path.cls-1(d="M3.05 1.62l53.67 29.16a1 1 0 01-.06 1.79L2.92 57.12a1 1 0 01-1.38-1.18L8.3 32a1 1 0 000-.5L1.6 2.73a1 1 0 011.45-1.11zM58 31.49H7.87")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: round($iconSize * 1.09)
    fill: none
    stroke: var(--graydarker)

    &.active
      stroke: var(--blue)

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-width: 3px
    transition: var(--icon-transition) stroke
</style>
