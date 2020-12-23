<template lang="pug">
  .profile-settings__header-bar
    button.profile-settings__header-bar__back(@click="close")
      angle-icon.icon
      span Back
    button.profile-settings__header-bar__action(@click="uploadMediaFiles")
      | Add photo / video

    input.chat_settings-file(
      @change="fileUploadHandler",
      multiple,
      hidden,
      type="file",
      :accept="extensionsList",
      ref="uploader",
    )
</template>

<script src="./HeaderBar.ts" lang="ts"></script>

<style src="./header-bar.styl" lang="stylus" scoped></style>
