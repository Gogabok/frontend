<template lang="pug">
  .notification(v-touch:start.stop="movementHandlerStart")
    .notification__box
      .notification__avatar
        .notification__avatar-icon(
          :style="notificationInfo.avatarPath \
                 ? `background-image: url(${notificationInfo.avatarPath}); background-size: cover;` \
                 : 'background-image: url(img/default_avatar.svg);'",
        )
      .notification__text
        p.notification__title {{notificationInfo.num}}
        p.notification__description
          | Test notification text text text text text text text
      button.notification__close(
        v-if="!isMobileMode",
        @click="closeNotification",
      )
        plus-icon
</template>

<script lang="ts" src="./NotificationComponent.ts"></script>

<style src="./notification-component.styl" lang="stylus"></style>
