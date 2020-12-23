<template lang="pug">
  .footer(:class="{ 'single': !isGroupChat }")
    .target-overlay(v-if="isTarget")
      plus-icon
    button.footer__arrow.left(
      :class="{ 'hidden': isScrolledToTheStart || !isParticipantsContainerFull }",
      @mousedown.stop.prevent="event => scroll(event, Direction.Left)",
      @touchstart.stop.prevent="event => scroll(event, Direction.Left)",
    )
      img(src="~assets/img/icons/angle-thin-white.svg")

    button.footer__arrow.right(
      :class="{ 'hidden': isScrolledToTheEnd || !isParticipantsContainerFull }",
      @mousedown.stop.prevent="event => scroll(event, Direction.Right)",
      @touchstart.stop.prevent="event => scroll(event, Direction.Right)",
    )
      img(src="~assets/img/icons/angle-thin-white.svg")

    .footer__participants(
      ref="participantsContainer",
      @scroll="scrollHandler",
      :class="{\
        'full': isParticipantsContainerFull,\
      }",
    )
      participant(
        v-for="id in usersToDisplay",
        :id="id",
        @mousedown.native.prevent="(event) => startDragging(event, id)",
        @touchstart.native.prevent="(event) => startDragging(event, id)",
      )
</template>

<script src="./CallFooter.ts" lang="ts"></script>

<style src="./call-footer.styl" lang="stylus" scoped></style>
