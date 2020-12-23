<template lang="pug">
  .contacts__menu(:class="{'active-menu': isVisible}")
    .contacts__menu-overlay(@click="closeContactsMenu")
    .contacts__menu-list
      menu-item.contacts__menu-item(text="Reply", @on-click="reply")
        forward-icon.contacts__menu-item-forward(reflectY, slot="icon")

      menu-item.contacts__menu-item(
        text="Copy",
        @on-click="copy",
        v-if="!isCopyDisabled",
      )
        copy-icon(slot="icon")

      menu-item.contacts__menu-item(text="Save", @on-click="save")
        save-icon(slot="icon")

      menu-item.contacts__menu-item(text="Forward", @on-click="forward")
        forward-icon.contacts__menu-item-forward(slot="icon")

      menu-item.contacts__menu-item(
        text="Share",
        @on-click="share",
        v-if="isShareAPISupported",
      )
        share-icon(slot="icon")

      menu-item.contacts__menu-item(text="Delete", @on-click="del")
        delete-icon(slot="icon")

      hr.separator
      menu-item.contacts__menu-item(text="Cancel", @on-click="closeContactsMenu")
        plus-icon.close-icon(slot="icon")
</template>

<script src="./ToolsMenu.ts" lang="ts"></script>

<style src="./tools-menu.styl" lang="styl" scoped></style>
