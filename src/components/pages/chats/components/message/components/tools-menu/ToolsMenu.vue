<template lang="pug">
  .tools-menu(
    :class="[\
      {'active-menu': isVisible},\
      {'tools-menu-left': position.left},\
      {'tools-menu-top': position.top},\
      {'tools-menu-right': position.right},\
      {'tools-menu-bottom': position.bottom},\
    ]",
  )
    template(v-if="isVisible")
      .tools-menu-overlay(@click.stop="closeContactsMenu")
      .tools-menu-list
        menu-item.tools-menu-item(
          text="Reply",
          @on-click="reply",
        )
          forward-icon.tools-menu-item-reply.tools-menu-item-forward(
            slot="icon",
            reflectY,
          )

        menu-item.tools-menu-item(
          v-if="hasMessageText",
          text="Copy",
          @on-click="copy",
        )
          copy-icon.tools-menu-item-forward(slot="icon")

        menu-item.tools-menu-item(
          text="Save",
          v-if="hasAttachments",
          @on-click="download",
        )
          save-icon(slot="icon")

        menu-item.tools-menu-item(
          text="Translate",
          @on-click="translate",
        )
          transfer-icon.tools-menu-item-forward(slot="icon")

        menu-item.tools-menu-item(
          text="Forward",
          @on-click="forward",
        )
          forward-icon.tools-menu-item-forward(slot="icon")

        menu-item.tools-menu-item(
          text="Share",
          v-if="isShareApiSupported",
          @on-click="share",
        )
          share-icon.tools-menu-item-forward(slot="icon")

        menu-item.tools-menu-item(
          text="Delete",
          @on-click="del",
        )
          delete-icon(slot="icon")
</template>

<script src="./ToolsMenu.ts" lang="ts"></script>

<style src="./tools-menu.styl" lang="stylus" scoped></style>
