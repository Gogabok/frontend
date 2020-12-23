<template lang="pug">
  svg(viewBox="0 0 46 46")
    path(d="M36.4.4a3.03 3.03 0 00-3.21.14L19.64 12H9a1 1 0 00-1 1v19a1 1 0 001 1h10.61l13.55 12.44.16.12a3.06 3.06 0 003.09.04c1-.56 1.6-1.6 1.6-2.76V3.16C38 2 37.4.96 36.4.4zM36 42.85c0 .43-.21.8-.58 1.01-.15.09-.54.26-1 .03L21 31.56V27a1 1 0 10-2 0v4h-9V14h9v4a1 1 0 102 0v-4.54L34.4 2.12c.47-.24.87-.07 1.02.02.36.2.58.59.58 1.02v39.68z")
</template>

<style lang="stylus" scoped>
  @import "~themes/_variables"

  svg
    height: $iconSize
    width: @height
    fill: var(--graydarker)
</style>
