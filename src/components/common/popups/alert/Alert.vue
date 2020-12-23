<template lang="pug">
  .alert(
    @click="removePopup({ id: popup.id })",
    :style="!isMobileMode && {\
       top: `${popup.settings.position.top}px`,\
       left: `${popup.settings.position.left}px`,\
       right: `${popup.settings.position.right}px`,\
       bottom: `${popup.settings.position.bottom}px`,\
    }"
  )
    .alert__overlay
    .alert__container(
      @mouseover="pauseCounter",
      @mouseout="startCounter",
      v-touch:start="pauseCounter",
      v-touch:end="startCounter",
    )
      span.alert__text {{popup.textMessage}}
</template>

<script src="./Alert.ts" lang="ts"></script>

<style src="./alert.styl" lang="stylus" scoped></style>
