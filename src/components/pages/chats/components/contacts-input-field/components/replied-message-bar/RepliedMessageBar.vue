<template lang="pug">
  .reply(
    @click="scrollHandler"
    :class="{'reply-speaker': message.isUserMessage}"
  )
    .reply__container
      .reply__message
        .reply__header
          quotes-icon
          p.reply__author {{message.num}}

        .reply__box
          img.reply__image(
            v-if="previewCondition"
            :src="previewLink"
            alt=""
          )
          p.reply__text(v-if="message.message") {{message.message}}

      .reply__close(@click="clearRepliedMessage")
        plus-icon
</template>

<script src="./RepliedMessageBar.ts" lang="ts"></script>

<style scoped src="./replied-message-bar.styl" lang="styl"></style>
