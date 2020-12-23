<template lang="pug">
  .user-profile__section.call-section
    profile-item.user-profile__section__item(
      label="Write message",
      @on-click="writeMessage",
    )
      chat-icon(slot="icon")

    profile-item.user-settings__item(
      label="Audio call",
      @on-click="startAudioCall",
    )
      call-icon(slot="icon")

    profile-item.user-settings__item(
      label="Video call",
      @on-click="startVideoCall",
    )
      video-camera-icon(slot="icon")
</template>

<script src="./CallSection.ts" lang="ts"></script>

<style src="./call-section.styl" lang="stylus" scoped></style>
