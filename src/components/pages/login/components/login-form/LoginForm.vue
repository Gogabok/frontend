<template lang="pug">
  .login__body-item
    form.login__body-box(@submit.prevent="next")
      input.login__body-input(
        v-model="loginValue",
        type="text",
        placeholder="GapopaID, Login, E-mail or Phone number",
      )

    transition(:duration="200", name="fade", mode="out-in")
      .login__body-errors-wrapper(v-if="errors.login.length")
        span.login__body-error(v-for="error in errors.login")
          | {{error}}
    form.login__body-box(@submit.prevent="next", v-if="isLoginVerified")
      input.login__body-input(
        v-model="passwordValue",
        type="password",
        ref="passwordInput",
        placeholder="Password",
      )

    transition(:duration="200", name="fade", mode="out-in")
      .login__body-errors-wrapper(v-if="errors.password.length")
        span.login__body-error(v-for="error in errors.password")
          | {{error}}
    span.login__body-btn(@click="next") Next
</template>

<script src="./LoginForm.ts" lang="ts"></script>

<style scoped src="./login-form.styl" lang="stylus"></style>
