<template lang="pug">
  .microphone__menu.active-menu
    .microphone__menu-counter
      span.microphone__menu-dot
      span.microphone__menu-text
        | {{secCounter.minutes | doubleFormat}}:{{secCounter.seconds | doubleFormat}}:{{secCounter.milliSeconds | doubleFormat}}

    .microphone__menu-controls
      .microphone__menu-icon.microphone__menu-icon-cancel(
        ref="cancelIcon",
        @click="closeMicrophoneMenu",
      )
        delete-icon

      .microphone__menu-cancel(ref="cancelText")
        angle-icon
        span.microphone__menu-cancel-text Cancel

      button.microphone__menu-icon(
        v-touch:start.stop="startHandler",
        ref="sendIcon",
      )
        send-message-icon
</template>

<script src="./AudioRecordPanel.ts" lang="ts"></script>

<style src="./audio-record-panel.styl" scoped lang="styl"></style>
