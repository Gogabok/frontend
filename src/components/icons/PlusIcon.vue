<template lang="pug">
  svg(viewBox="0 0 36 36")
    path.cls-1(d="M18 0v36M36 18H0")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: round($iconSize * 1.09)
    stroke: var(--graydarker)
    fill: none
    transition: var(--icon-transition) stroke

    &.active
      stroke: var(--blue)

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-miterlimit: 10
    stroke-width: 2px
</style>
