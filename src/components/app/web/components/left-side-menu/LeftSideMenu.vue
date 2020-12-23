<template lang="pug">
  .app-leftside-menu
    contact-preview(
      :status="'is-online'",
      :is-user-contact='true',
      :avatarPath="currentUserData.avatarPath",
      :num="currentUserData.name || `&${currentUserData.num}`",
      :id="currentUserData.id",
    )
    menu-element.app-leftside-menu__elements(
      v-for="(item, index) in menuItems",
      :key="index",
      :link="item.link || ''",
      :title="item.title",
      :disabled="item.disabled",
      @click="buttonClick(item.callback)",
    )
      component(:is="item.icon")
</template>

<script src="./LeftSideMenu.ts" lang="ts"></script>

<style src="./left-side-menu.styl" lang="stylus"></style>
