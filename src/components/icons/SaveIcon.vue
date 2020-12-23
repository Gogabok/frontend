<template lang="pug">
  svg(viewBox="0 0 50.95 60.6")
    path.cls-1(d="M35.05 11.08h10.8c2 0 3.6 1.94 3.6 4.32v39.38c0 2.38-1.58 4.32-3.6 4.32H5.1c-2 0-3.6-1.94-3.6-4.32V15.4c0-2.38 1.58-4.32 3.6-4.32h10.8")
    path.cls-1(d="M25.48 1.5v40.82l-9.58-9.64M35.05 32.68l-9.58 9.65")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: $iconSize
    stroke: var(--graydarker)
    fill: none
    transition: var(--icon-transition) stroke

    &.active
      stroke: var(--blue)

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-linecap: round
    stroke-linejoin: round
    stroke-width: 3px
</style>
