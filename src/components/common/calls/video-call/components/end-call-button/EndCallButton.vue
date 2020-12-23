<template lang="pug">
  button.end-call(
    @mousedown.stop.prevent,
    @touchstart.stop.prevent,
    @touchend.stop.prevent,
    v-touch:tap.stop.prevent="endCall",
  )
    call-icon(fill)
</template>

<script src="./EndCallButton.ts" lang="ts"></script>

<style src="./end-call-button.styl" lang="stylus" scoped></style>
