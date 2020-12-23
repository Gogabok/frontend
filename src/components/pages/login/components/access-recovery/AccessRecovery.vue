<template lang="pug">
  .login__body-item
    p.login__body-title Account access recovery:
    form.login__body-box(@submit.prevent="next")
      input.login__body-input(
        :disabled="hasCodeBeenSent",
        :class="{'login__body-input-cancel':hasCodeBeenSent}",
        v-model="loginValue",
        type="text",
        placeholder="GapopaID, Login, E-mail or Phone number",
      )
      span.login__body-cancel(v-if="hasCodeBeenSent", @click="cancel")
        plus-icon
    p.login__body-subtext(v-if="hasCodeBeenSent")
      | Security code has been sent to your E-mail and/or phone number

      span.mt-2
        | Please, enter security code below
    transition(:duration="200", name="fade", mode="out-in")
      .login__body-errors-wrapper(
        v-if="errors.login.length",
      )
        span.login__body-error(v-for="error in errors.login")
          | {{error}}
    form.login__body-box(
      @submit.prevent="next",
      v-if="hasCodeBeenSent",
    )
      input.login__body-input(
        v-model="codeValue",
        type="text",
        ref="codeInput",
        placeholder="Security code",
      )
    transition(:duration="200", name="fade", mode="out-in")
      .login__body-errors-wrapper(
        v-if="errors.code.length",
      )
        span.login__body-error(v-for="error in errors.code")
          | {{error}}
    span.login__body-btn(@click="next") Next
</template>

<script src="./AccessRecovery.ts" lang="ts"></script>

<style scoped src="./access-recovery.styl" lang="stylus"></style>
