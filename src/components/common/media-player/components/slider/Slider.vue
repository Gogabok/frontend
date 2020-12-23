<template lang="pug">
.slider-wrapper
  swiper.swiper.preview_container__item(
    ref="swipeElement",
    :options="swiperOptions",
    :auto-update="true",
    :auto-destroy="true",
    :delete-instance-on-destroy="true",
    :cleanup-styles-on-destroy="true",
    @slideChange="slideChangeHandler",
    @sliderMove="slideTransitionStartHandler",
  )
    slider-item(
      :style="slideStyles",
      v-for="(item, index) in gallery" :key="index",
      v-if="item",
      :item="item",
      :id="item.id",
      :isVideoRunning="isVideoRunning",
      :hasVideoBeenRun="hasVideoBeenRun",
      :activeSlideId="gallery[activeSlideIndex].id",
      :isInterfaceVisible="isInterfaceVisible",
      @set-scaled="setScaleHandler",
      @set-interface="setInterface",
      @video-ended="videoEndHandler",
      @toggle-video="playHandler",
      @video-has-been-run="hasVideoBeenRun = true",
    )
  .thumbnails-wrapper(ref="thumbnailsWrapper", :class="{ 'active': isInterfaceVisible }")
    swiper.swiper.slider__thumbnails(
      ref="thumbnailsSwiper",
      :options="thumbnailsSwiperOptions",
      @slideChange="thumbChangeHandler",
    )
      swiper-slide.thumbnail__slide(
        v-for="(item, index) in gallery" :key="'thumbnail' + index",
      )
        img(
          :class="{ 'active': index === activeSlideIndex }",
          :src="item.poster",
        )
</template>

<script lang="ts" src="./Slider.ts"></script>

<style lang="stylus" src="./slider.styl" scoped></style>

<!--Separated from video-player.styl 'cause it must not be scoped style.-->
<style src="./bullets.styl" lang="stylus"></style>
