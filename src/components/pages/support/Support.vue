<template lang="pug">
  .profile-page.support-page

    .support__header
      p.support__header-title Report a problem
      .support__arrow.support__arrow-transform
        report-problem

    .support__body
      form.support__body-form(@submit.prevent="submitProblem")
        .support__body-box
          textarea.support__body-input.support__body-textarea(
            v-model="problemText",
            placeholder="Please, describe a problem...",
            :style="{\
              'min-height': `${containerWidth / (isMobileMode ? 1 : 3)}px`,\
            }",
          )
        .support__body-preview(ref="previewContainer")

          support-preview(
            v-if="previewsGallery.length",
            v-for="(preview, index) in previewsGallery",
            :key="preview.id",
            :preview="preview",
            @delete-preview-item="deleteAttachmentItem",
          )

          .support__body-preview-input(
            ref="attachmentDrag",
            :style="{\
              width: isMobileMode ? '100%' : `calc(100% - (33.33% * ${previewsGallery.length % 3}))`,\
            }",
            :class="{\
              'support__body-preview-input-margin': previewsGallery.length,\
            }",
          )
            input.support__body-attachment-input(
              multiple,
              @change="handleDrop",
              ref="attachInput",
              type="file",
              accept="image/*, video/*, audio/*, .pdf, .txt",
            )
            .support__body-attachment(
              @click="handleAttachment",
              :class="{'support__body-attachment-fullheight': previewsGallery.length % 3}",
              :style="{\
                height: `${containerWidth / (isMobileMode ? 1 : 3)}px`,\
              }",
            )
              span.support__body-attachment-text(v-if="!previewsGallery.length")
                | You would help us a lot if you attached screenshots or other files.
              span.support__body-attachment-plus
                plus-icon
        .support__body-box
          button.support__body-btn(type="submit")
            | Send

</template>

<script src="./Support.ts" lang="ts"></script>

<style scoped src="./support.styl" lang="stylus"></style>
