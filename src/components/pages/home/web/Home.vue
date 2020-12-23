<template lang="pug">
  .welcome-page
    .top
      h1
        | Universal Messenger test
        br
        span by Gapopa
    .middle
       img(draggable='false', src='~assets/img/gapopa-img.svg', alt='')
    .bottom
      .welcome-page__links
        a.link(href='#', data-content='Get GapopaID')
          .link__icon
            get-id-icon
          span New Gapopa ID
        a.link(href='#', data-content='Add contact')
          .link__icon
            add-contact-icon
          span Add contact
        a.link(href='#', data-content='Log in')
          .link__icon
            login-icon
          span Log in
      .welcome-page__subtitle
        | No registration required
</template>

<script lang="ts" src="./Home.ts"></script>

<style lang="stylus" src="./home.styl" scoped></style>
