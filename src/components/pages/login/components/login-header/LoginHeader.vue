<template lang="pug">
  .login__header
    .new-contacts__arrow(@click="goBack")
      angle-icon
      span Back
    p.login__header-title
      span Log In
</template>

<script src="./LoginHeader.ts" lang="ts"></script>

<style scoped src="./login-header.styl" lang="stylus"></style>
