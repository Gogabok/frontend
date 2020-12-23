<template lang="pug">
  .contacts__list-footer
    .contacts__list-footer-close(@click="$emit('reject')")
      plus-icon
    .contacts__list-textarea(ref="inputContainer")
      textarea.contacts__list-textarea-item(
        placeholder="Message...",
        rows="1",
        @input="autoResize($event, 200)",
      )
    .contacts__list-send.contacts__list-send-icon(
      @click="sendHandler",
      :class="{'active': isAnyContactSelected}",
    )
      send-message-icon
</template>

<script src="./Footer.ts" lang="ts"></script>

<style src="./footer.styl" lang="stylus"></style>
