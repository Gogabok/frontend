<template lang="pug">
  .verified-email
    .profile-settings__section__editable-input-wrapper
      span.profile-settings__section__editable-input
        | {{email.value}}

      button.verified-email__icon.delete(@click="deleteEmail")
        plus-icon
</template>

<script src="./VerifiedEmail.ts" lang="ts"></script>

<style src="./verified-email.styl" lang="stylus" scoped></style>
