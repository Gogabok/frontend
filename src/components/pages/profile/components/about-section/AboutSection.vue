<template lang="pug">
  .profile-settings__section.about-section
    .profile-settings__section__editable-input-wrapper
      textarea.profile-settings__section__editable-input(
        ref="aboutInput",
        v-model="localAbout",
        type="text",
        placeholder="About...",
        rows="1",

        @input="handleResize($event, 200)",
        @keydown.ctrl.enter="input.blur",
        @blur="save",
        @focus="edit",
      )
      .profile-settings__section__editable-input__icon
        transition(name="fade", mode="out-in")
          loading-icon.accept(v-if="isLoading")
          accept-icon.accept(v-else-if="isSucceeded")
          pencil-icon(v-else-if="!isEditMode")

    .profile-settings__section__errors(v-if="localAbout.length > 300")
      span.profile-settings__section__error
        | About can't be longer than 300 characters.
</template>

<script src="./AboutSection.ts" lang="ts"></script>

<style src="./about-section.styl" lang="stylus" scoped></style>
