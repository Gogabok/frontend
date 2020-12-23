<template lang="pug">
  .participant(
    :class="{\
      'default': avatar.isDefault,\
      'active': isVideoActive,\
      'muted': participant.isAudioMuted && !id.includes('-screen'),\
    }"
  )
    video.participant__video(
      ref="video",
      playsinline,
      autoplay,
      :srcObject="videoStream",
      v-show="isVideoActive",
      @mousedown.prevent,
      @touchstart.prevent,
    )
    img(
      class="participant__avatar",
      :src="avatar.avatarPath",
      v-show="!isVideoActive",
      @mousedown.prevent,
      @touchstart.prevent,
    )
    audio(
      ref="audio",
      autoplay,
      :srcObject="audioStream",
      hidden,
      :muted="Boolean(participant.isAudioMuted || this.id.includes('-screen'))",
    )
    .participant__mic-icon(
      v-if="participant.isAudioMuted && !id.includes('screen')",
    )
      microphone-icon
</template>

<script src="./Participant.ts" lang="ts"></script>

<style src="./participant.styl" lang="stylus" scoped></style>
