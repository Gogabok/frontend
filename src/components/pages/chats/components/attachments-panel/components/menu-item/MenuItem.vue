<template lang="pug">
  .item(
    @click.stop="clickHandler",
    :class="{'no-close': noclose !== undefined && noclose !== false}",
  )
    .item__icon(
      :class="{'no-close': noclose !== undefined && noclose !== false}",
    )
      slot(name='icon')

    span.item__text(
      :class="{'no-close': noclose !== undefined && noclose !== false}",
    )
      | {{text}}

    .item__arrow(
      :class="{'no-close': noclose !== undefined && noclose !== false}",
    )
      angle
</template>

<script src="./MenuItem.ts" lang="ts"></script>

<style src="./menu-item.styl" lang="stylus"></style>
