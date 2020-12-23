<template lang="pug">
  .media-player-container
    transition(name="fade", mode="out-in")
      video-player-header(
        v-if="isInterfaceVisible",
        :isSelectMode="isSelectMode",
        :isMediaLineMode="isMediaLineMode",
        :isInterfaceVisible="isInterfaceVisible || isMediaLineMode",
        :isAllMessagesChecked="gallery.length === selectedMedia.length",
        :activeSlideIndex="activeSlideIndex",
        @set-select-mode="setSelectMode",
        @set-media-line-mode="setMediaLineMode",
        @close="headerCloseHandler",
        @check-all="checkAllMediaHandler",
      )

    transition(name="fade", mode="in-out" :duration="100")
      media-line(
        v-if="isMediaLineMode",
        :isSelectMode="isSelectMode",
        :activeSlideIndex="activeSlideIndex",
        :selectedMedia="selectedMedia",
        :gallery="gallery",
        @select-media="selectMediaHandler",
        @forward="forwardMedia"
      )
      slider(
        v-else
        ref="slider",
        :isInterfaceVisible="isInterfaceVisible",
        :activeSlideIndex="activeSlideIndex",
        :startIndex="activeSlideIndex",
        :gallery="gallery",
        @close="closeVideoPlayer"
        @set-interface="setInterfaceHandler",
        @slide-change="handleSlideChange",
      )

    transition(name="fade")
      controls-panel(
        v-if="isControlsPanelVisible"
        :areIconsActive="isSelectMode && selectedMedia.length > 0",
        :isMediaLineMode="isMediaLineMode",
        @forward="forwardHandler",
        @save="controlsSaveHandler",
        @del="controlsDeleteHandler",
        @share="controlsShareHandler",
        @close="closeVideoPlayer",
      )
</template>

<script src="./MediaPlayer.ts" lang="ts"></script>

<style src="./media-player.styl" lang="stylus" scoped></style>
