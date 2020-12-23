<template lang="pug">
  svg(viewBox="0 0 60.6 60.6")
    circle.cls-1(cx="30.3", cy="30.3", r="28.8")
    path.cls-1(d="M28.33 11.33v22l21.26-.51")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    width: $iconSize
    height: @width
    fill: none
    stroke: var(--graydarker)

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-linecap: round
    stroke-linejoin: round
    stroke-width: 3px
</style>
