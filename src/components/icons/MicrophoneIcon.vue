<template lang="pug">
  svg(viewBox="0 0 46.5 65.57")
    path.cls-1(d="M23.14,1.25h0c5.49,0,10,3.71,10,8.31V32.94c0,4.54-4.55,8.31-10,8.31h0c-5.49,0-10-3.77-10-8.31V9.56C13.17,5,17.65,1.25,23.14,1.25Z")
    path.cls-2(d="M45.25,33.77c-1,8.26-10.82,15.87-22.47,15.77S3,42.39,1.25,34.08")
    path.cls-1(d="M23.29,49.64V64.1")
    path.cls-2(d="M9.32,64.32H37.18")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: round($iconSize * 1.09)
    fill: none
    stroke: var(--graydarker)

  .cls-1
  .cls-2
    fill: inherit
    stroke: inherit
    stroke-width: 3px

  .cls-2
    stroke-linecap: round
</style>
