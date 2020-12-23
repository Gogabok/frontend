<template lang="pug">
  .dialog-item
    .dialog-time
      .dialog-time__item {{dateFormatter(dialog.date)}}
    message(
      v-if="loadedMessages.length > 0"
      v-for="(message, index) in loadedMessages",
      :isLastMessage="checkLastMessage(message, dialog.messages[index + 1])",
      :key="index",
      :message="message",
      :dialog="dialog",
      :index="index",
      :isSelected="selectedMessages.includes(message)",
      :isSelectMode="isSelectMode",
      @reply="replyHandler",
    )
</template>

<script src="./Dialog.ts" lang="ts"></script>

<style src="./dialog.styl" lang="stylus"></style>
