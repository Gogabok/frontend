<template lang="pug">
  action(
    :name="isContact ? 'Delete from contacts list' : 'Add to contacts list'",
    :icon="isContact ? DeleteContactIcon : AddContactIcon",
    @click.native="contactAction"
  )
</template>

<script src="./ContactAction.ts"></script>

<style src="./contact-action.styl" lang="stylus"></style>
