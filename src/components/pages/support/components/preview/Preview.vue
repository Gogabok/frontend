<template lang="pug">
  .support__body-preview-item
    .support__body-preview-media(v-if="preview.type === 'image'")
      img.support__body-preview-image(:src="preview.poster", alt="")
      .support__body-preview-close
        button(@click="() => $emit('delete-preview-item', preview.id)")
          delete-icon.support__body-preview-close-icon.white
    .support__body-preview-media(v-if="preview.type === 'doc'")
      .support__body-preview-file-item
        span.support__body-preview-file-icon
          attach-icon
        span.support__body-preview-file-name {{preview.name}}.{{preview.extension}}
      .support__body-preview-close
        button(@click="() => $emit('delete-preview-item', preview.id)")
          delete-icon.support__body-preview-close-icon.white
    .support__body-preview-media(v-if="preview.type === 'video'")
      video-player.support__body-preview-player(:videoSrc="preview.src")
      .support__body-preview-close
        button(@click="() => $emit('delete-preview-item', preview.id)")
          delete-icon.support__body-preview-close-icon.white
</template>

<script src="./Preview.ts" lang="ts"></script>

<style scoped src="./preview.styl" lang="stylus"></style>
