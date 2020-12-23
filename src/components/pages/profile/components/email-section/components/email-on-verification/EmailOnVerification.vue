<template lang="pug">
  .email-on-verification
    valid-email(
      :email="email",
      @delete-email="$emit('delete-email', $event)",
    )
    verification-field(
      :email="email",
      :setEmailVerified="setEmailVerified",
    )
</template>

<script src="./EmailOnVerification.ts" lang="ts"></script>

<style src="./email-on-verification.styl" lang="stylus" scoped></style>
