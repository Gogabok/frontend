<template lang="pug">
  .call(
    v-touch:start="!isMobileMode && callMoveHandler.start",
    @mouseleave="callMoveHandler.end",
  )
    .call__header
      span {{capitalize(callType)}} call

    .call__avatar-container
      img.call__avatar(
        v-for="(image, index) in avatars",
        :src="image",
        :style="avatars.length % 2 === 1 && index === avatars.length - 1 && {\
          'grid-column': '1/-1',\
        }"
      )

    .call__info
      span.call__info--from {{fromLabel}}
      span.call__info--members-amount(v-if="callerData.type === 'group'")
        | {{callerData.participants.length}} members

    transition(name="fade", mode="out-in")
      .call__message--container(v-if="isVisibleMessages")
        .call__message(
          v-for="(text, index) in replyMessages",
          :key="index",
          @click="(event) => declineCallWithMessage(event, text)",
        )
          span.call__message--text {{text}}

    .call__controls
      button.call__controls-item
        .call__controls-item--icon.accept(@click.stop="acceptCall")
          video-camera-icon(:fill="true", v-if="callType === 'video'")
          call-icon(:fill="true", v-else)
        span.call__controls-item--text
            | Accept

      button.call__controls-item
        .call__controls-item--icon.message(@click.stop="openMessageBox")
          chats-icon
        span.call__controls-item--text
          | Message

      button.call__controls-item
        .call__controls-item--icon.decline(@click.stop="declineCall")
          call-icon(:fill="true")
        span.call__controls-item--text
          | Decline
</template>

<script src="./IncomingCall.ts" lang="ts"></script>

<style src="./incoming-call.styl" lang="stylus" scoped></style>
