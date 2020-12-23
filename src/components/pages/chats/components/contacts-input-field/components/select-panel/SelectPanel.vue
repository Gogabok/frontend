<template lang="pug">
  .contacts__input-selecting
    .contacts__input-selecting-container
      button.contacts__input-selecting-icon.contacts__input-selecting-icon-close(
        @click="closeHandler"
      )
        plus-icon

      button.contacts__input-selecting-icon(
        :class="{'active-icon':isAnyMessageSelected}"
        @click.stop="actionButtonClickHandler"
      )
        delete-icon(v-if="type === 'delete'")
        forward-icon(v-else-if="type === 'forward'")

    transition(name="fade" mode="out-in")
      div.confirm__delete(v-if="isVisibleDeleteConfirm")
        .confirm__delete-container
          p.confirm__delete-title Delete messages
          p.confirm__delete-text An unread message is deleted in both your and your correnpondents' dialogues.
          p.confirm__delete-text An incoming and/or read message is deleted in your dialogue only.
</template>

<script src="./SelectPanel.ts" lang="ts"></script>

<style src="./select-panel.styl" lang="stylus" scoped></style>
