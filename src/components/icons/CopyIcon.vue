<template lang="pug">
  svg(viewBox="0 0 60.6 60.6")
    path.cls-1(d="M8.7 8.7v-.86c0-3.53 2.38-6.34 5.3-6.34h39.84c2.88 0 5.26 2.81 5.26 6.34v37.8c0 3.46-2.38 6.26-5.26 6.26H51.9")
    path.cls-1(d="M6.76 8.7h39.88c2.88 0 5.26 2.81 5.26 6.34v37.8c0 3.46-2.38 6.26-5.26 6.26H6.76c-2.88 0-5.26-2.81-5.26-6.26V15c0-3.49 2.38-6.3 5.26-6.3z")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: $iconSize
    stroke: var(--graydarker)
    fill: none

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-width: 3px
</style>
