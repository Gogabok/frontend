<template lang="pug">
  svg(viewBox="0 0 60.6 60.6")
    path.cls-1(d="M7 1.5h46.63A5.47 5.47 0 0159.1 7v46.63a5.47 5.47 0 01-5.47 5.47H7a5.47 5.47 0 01-5.5-5.47V7A5.47 5.47 0 017 1.5z")
    circle.cls-1(cx="30.37", cy="30.3", r="19.15")
    circle.cls-2(cx="30.44", cy="30.23", r="15.5")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: $iconSize
    fill: none
    stroke:var(--graydarker)

  .cls-1
  .cls-2
    fill: inherit
    stroke: inherit

  .cls-1
    stroke-width: 3px

  .cls-2
    stroke-width: 2px
</style>
