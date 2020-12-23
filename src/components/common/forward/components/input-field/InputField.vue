<template lang="pug">
  .forward-container__input-field
    .search__close(@click="close")
      plus-icon

    .forward-container__input-field__textarea-wrapper(ref="inputContainer")
        textarea.forward-container__input-field__textarea(
          placeholder="Message...",
          rows="1",
          @input="textChangeHandler",
        )

    button.forward-container__input-field__send(
      @click="send",
      :class="{'active': isAnyContactSelected}",
      :disabled="!isAnyContactSelected",
    )
      send-message-icon
</template>

<script src="./InputField.ts" lang="ts"></script>

<style src="./input-field.styl" scoped lang="stylus"></style>
