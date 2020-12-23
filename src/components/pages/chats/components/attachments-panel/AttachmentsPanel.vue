<template lang="pug">
  .attachments-menu.attachments.active-menu
    .attachments-menu__back
    input.attachments-menu-input.no-close(
      multiple,
      @change="fileChange",
      type="file",
      ref="file",
    )
    input.attachments-menu-input(
      @change="photoChange",
      type="file",
      accept="image/*",
      capture,
      ref="filePhoto",
    )
    input.attachments-menu-input(
      type="file",
      accept="video/*",
      capture,
      ref="fileVideo",
    )

    .attachments-menu-list
      menu-item.attachments-menu-item(
        text="Video message",
        @on-click="() => openCamera('video')",
      )
        camera-icon(slot="icon")

      menu-item.attachments-menu-item(
        text="Photo message",
        @on-click="() => openCamera('photo')",
      )
        photo-icon(slot="icon")

      menu-item.attachments-menu-item.attachments-menu-item-attach.no-close(
        text="Attachment",
        @on-click="fileClick"
        noclose,
      )
        attach-icon.no-close(slot="icon")

      menu-item.attachments-menu-item.attachments-menu-item-translate(
        text="Translation",
        v-if="isMobileMode",
        @on-click="handleMobileTranslate",
      )
        transfer-icon(:isActive="isPayedDialog", slot="icon")
</template>

<script src="./AttachmentsPanel.ts" lang="ts"></script>

<style src="./attachments-panel.styl" lang="stylus" scoped></style>
