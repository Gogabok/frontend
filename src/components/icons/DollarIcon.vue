<template lang="pug">
  svg(viewBox="0 0 60.6 60.6")
    path.cls-1(d="M40.09 57.44a32.11 32.11 0 01-9.79 1.66 28.8 28.8 0 1128.8-28.8 32.36 32.36 0 01-1.44 9.14")
    path.cls-2(d="M31.37 53.28a24 24 0 01-24-23.9v-.08M29.37 7.32a23.94 23.94 0 0123.9 23.9v.07")
    path.cls-3(d="M25 21l5.56-2.73h.55v19.2a10.34 10.34 0 00.16 2.4 1.37 1.37 0 00.65.71 5.43 5.43 0 002.08.32v.65h-8.52v-.65a5.23 5.23 0 002.07-.27 1.27 1.27 0 00.65-.65 10 10 0 00.16-2.45V25.25a18 18 0 00-.16-3.16 1.2 1.2 0 00-.44-.82 1 1 0 00-.71-.22 4.75 4.75 0 00-1.75.49z")
    path.cls-4(d="M46.67 56.09v-7.15h-7V46h7v-7h2.93v7h7v2.92h-7v7.15z")
</template>

<style lang="stylus" scoped>
  .cls-1
  .cls-2
    fill: none
    stroke-width: 3px

  .cls-1
  .cls-2
  .cls-3
    stroke: var(--graydarker)
    transition: var(--icon-transition) stroke, var(--icon-transition) fill

  .cls-2
    stroke-dasharray: 30 9

  .cls-3
    fill: var(--graydarker)
    stroke-miterlimit: 10

  .cls-4
    fill: var(--green)
    transform: scale(1.45) translate(-15px, -15px)

  .active
    .cls-1
    .cls-2
    .cls-3
      stroke: var(--blue)

    .cls-3
      fill: var(--blue)
</style>
