<template lang="pug">
  svg(viewBox='0 0 60 48', preserveAspectRatio='none')
    path.cls-1(d='M0,9H60')
    path.cls-1(d='M0,24H60')
    path.cls-1(d='M0,39H60')
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    width: round($iconSize * 1.25)
    height: round($iconSize * 0.9)
    fill: none
    stroke: var(--graydarker)
    margin-top: 3px

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-linecap: round
    stroke-linejoin: round
    stroke-width: 3px
    transition: var(--icon-transition) stroke
</style>
