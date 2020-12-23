<template lang="pug">
  svg(viewBox="0 0 60.6 60.6")
    path.cls-1(d="M20.72 20.72L1.5 1.5M20.72 6.32v14.4H6.32M39.88 39.88L59.1 59.1M39.88 54.28v-14.4h14.4M20.72 39.88L1.5 59.1M6.32 39.88h14.4v14.4M39.8 20.58L59.1 1.5M54.2 20.65l-14.4-.07.1-14.43")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: $iconSize
    stroke: var(--white)

  .cls-1
    fill: none
    stroke: inherit
    stroke-linecap: round
    stroke-linejoin: round
    stroke-width: 3px
</style>
