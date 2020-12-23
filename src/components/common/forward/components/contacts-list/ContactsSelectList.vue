<template lang="pug">
  .forward-container__contacts-list
    div.forward-container__contacts-list__letter-group(
      v-for="letter in alphabetArray",
      :key="letter",
      v-if="sortedContacts[letter]",
    )
      span.forward-container__contacts-list__letter-group__letter
        | {{letter}}

      .contact-select(
        v-for="(contact, index) in sortedContacts[letter]",
        @click="handleContactsClick(contact)",
        :class="{'contact-select-selected' : chosenContacts.includes(contact)}",
        :key="index",
      )
        .contact-preview
          .contact-preview__container
            .contact-preview__avatar(:class="contact.status")
              .avatar-icon(
                :style="`background-image: url(${contact.avatarPath}); background-size: cover;`",
                v-if="contact.avatarPath",
              )
              img.avatar-icon.default(
                v-else,
                src="~assets/img/default_avatar.svg",
              )

            .contact-preview__description
              .contact-preview__title {{ contact.name || contact.num }}

        label.contacts__list-check.contacts__list-check-box
          span.contacts__list-check-border
          transition(:duration="200", name="fade", mode="out-in")
            checked-icon.contacts__list-check-icon(v-if="chosenContacts.includes(contact)")
</template>

<script src="./ContactsSelectList.ts" lang="ts"></script>

<style src="./contacts-select-list.styl" lang="stylus" scoped></style>
