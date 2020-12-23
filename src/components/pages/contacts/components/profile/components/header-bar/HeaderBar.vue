<template lang="pug">
  .user-profile__header-bar
    button.user-profile__header__icon.arrow(
      v-if="isBackButtonVisible",
      @click="close",
    )
      angle-icon
      span Back

    .user-profile__header__contacts(v-if="profileOwner.type === 'person'")
      button.user-profile__header__icon.video(@click="() => callHandler(CallType.Video)")
        video-camera-icon

      button.user-profile__header__icon.audio(@click="() => callHandler(CallType.Audio)")
        call-icon

      button.user-profile__header__icon.chat(@click="writeMessage")
        chat-icon.user-profile__header__arrow-chat

    template(v-else-if="profileOwner.type === 'group'")
      button.user-profile__header__action(@click="uploadMediaFiles")
        | Add photo/video

      input.chat_settings-file(
        @change="fileUploadHandler",
        multiple,
        hidden,
        type="file",
        accept="mediaFileTypes",
        ref="uploader",
      )
</template>

<script src="./HeaderBar.ts" lang="ts"></script>

<style src="./header-bar.styl" lang="stylus"></style>
