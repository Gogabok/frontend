<template lang="pug">
  .welcome-page.password-page
    .password__container

      password-header(
        :pageTitle="pageTitle",
        :isArrowVisible="isArrowVisible",
      )

    .password__body
      .password__body-column(:class="{'login__body-column-text': pageType === 'recovery'}")
        p.password__body-subtitle(v-if="pageType === 'recovery'")
          | For security reasons, when recovering access to your account, please, change your password.
        p.password__body-subtext
          | Пароль должен содержать не менее 8 символов и, как минимум, 1 заглавную букву и 1 цифру

        recovery-form(v-if="pageType === 'recovery'")
        set-password-form(v-else-if="pageType === 'set-password'")
        change-password-form(v-else-if="pageType === 'new-password'")
</template>

<script src="./NewPassword.ts" lang="ts"></script>

<style scoped src="./new-password.styl" lang="stylus"></style>
