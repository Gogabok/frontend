<template lang="pug">
  swiper-slide.slider-item
    .slider-item__media(
      v-touch:tap="() => tapHandler('video')",
      v-if="item.type == 'video'",
      @click="togglePlay",
    )
      video(
        playsinline,
        :id="`media-${id}`",
        :data-poster-src="item.poster",
        :class="{'hidden': !hasVideoBeenRun}",
        :src="item.src",
        :controls="false",
        :poster="item.poster",
      )
      img(
        v-if="!hasVideoBeenRun"
        :class="{'hidden': hasVideoBeenRun}",
        :src="item.poster",
        @click.prevent="",
        @mousedown.prevent="",
      )
      transition(:duration="200", name="fade", mode="out-in")
        button.slider-item__media__play-button(v-if="!isVideoRunning")
          play-icon(white)

    .slider-item__media(
      v-touch:tap="tapHandler",
      @click="imageClickHandler",
      v-else-if="item.type == 'image'",
    )
      img(
        :id="`media-${id}`",
        :data-poster-src="item.poster",
        :src="item.type === 'image' ? item.src : item.poster",
        alt="Media item cover",
        @click.prevent="",
        @mousedown.prevent="",
      )

    a.slider-item__media.doc(
      v-touch:tap="tapHandler",
      :href="item.src",
      target="_blank",
      title="Click to open file preview",
      v-else,
    )
      img(
        :id="`media-${id}`",
        :data-poster-src="item.poster",
        :src="item.type === 'image' ? item.src : item.poster",
        @click.prevent="",
        @mousedown.prevent="",
        alt="Media item cover",
      )
</template>

<script src="./SliderItem.ts" lang="ts"></script>

<style src="./slider-item.styl" lang="stylus" scoped></style>
