<template lang="pug">
  svg(viewBox="0 0 59.23 57.94")
    circle.cls-1(cx="13.38", cy="28.79", r="11.88")
    circle.cls-1(cx="49.31", cy="9.92", r="8.42")
    circle.cls-1(cx="49.31", cy="48.01", r="8.42")
    path.cls-1(d="M23.89 34.26l18 9.94M23.89 23.17l17.93-9.5")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: round($iconSize * 0.9)
    stroke: var(--graydarker)
    fill: none

    &.active
    &.active-icon
      stroke: var(--blue)

  .cls-1
    fill:inherit
    stroke: inherit
    stroke-width: 3px
    transition: var(--icon-transition) stroke
</style>
