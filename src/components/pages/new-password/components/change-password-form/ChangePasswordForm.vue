<template lang="pug">
  .password__body-item
    form.password__body-box(@submit.prevent="oldPassEnter")
      input.password__body-input(
        ref="oldPassInput",
        v-model="oldPasswordValue",
        type="password",
        name="oldPassword",
        placeholder="Old Password",
      )
    transition(:duration="200", name="fade", mode="out-in")
      .password__body-errors-wrapper(
        v-if="errors.oldPassword.length",
        ref="passwordErrorsContainer",
      )
        span.password__body-error(v-for="error in errors.oldPassword")
          | {{error}}
    form.password__body-box(@submit.prevent="newPassEnter")
      input.password__body-input(
        ref="newPassInput",
        v-model="passwordValue",
        type="password",
        placeholder="New Password",
      )
    transition(:duration="200", name="fade", mode="out-in")
      .password__body-errors-wrapper(
        v-if="errors.newPassword.length",
        ref="passwordErrorsContainer",
      )
        span.password__body-error(v-for="error in errors.newPassword")
          | {{error}}
    form.password__body-box(@submit.prevent="next")
      input.password__body-input(
        ref="repeatPassInput",
        v-model="repeatPasswordValue",
        type="password",
        placeholder="Repeat password",
      )
    transition(:duration="200", name="fade", mode="out-in")
      .password__body-errors-wrapper(
        v-if="errors.repeatPassword.length",
        ref="passwordErrorsContainer",
      )
        span.password__body-error(v-for="error in errors.repeatPassword")
          | {{error}}
    span.password__body-btn(@click="next") Next
</template>

<script src="./ChangePasswordForm.ts" lang="ts"></script>

<style scoped src="./change-password-form.styl" lang="stylus"></style>
