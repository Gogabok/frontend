<template lang="pug">
  button.action
    component.action__icon(:is="icon")
    h3.action__name {{name}}
    angle-icon.angle-icon
</template>

<script src="./Action.ts" lang="ts"></script>

<style src="./action.styl" lang="stylus"></style>
