<template lang="pug">
  svg(viewBox="0 0 60.6 60.6")
    circle.cls-1(cx="30.3", cy="30.3", r="28.8")
    text.cls-2(transform="translate(15.94 45.28)") A
</template>

<style lang="stylus" scoped>
  svg
    fill: none
    stroke: var(--graydarker)

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-width: 3px

  .cls-2
    isolation: isolate
    font-size: calc(var(--smallFont) * 3)
    fill: var(--graydarker)
    font-family: Verdana, Verdana
</style>
