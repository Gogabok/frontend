<template lang="pug">
  .avatar-editor
    vue-cropper.avatar-editor__cropper(
      ref="cropper",
      :aspect-ratio="1 / 1",
      :src="imageSrc",
      drag-mode="move",
      :crop-box-movable="false",
      :crop-box-resizable="false",
      :view-mode="0",
      preview=".preview",
      :class="{'hidden' : !imageSrc.length}",
    )

    .avatar-editor__controls
      button.avatar-editor__controls__button.close(@click="close")
        plus-icon
      button.avatar-editor__controls__button.zoom.zoom-in(@click="zoom(0.2)")
        zoom-in-icon
      button.avatar-editor__controls__button.rotate(@click="rotate(90)")
        rotate-icon
      button.avatar-editor__controls__button.zoom.zoom-out(@click="zoom(-0.2)")
        zoom-out-icon

      button.avatar-editor__controls__button.accept(@click="acceptCrop")
        accept-icon
</template>

<script src="./AvatarEditor.ts" lang="ts"></script>

<style src="./avatar-editor.styl" lang="stylus"></style>
