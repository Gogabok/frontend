<template lang="pug">
  svg(viewBox="0 0 53.4 36.62")
    path(class="cls-1", d="M1.5,18.28,18.28,35.12")
    path(class="cls-1", d="M51.9,1.5,18.28,35.12")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: round($iconSize * 0.72)
    stroke: var(--graydarker)
    fill: none

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-linecap: round
    stroke-width: 8px
</style>
