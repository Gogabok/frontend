<template lang="pug">
  .message__container-group(
    :class="{'message__container-group-text': message.message}"
  )
    .message__container-group-item(
      v-for="(media, index) in message.mediaGroup",
      :key="index",
      v-if="index < 4",
    )
      .message__container-group-count(
        v-if="message.mediaGroup.length > 4 && index === 3",
        @click="openFile(media.id)",
      )
        | +{{message.mediaGroup.length - 3}}
      .message__container-group-image(
        @click="openFile(media.id)",
        v-else,
        :style="`background-image: url(${media.poster})`",
      )

</template>

<script src="./MediaGroup.ts" lang="ts"></script>

<style src="./media-group.styl" lang="stylus"></style>
