<template lang="pug">
  svg(viewBox="0 0 59.74 60.6")
    path.cls-1(d="M59.74 59.1H1.5a28.86 28.86 0 0128.58-29")
    ellipse.cls-1(cx="30.37", cy="15.83", rx="14.18", ry="14.33")
    path.cls-1(d="M38.08 43.58h20M48.08 53.58v-20")
</template>

<style lang="stylus" scoped>
  svg
    stroke: var(--graydarker)
    fill: none
    transition: var(--icon-transition) stroke

    &.active
      stroke: var(--blue)

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-width: 3px
</style>
