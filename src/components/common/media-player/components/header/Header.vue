<template lang="pug">
  .media-player__header(
    :class="{'media-player__header-background': isSelectMode}",
  )
    button.media-player__header-arrow.media-player__header-text(
      v-if="!isSelectMode",
      @click="closeHandler",
    )
      template(v-if="isMediaLineMode")
        angle-icon(white)
        | Назад
      template(v-else)
        | Закрыть

    button.media-player__header-text(
      v-if="isSelectMode",
      @click="handleCheckAll",
    )
      template(v-if="isAllMessagesChecked") Deselect all
      template(v-else) Select all

    button.media-player__header__control-button(@click="controlClickHandler")
      span.media-player__header-text(v-if="!isMediaLineMode") Medialine

      template(v-else)
        span.media-player__header-text(v-if="isSelectMode") Cancel
        span.media-player__header-text(v-else) Select
</template>

<script src="./Header.ts" lang="ts"></script>


<style src="./header.styl" scoped lang="stylus"></style>
