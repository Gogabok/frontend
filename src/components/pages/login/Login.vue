<template lang="pug">
  .welcome-page.login-page
    .login__container

      login-header

      .login__body
        .login__body-column

          login-form

          .login__body-line

          .login__body-item
            p.login__body-title Login with other resources:
            .login__body-social
              facebook-login

          .login__body-line

          access-recovery
</template>

<script src="./Login.ts" lang="ts"></script>

<style scoped src="./login.styl" lang="stylus"></style>
