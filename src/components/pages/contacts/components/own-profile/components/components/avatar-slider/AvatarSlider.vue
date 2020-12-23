<template lang="pug">
  .profile-settings__avatar-slider
    .profile-settings__slider-gradient.top
    swiper.swiper.profile-settings__slider(
      ref="swiper",
      @slideChange="slideChangeHandler",
      :auto-update="true",
      :options="swiperOption",
      :class="{'swiper-no-swiping': user.gallery.length < 2}",
    )
      slide(
        v-if="user.gallery.length",
        v-for="(item, index) in user.gallery",
        :key="index",
        :poster="item.poster",
        :type="item.type",
        @open-media-player="setMediaPlayerVisibility",
      )
      swiper-slide.profile-settings__slider__item(v-if="!user.gallery.length")
        img.profile-settings__slider__item__poster(
          src="~assets/img/gapopa.svg",
          alt="image",
          @mousedown.prevent,
          @click="setMediaPlayerVisibility",
        )
      .swiper-pagination(slot="pagination")

    template(v-if="!isMobileMode && user.gallery.length > 1")
      button.profile-settings__avatar-slider__arrow.left(@click="prevSlide")
        img(src="~assets/img/icons/angle-thin-white.svg", alt="")

      button.profile-settings__avatar-slider__arrow.right(@click="nextSlide")
        img(src="~assets/img/icons/angle-thin-white.svg", alt="")

    .profile-settings__gallery-controls
      button.profile-settings__avatar-slider__avatar-wrapper(
        :class="user.status",
        @click="editAvatar",
      )
        .profile-settings__avatar-slider__avatar(
          :style="`background-image: url(${activeSlideImage});`",
          :class="{'default': !this.user.gallery.length}",
        )
      button.profile-settings__avatar-slider__set-avatar(
        @click="() => user.avatarId === activeImageId ? editAvatar() : setActiveAsAvatar()",
        :class="{'empty': !user.gallery.length}",
      )
        | {{avatarLabel}}

    avatar-editor(
      v-if="isAvatarEditorMode",
      :imageSrc="activeSlideImage",
      :imageId="activeImageId"
      @update-avatar="updateAvatarHandler",
      @close="closeAvatarEditorHandler",
    )
</template>

<script src="./AvatarSlider.ts" lang="ts"></script>

<style src="./avatar-slider.styl" lang="stylus" scoped></style>

<style src="./pagination.styl" lang="stylus"></style>

