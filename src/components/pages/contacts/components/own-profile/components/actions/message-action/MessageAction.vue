<template lang="pug">
  action(
    name="Write a message",
    :icon="MessageIcon",
    @click.native="goToChat",
  )
</template>

<script src="./MessageAction.ts" lang="ts"></script>

<style src="./message-action.styl" lang="styl"></style>
