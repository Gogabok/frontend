<template lang="pug">
  svg(viewBox="0 0 59.32 59.32")
      path.cls-1(d="M7.35,46.72l3.25-5.49A64.86,64.86,0,0,0,8,34.93l-6.17-1.6c-.41-.39-.42-7,0-7.42L8,24.36A63.42,63.42,0,0,0,10.61,18L7.34,12.57c0-.57,4.68-5.29,5.23-5.25l5.5,3.24A63.45,63.45,0,0,0,24.4,8l1.5-6.16c.38-.42,7-.43,7.43,0L35,8a64.28,64.28,0,0,0,6.31,2.61l5.46-3.27C47.31,7.29,52,12,52,12.54L48.7,18a64.19,64.19,0,0,0,2.59,6.33L57.5,26c.41.39.43,7,0,7.43L51.42,35a64.76,64.76,0,0,0-2.61,6.31L52,46.69c0,.57-4.67,5.28-5.23,5.25l-5.43-3.23A64.11,64.11,0,0,0,35,51.33l-1.6,6.17c-.39.41-7,.43-7.43,0L24.39,51.4A56.59,56.59,0,0,0,18,48.76L12.6,52C12,52,7.36,47.27,7.35,46.72Z")
      circle.cls-1(
        cx="29.62",
        cy="29.34",
        r="12.5",
        transform="translate(-8.82 45.47) rotate(-67.5)",
      )
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: round($iconSize * 0.9)
    stroke: var(--graydarker)
    fill: none

  .cls-1
    fill: inherit
    stroke: inherit
    stroke-linecap: round
    stroke-linejoin: round
    stroke-width: 3px
</style>
