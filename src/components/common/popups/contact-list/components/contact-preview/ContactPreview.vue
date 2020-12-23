<template lang="pug">
  .contacts__list-item(
    @click="selectContact",
    :class="{'contacts__list-item-selected' : isSelected}",
  )
    .contact-preview
      .contact-preview__container
        .contact-preview__avatar(:class="contact.status")
          .avatar-icon(
            :style="contact.avatarPath \
                       ? `background-image: url(${contact.avatarPath}); background-size: cover;` \
                       : 'background-image: url(img/default_avatar.svg);'") &nbsp;
        .contact-preview__description
          .contact-preview__title {{ contact.name }}

    label.contacts__list-check.contacts__list-check-box(
      :class="{'contacts__list-check-selected': isSelected}",
    )
      span.contacts__list-check-border
      transition(:duration="200", name="fade", mode="out-in")
        checked-icon.contacts__list-check-icon(v-if="isSelected")
</template>

<script src="./ContactPreview.ts" lang="ts"></script>

<style src="./contact-preview.styl" lang="styl" scoped></style>
