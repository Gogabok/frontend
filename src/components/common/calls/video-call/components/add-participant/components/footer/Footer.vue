<template lang="pug">
  .footer
    button.footer__close(@click="close", @mousedown.prevent.stop)
      plus-icon
    button.footer__confirm(@click="confirm", @mousedown.prevent.stop)
      | Confirm
</template>

<script src="./Footer.ts" lang="ts"></script>

<style src="./footer.styl" lang="stylus" scoped></style>
