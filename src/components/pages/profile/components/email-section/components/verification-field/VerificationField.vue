<template lang="pug">
  .email-verification
    p.email-verification__message
      template(v-if="!isResent")
        | На указанный вами E-mail отправлен проверочный код. Пожалуйста, введите проверочный код в поле ниже.
      template(v-else)
        | На указанный вами E-mail еще раз отправлен проверочный код. Пожалуйста, введите проверочный код в поле ниже.

    label.profile-settings__section__editable-input-wrapper
      input.profile-settings__section__editable-input(
        v-model="code",
        type="text",
        placeholder="Security code",
        @keydown.enter="verifyMail",
      )
      .profile-settings__section__editable-input__icon
        transition(name="fade", mode="out-in")
          accept-icon.accept(v-if="!isLoading && isSucceeded")
          loading-icon.accept(v-if="isLoading")



    p.email-verification__error(v-if="error") {{error}}

    button.email-verification__resend-button(@click="reSendCode")
      | Отправить еще раз
</template>

<script src="./VerificationField.ts" lang="ts"></script>

<style src="./verification-field.styl" lang="stylus" scoped></style>
