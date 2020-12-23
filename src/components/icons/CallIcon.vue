<template lang="pug">
  svg(viewBox="0 0 66.5 63.6")
    path.cls-1(d="M49.45 62a13.27 13.27 0 01-6-.69 2.75 2.75 0 00-.54-.14 74.82 74.82 0 01-40.4-38.4 2.58 2.58 0 00-.16-.53 11.75 11.75 0 01-.77-5.74C2.39 8.65 10.19 2 14.83 1.51a1.43 1.43 0 011.17.35 1.33 1.33 0 01.21.27l.16.24L26 14.93l.24.28a1.3 1.3 0 01.37 1.1 1.75 1.75 0 01-.32.83l-4.14 4c-3 2.73-3.55 6.84-1.27 9.19l.11.18a48.53 48.53 0 0013.76 12.91l.12.08c2.37 2.17 6.53 1.73 9.41-1l.2-.2 4.16-4.05a1.92 1.92 0 01.8-.29 1.43 1.43 0 011.15.35l.29.24L64 47.69l.27.16a1.26 1.26 0 01.28.18 1.3 1.3 0 01.4 1.16 3.19 3.19 0 000 .32C64.22 54 57.45 61.19 49.45 62z")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: round(0.9 * $iconSize)
    fill: none
    stroke: var(--graydarker)

    &.filled
      fill: var(--white)
      stroke: var(--lightgrey2)

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-miterlimit: 10
    stroke-width: 3px
</style>
