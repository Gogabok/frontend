<template lang="pug">
  svg(viewBox="0 0 60.24 60.6")
    path.cls-1(d="M30.08 59.1H1.5a28.86 28.86 0 0128.58-29 28.9 28.9 0 0128.66 29z")
    ellipse.cls-1(cx="30.37", cy="15.83", rx="14.18", ry="14.33")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: round($iconSize * 0.9)
    fill: none
    stroke:var(--graydarker)

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-width: 3px
</style>
