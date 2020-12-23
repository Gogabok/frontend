<template lang="pug">
  .status(@click="select")
    .status__information
      span.status__title {{statusLabel}}
      span.status__description(v-if="status.description") {{status.description}}
    button.status__delete-button(
      v-if="isCustom",
      @click.stop="deleteStatus",
    )
      plus-icon
</template>

<script src="./StatusOption.ts" lang="ts"></script>

<style src="./status-option.styl" lang="ts"></style>
