<template lang="pug">
  svg(viewBox="0 0 18 12.03")
    path.cls-1(d="M7.52 8.59a2.88 2.88 0 01-1.08 2.25 3.22 3.22 0 01-2.3.94q-3.89 0-3.89-4.36a6.92 6.92 0 011.64-4A12.51 12.51 0 015.41.25l.89 1.13q-2.58 2.2-2.58 3.37 0 .28 1 .66a5.72 5.72 0 011.73.94 2.68 2.68 0 011.07 2.24zm10.23 0a2.88 2.88 0 01-1.08 2.25 3.28 3.28 0 01-2.34.94q-3.89 0-3.89-4.36a7 7 0 011.59-4A13.76 13.76 0 0115.5.25l1 1.13q-2.58 2.2-2.58 3.38 0 .28 1 .66a5.69 5.69 0 011.83.94 2.68 2.68 0 011 2.23z")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: round($iconSize * 0.36)
    overflow: visible
    stroke: var(--graydarker)
    fill: none

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-linejoin: round
    stroke-width: 0.8px
</style>
