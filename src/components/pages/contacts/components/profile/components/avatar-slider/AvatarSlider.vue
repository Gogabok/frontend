<template lang="pug">
  .profile-settings__avatar-slider
    .profile-settings__slider-gradient.bottom
    .profile-settings__slider-gradient.top
    swiper.swiper.profile-settings__slider(
      ref="swiper",
      @slideChange="slideChangeHandler",
      :auto-update="true",
      :options="swiperOption",
      :class="{'swiper-no-swiping': profileOwner.gallery.length < 2}",
    )
      slide(
        v-if="profileOwner.gallery.length",
        v-for="(item, index) in profileOwner.gallery",
        :key="index",
        :poster="item.poster",
        :type="item.type",
        @open-media-player="setMediaPlayerVisibility",
      )
      swiper-slide.profile-settings__slider__item(
        v-if="!profileOwner.gallery.length",
      )
        img.profile-settings__slider__item__poster(
          src="~assets/img/gapopa.svg",
          alt="image",
          @click="setMediaPlayerVisibility",
          @mousedown.prevent,
        )
      .swiper-pagination(slot="pagination")

    template(v-if="!isMobileMode && profileOwner.gallery.length > 1")
      button.profile-settings__avatar-slider__arrow.left
        img(src="~assets/img/icons/angle-thin-white.svg", alt="")

      button.profile-settings__avatar-slider__arrow.right
        img(src="~assets/img/icons/angle-thin-white.svg", alt="")

    .profile-settings__gallery-controls(v-if="profileOwner.type === 'group'")
      button.profile-settings__avatar-slider__avatar-wrapper(
        :class="status",
        @click="setActiveAsAvatar",
      )
        .profile-settings__avatar-slider__avatar(
          :class="{'default': !profileOwner.gallery.length}",
          :style="`background-image: url(${activeSlideImage});`",
        )
      button.profile-settings__avatar-slider__set-avatar(
        @click="() => user.avatarId === activeImageId ? editAvatar() : setActiveAsAvatar()",
        :class="{'empty': !profileOwner.gallery.length}",
      )
        | {{avatarLabel}}

    avatar-editor(
      v-if="isAvatarEditorMode && profileOwner.type === 'group'",
      :imageSrc="activeSlideImage",
      :imageId="activeImageId"
      @update-avatar="updateAvatarHandler",
      @close="closeAvatarEditorHandler",
    )
</template>

<script src="./AvatarSlider.ts" lang="ts"></script>

<style src="./avatar-slider.styl" lang="stylus" scoped></style>

<style src="./pagination.styl" lang="stylus"></style>

