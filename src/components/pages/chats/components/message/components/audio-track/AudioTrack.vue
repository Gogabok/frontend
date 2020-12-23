<template lang="pug">
  .message__container-file__item.audio-message
    audio(
      :src="link",
      ref="audio",
    )
      | Your browser does not support the <code>audio</code> element.
    .audio-message
      .audio-message-button(@click="playAudioHandle")
        transition(:duration="200", name="fade", mode="out-in")
          play-icon(v-if="!isPlayed")
          pause-icon(v-else)

      .audio-message-progress
        .audio-message-progress-bar-wrapper(
          v-for="n in count",
          :key="n",
          @click="selectTime(n)",
        )
          .audio-message-progress-bar(
            :style="{height: `${heightParams[n]}px`}",
            :class="{'active': n <= activeNum}",
          )
</template>

<script src="./AudioTrack.ts" lang="ts"></script>

<style src="./audio-track.styl" lang="stylus" scoped></style>
