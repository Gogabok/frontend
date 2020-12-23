<template lang="pug">
  svg(viewBox="0 0 60.38 60.38")
    path.cls-1(d="M16.48 53.92l-15 5 5-15zM6.47 43.91L48.88 1.5M16.48 53.92l42.4-42.41-10-10M44.35 7.34l8.38 8.38")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: round($iconSize * 0.72)
    fill: none
    stroke: var(--graydarker)

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-linecap: round
    stroke-linejoin: round
    stroke-width: 3px
</style>
