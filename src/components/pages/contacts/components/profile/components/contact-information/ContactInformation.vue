<template lang="pug">
  .user-profile__section.contact-information
    .contact-information__item
      h4.contact-information__label
        | GapopaID
      button.contact-information__data(@click="() => copy(profileOwner.num)")
        span.contact-information__data__value
          | &{{formatUserNum(profileOwner.num)}}
        copy-icon.contact-information__data__icon
</template>

<script src="./ContactInformation.ts" lang="ts"></script>

<style src="./contact-information.styl" lang="stylus" scoped></style>
