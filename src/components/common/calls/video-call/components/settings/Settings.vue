<template lang="pug">
  .call-settings
    .call-settings__header
      h3.call-settings__title
        | Settings Audio & Video

      .call-settings__close(@click="closeSettings")
        plus-icon

    .call-settings__body
      .call-settings__section
        h4.call-settings__section-label
          | Video

        .call-settings__select
          select.call-settings__select-input(@change="selectVideoDevice")
            option(
              v-for="device in videoDevices",
              :value="device.id",
              :selected="device.isSelected",
            )
              | {{device.label}}
          angle-icon.call-settings__select-icon

      .call-settings__separator-line

      .call-settings__section
        h4.call-settings__section-label
          | Audio

        .call-settings__select
          select.call-settings__select-input(@change="selectAudioDevice")
            option(
              v-for="device in audioDevices"
              :value="device.id",
              :selected="device.isSelected",
            )
              | {{device.label}}
          angle-icon.call-settings__select-icon
</template>

<script src="./Settings.ts" lang="ts"></script>

<style src="./settings.styl" lang="stylus" scoped></style>
