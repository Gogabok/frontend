<template lang="pug">
  router-link.app-leftside-menu__item(
    :to="link",
    :disabled="disabled !== undefined && disabled !== false",
    tag="a",
    @click.native="$emit('click')",
  )
    .app-leftside-menu__item__icon
      slot
    span.app-leftside-menu__item__text {{title}}
    .app-leftside-menu__item__arrow
      angle-icon
</template>

<script lang="ts" src="./MenuElement.ts"></script>

<style src="./menu-element.styl" lang="stylus"></style>
