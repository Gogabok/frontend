<template lang="pug">
  transition(name="fade", mode="out-in")
    .attachments-preview(v-if="previewsGallery.length")
      .attachments-preview-container
        attachment(
          v-for="(attachment, index) in previewsGallery",
          :attachment="attachment",
          :key="index",
          @delete="() => deletePreviewItem(index)",
        )
</template>

<script src="./AttachmentsPreview.ts" lang="ts"></script>

<style src="./attachments-preview.styl" scoped lang="styl"></style>
