<template lang="pug">
  .app-bottom-menu(
    :class="{\
      'hidden': !isVisible,\
      'clamped': isForceMobileMode,\
    }",
    id="bottomMenu",
    ref="itemsList",
  )
    button.item.menu(
      :class="{'menu-active': isMenuOpen}",
      @click="menuClickHandler",
      data-content="Menu",
    )
      menu-icon
      span Menu
    router-link.item(
      to="/contacts",
      tag="a",
      data-content="Contacts",
      :class="{'menu-active': $route.path.includes('contacts')}",
    )
      contact-icon
      span Contacts
    router-link.item(
      to="/chats"
      tag="a",
      data-content="Chats",
      :class="{'menu-active': $route.path.includes('chats')}",
    )
      chats-icon
      span Chats
    .item.help(data-content="Share", @click="() => $emit('toggle-share')")
      share-icon
      span Share
</template>

<script lang="ts" src="./BottomMenu.ts"></script>

<style lang="stylus" src="./bottom-menu.styl"></style>
