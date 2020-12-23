<template lang="pug">
  .media-player__media-line
    list-item(
      v-for="(item, index) in gallery",
      :key="index",
      :mediaIndex="Number(index)",
      :item="item",
      :isSelectMode="isSelectMode",
      :isItemSelected="selectedMedia.includes(item)",
      :data-index="index",
      @disable-scroll="disableScroll",
      @enable-scroll="enableScroll",
    )
</template>

<script src="./MediaLine.ts" lang="ts"></script>

<style src="./media-line.styl" scoped lang="stylus"></style>
