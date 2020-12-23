<template lang="pug">
  .share-item
    button.share-item__header(@click="() => setIsExpanded(!isExpanded)")
      h4.share-item__label {{label}}
      angle-icon.share-item__angle-icon(:class="{'rotated': isExpanded}")
    span.share-item__description(:class="{ 'expanded': isExpanded }")
      | {{description}}
    button.share-item__data-wrapper(@click="copyInput")
      span.share-item__data {{data}}
      copy-icon.share-item__icon
</template>

<script lang="ts" src="./ShareItem.ts"></script>

<style src="./share-item.styl" scoped lang="stylus"></style>
