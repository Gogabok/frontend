<template lang="pug">
  .preview-container__controls
    .preview-container__buttons-wrapper
      button.preview-container__controls-close(
        @click="close",
        :class="{'active': areIconsActive}",
      )
        plus-icon(:class="{'active': areIconsActive}")

      button.preview-container__controls-forward(
        @click="forward",
        :disabled="isMediaLineMode && !areIconsActive",
        :class="{'active': areIconsActive}",
      )
        forward-icon(:class="{'active': areIconsActive}")

      button.preview-container__controls-btn(
        v-if="isShareAPISupported",
        @click="share",
        :disabled="isMediaLineMode && !areIconsActive",
        :class="{'active': areIconsActive}",
      )
        share-icon(:class="{'active': areIconsActive}")

      button(
        @click="save",
        :disabled="isMediaLineMode && !areIconsActive",
        :class="{'active': areIconsActive}",
      )
        save-icon(:class="{'active': areIconsActive}")

      button(
        @click="del",
        :disabled="isMediaLineMode && !areIconsActive",
        :class="{'active': areIconsActive}",
      )
        delete-icon(:class="{'active': areIconsActive}")
</template>

<script src="./ControlsPanel.ts" lang="ts"></script>

<style src="./controls-panel.styl" lang="styl" scoped></style>
