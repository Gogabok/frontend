<template lang="pug">
  .notification__list
    transition-group(name="fade-down")
      .notification__container(v-for="item in notifications", :key="item.id")
        notification-component(:notificationInfo="item")
</template>

<script lang="ts" src="./NotificationsList.ts"></script>

<style src="./notifications-list.styl" lang="stylus"></style>
