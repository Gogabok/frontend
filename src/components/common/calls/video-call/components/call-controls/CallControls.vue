<template lang="pug">
  .call__controls(@mousedown.prevent.stop, @touchstart.prevent.stop)
    button.call__controls-item.video(
      v-touch:tap="() => isMobileMode && toggleVideo()",
      @mousedown.stop.prevent,
      @touchstart.stop.prevent,
      @touchend.stop.prevent,
      @click="toggleVideo"
      :class="{ disabled: selfCallParticipantData.isVideoMuted }",
      :disabled="areButtonsBlocked",
    )
      video-camera-icon

    button.call__controls-item.audio(
      v-touch:tap="() => isMobileMode && toggleAudio()",
      @mousedown.stop.prevent,
      @touchstart.stop.prevent,
      @touchend.stop.prevent,
      @click.stop.prevent="toggleAudio",
      :class="{ disabled: selfCallParticipantData.isAudioMuted }",
    )
      microphone-icon

    button.call__controls-item.rotate(
      v-touch:tap="() => isMobileMode && rotateCamera()",
      @mousedown.stop.prevent,
      @touchstart.stop.prevent,
      @touchend.stop.prevent,
      @click.stop.prevent="rotateCamera",
      v-if="hasFrontalCamera",
      :disabled="areButtonsBlocked",
    )
      rotate-icon

    button.call__controls-item.screen-share(
      v-if="isShareDisplayButtonVisible",
      v-touch:tap="() => isMobileMode && toggleScreenSharing()",
      @mousedown.stop.prevent,
      @touchstart.stop.prevent,
      @touchend.stop.prevent,
      @click.stop.prevent="toggleScreenSharing",
      :disabled="areButtonsBlocked",
    )
      screen-sharing-icon

    button.call__controls-item.end-call(
      @mousedown.stop.prevent,
      @touchstart.stop.prevent,
      @touchend.stop.prevent,
      v-touch:tap.stop.prevent="endCall",
    )
      call-icon(fill)
</template>

<script src="./CallControls.ts" lang="ts"></script>

<style src="./call-controls.styl" lang="stylus" scoped></style>
