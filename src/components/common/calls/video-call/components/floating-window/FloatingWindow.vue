<template lang="pug">
  .floating-window(
    :class="{\
      'loaded': !isLoading,\
      'minified': isMinified,\
    }",
    v-if="isVisible",
  )
    .floating-window__overlay(v-if="callParticipant.isAudioMuted && !isLoading")
    .floating-window__microphone(v-if="callParticipant.isAudioMuted && !isLoading")
      microphone-icon

    video.floating-window__video-element(
      playsinline,
      muted,
      autoplay,
      :srcObject="videoStream",
      ref="video",
    )
</template>

<script src="./FloatingWindow.ts" lang="ts"></script>

<style src="./floating-window.styl" lang="stylus" scoped></style>
