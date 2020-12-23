<template lang="pug">
  svg(viewBox="0 0 66.49 66.42")
    path.cls-1(d="M33.25,5.08,40,27H62L44.26,40.5,51,62.39,33.25,48.85,15.46,62.39,22.23,40.5,4.45,27h22Z")
</template>

<style lang="stylus" scoped>
  svg
    fill: none
    stroke: var(--graydarker)

    &.active
      stroke: var(--blue)

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-width: 3px
    transition: var(--icon-transition) stroke
</style>
