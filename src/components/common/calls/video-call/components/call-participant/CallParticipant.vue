<template lang="pug">
  .call-participant(
    :class="{\
      'minified': isMinified,\
      'awaiting': isLoading,\
    }",
  )
    .audio-disabled-icon(v-if="callParticipantData.isAudioMuted")
      .icon
        microphone-icon
      | Microphone disabled

    .call__background(
      :class="{\
        'avatar': (callParticipantData.isVideoMuted), \
        'default': !(userData && userData.avatarPath),\
      }",
      :style="{\
        '--background': `url('${userData ? userData.avatarPath : ''}')`,\
        '--background-size': 'cover',\
      }",
    )
      video.call__video-element(
        ref="video",
        playsinline,
        autoplay,
        :srcObject="videoStream",
        v-show="!callParticipantData.isVideoMuted",
      )
      audio.call__audio-element(
        ref="audio",
        autoplay,
        :srcObject="audioStream",
        hidden,
        :muted="Boolean(callParticipantData.isAudioMuted || isSelf)",
      )
</template>

<script src="./CallParticipant.ts" lang="ts"></script>

<style src="./call-participant.styl" lang="stylus" scoped></style>
