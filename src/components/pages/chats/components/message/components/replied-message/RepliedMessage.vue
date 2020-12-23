<template lang="pug">
  .message__container-replied-box(
    :class="{'toCurrentUser': isRepliedToClientMessage}",
    @click="scrollTo",
  )
    .replied__container
      img.replied__image(
        v-if="imageInfo.visible",
        :src="imageInfo.link",
        alt="",
      )
      .replied__box
        p.replied__text {{label}}
</template>

<script src="./RepliedMessage.ts" lang="ts"></script>

<style src="./replied-message.styl" lang="stylus"></style>
