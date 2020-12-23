<template lang="pug">
  svg(viewBox="0 0 74.07 67.05")
    path.cls-1(d="M74.07 65.55H15.83a28.86 28.86 0 0128.58-29")
    ellipse.cls-1(cx="44.7", cy="22.28", rx="14.18", ry="14.33")

    path.cls-1(d="M52.41 50.03h20m-10 10v-20")
    path.cls-1(d="M12.69 55.43H1.5a27 27 0 0126.76-27.15")
    path.cls-1(d="M28.5 28.34a13.42 13.42 0 010-26.83 13.16 13.16 0 019.39 3.93")
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
