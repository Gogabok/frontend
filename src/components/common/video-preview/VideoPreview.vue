<template lang="pug">
  .player
    .contacts__image-preview-button(@click="handleVideoClick")
      transition(:duration="200", name="fade", mode="out-in")
        .contacts__image-preview-button-item(v-if="!isPlayedVideo")
          play-icon(white)

    video.contacts__image-preview-item(
      ref="video",
      :src="videoSrc",
    )
</template>

<script src="./VideoPreview.ts" lang="ts"></script>

<style src="./video-preview.styl" lang="stylus" scoped></style>
