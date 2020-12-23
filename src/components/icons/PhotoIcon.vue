<template lang="pug">
  svg(viewBox="0 0 60.62 60.6")
    path.cls-1(d="M47.15 10.9H53a6.34 6.34 0 016.12 6.48v35.24A6.34 6.34 0 0153 59.1H7.62a6.34 6.34 0 01-6.12-6.48V17.38a6.34 6.34 0 016.12-6.48h5.83")
    path.cls-2(d="M13.45 10.9l5.2-6.9a6.38 6.38 0 014.16-2.5h14.9A6.74 6.74 0 0141.88 4l5.2 6.88")
    circle.cls-1(cx="30.3", cy="34.5", r="15")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: $iconSize
    fill: none
    stroke: var(--graydarker)

  .cls-1
  .cls-2
    fill: inherit
    stroke: inherit
    stroke-width: 3px

  .cls-2
    stroke-linecap: round
</style>
