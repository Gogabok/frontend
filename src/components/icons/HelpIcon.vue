<template lang="pug">
  svg(viewBox="0 0 60.46 60.46")
    circle.cls-1(cx="30.23", cy="30.23", r="28.73")
    text.cls-2(transform="translate(22.31 42.32)") ?
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: round($iconSize * 0.9)
    stroke: var(--graydarker)
    fill: none

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-width: 3px

  .cls-2
    isolation: isolate
    font-size: calc(2 * var(--regularFont))
    fill: var(--graydarker)
    font-family: Verdana, Verdana
</style>
