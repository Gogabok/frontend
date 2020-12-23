<template lang="pug">
  .media-line-item(
    v-touch:touchhold="toolsHandler",
    @click="selectMedia(mediaIndex)",
  )
    .media-line-item__media(ref="itemWrapper")
      button.media-line-item__media-container(
        ref="itemContent",
        @click="openItemInPlayer",
      )
        img(
          :data-poster-src="item.poster",
          :src="item.poster",
          alt="Media item cover",
        )
        .media-line-item__play(
          v-if="item.type === 'video'",
        )
          transition(:duration="200", name="fade", mode="out-in")
            .media-line-item__play-item
              play-icon(white)

      button.media-line-item__tools(@click="toolsHandler", ref="dots")
        .media-line-item__tools-item
        .media-line-item__tools-item
        .media-line-item__tools-item

      tools-menu(
        ref="menuBox",
        :isVisible="isToolsMenuVisible",
        :isCopyDisabled="item.type === 'video'",
        @close="closeToolsMenu",
        @forward="forwardHandler",
        @delete="deleteHandler",
        @share="shareHandler",
        @save="saveHandler",
        @reply="replyHandler",
        @copy="copyHandler",
      )

    transition(:duration="200" name="fade" mode="in-out")
      label.media-line-item__checkbox(v-if="isSelectMode")
        transition(:duration="200" name="fade" mode="out-in")
          checked-icon.media-line-item__checkbox-icon(v-if="isItemSelected")
</template>

<script src="./MediaLineItem.ts" lang="ts"></script>

<style src="./media-line-item.styl" scoped lang="stylus"></style>
