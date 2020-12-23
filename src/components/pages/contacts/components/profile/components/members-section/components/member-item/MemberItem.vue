<template lang="pug">
  button.member-item(v-if="userInformation", @click="openToolsMenu")
    img.member-item__avatar(
      :src="userInformation.avatarPath || require('~assets/img/default_avatar.svg')",
      :class="{'default': !userInformation.avatarPath}",
    )
    span.member-item__name
      | {{userInformation.name || `&${userInformation.num}`}}

    button.member-item__delete(v-if="!isSelf")
      | delete
</template>

<script src="./MemberItem.ts" lang="ts"></script>

<style src="./member-item.styl" lang="stylus" scoped></style>
