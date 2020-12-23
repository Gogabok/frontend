<template lang="pug">
  .attachment-preview(
    :class="{'attachment-preview--document': attachment.type === 'doc'}",
  )
    img.attachment-preview--image(
      :src="attachment.src",
      alt="Attachment",
      v-if="attachment.type === 'image'",
    )

    video-preview.attachment-preview--video(
      v-else-if="attachment.type === 'video'",
      :videoSrc="attachment.src",
    )

    .attachment-preview__header(v-else)
      attach-icon.attachment-preview__header__icon
      span.attachment-preview__header__name
        | {{attachment.name}}.{{attachment.extension}}


    div.attachment-preview__footer(
      :class="{'document': attachment.type === 'doc'}",
    )
      span.attachment-preview__footer__name(v-if="attachment.type === 'doc'")
        | {{formatSize(attachment)}} | .{{attachment.extension}}
      span.attachment-preview__footer__name(v-else)
        | {{attachment.name}}.{{attachment.extension}}

      button.attachment-preview__footer__delete-button(
        @click="deleteAttachment",
      )
        delete-icon.attachment-preview__footer__delete-button__icon(
          :white="attachment.type !== 'doc'",
        )
</template>

<script src="./Attachment.ts" lang="ts"></script>

<style src="./attachment.styl" lang="styl" scoped></style>
