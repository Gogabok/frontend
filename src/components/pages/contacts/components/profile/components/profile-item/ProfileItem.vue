<template lang="pug">
  .profile-item(@click="clickHandler")
    .profile-item__icon
      slot(name='icon')

    span.profile-item__text {{label}}
</template>

<script src="./ProfileItem.ts" lang="ts"></script>

<style src="./profile-item.styl" lang="styl"></style>
