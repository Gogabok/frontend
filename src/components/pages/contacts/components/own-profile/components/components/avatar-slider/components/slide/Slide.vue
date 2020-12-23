<template lang="pug">
  swiper-slide.profile-settings__slider__item(@click="openMediaPlayer")
    img.profile-settings__slider__item__poster(
      :src="poster",
      alt="image",
      @click="openMediaPlayer",
    )
    .profile-settings__slider__item__play-button(v-if="type === 'video'")
      play-icon
    img.profile-settings__slider__item__background(
      v-if="!isMobileMode",
      :src="poster",
      alt="background",
    )
    .profile-settings__slider-gradient
</template>

<script src="./Slide.ts" lang="ts"></script>

<style src="./slide.styl" lang="styl" scoped></style>
