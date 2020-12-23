<template lang="pug">
  .call-header(@mousedown.prevent.stop, @touchstart.prevent.stop)
    .call__await(v-if="isLoading")
      .call__name
        | {{callerName}}
      .call__loader
        span Calling
        .call__loader-dot
        .call__loader-dot
        .call__loader-dot


    .call-header__tech-info(v-else)
      .call-header__tech-info--network
        .network-bar(
          v-for="index in 5",
          :class="{ 'active': index <= connectionQualityScore }",
        )

      span.call-header__tech-info--time
        | {{ time.minutes | doubleFormat }}:{{time.seconds | doubleFormat}}

    .call-header__actions
      .call-header__actions--left
        button.navigation__arrow(
          v-touch:tap.stop.prevent="minifyCall",
          v-if="isMobileMode",
        )
          img.icon(src="~assets/img/icons/angle-thin-white.svg", alt="<")
          span.label Back

        button.call-header__icon.fullscreen(
          v-touch:tap.stop.prevent="toggleFullscreen",
          ref="fullScreenButton",
          v-else,
        )
          zoom-out-icon(v-if="isFullscreen")
          zoom-in-icon(v-else)

      .call-header__actions--right
        button.call-header__icon(
          v-if="isAddUserVisible && !isLoading",
          :class="{'disabled': isLoading }",
          v-touch:tap.stop.prevent="addParticipant",
        )
          img(src="~assets/img/icons/addcontact-white.svg", alt="add-contact")

        button.call-header__icon.dots-triplet(
          v-touch:tap.stop.prevent="() => setPopupMenuVisibility(true)",
        )
          .dots-triplet--icon

      transition(name="fade", mode="out-in")
        .call-settings(v-if="isCallSettingsVisible")
          .call-settings__overlay(
            v-touch:tap.stop.prevent="() => setPopupMenuVisibility(false)",
            :style="{\
              width: `${$parent.settings.width}px`,\
              height: `${$parent.settings.height}px`,\
            }",
          )
          .call-settings__container
            button.call-settings__item(
              v-for="item in menuItems",
              v-touch:tap.stop.prevent="item.action",
            )
              span.call-settings__item__icon(:class="[item.iconClass || '']")
                component(:is="item.icon")
              | {{item.label}}
</template>

<script src="./CallHeader.ts" lang="ts"></script>

<style src="./call-header.styl" lang="stylus" scoped></style>
