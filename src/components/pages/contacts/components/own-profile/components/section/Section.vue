<template lang="pug">
  .section
    button.section__header(@click="toggleExpandedState")
      component.section__icon(:is="icon")
      h3.section__title {{name}}
      .dots-icon
    transition(name="content")
      .section__content(
        :class="{ 'expanded': isExpanded }",
        :style="{ '--max-height': `${maxHeight}px` }",
      )
        .content-wrapper(ref="content")
          slot
</template>

<script src="./Section.ts" lang="ts"></script>

<style src="./section.styl" lang="stylus" scoped></style>
