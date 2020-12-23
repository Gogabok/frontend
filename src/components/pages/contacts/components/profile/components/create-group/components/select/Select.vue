<template lang="pug">
  .create-group__select
    .create-group__select__backlayer
    .create-group__select__content
      search-bar(
        :areAllContactsChosen="areAllContactsSelected",
        @search-string-update="updateSearchString",
      )
      contacts-list(
        :contacts="contacts",
        :searchString="searchString",
        :chosenContacts="selectedContacts",
        @contact-choose="contactChooseHandler",
      )
      .create-group__select__footer
        button.close(@click="close")
          plus-icon
        button.confirm(
          @click="createChat",
          :disabled="selectedContacts.length < 2",
          :class="{'active': selectedContacts.length >= 2}",
        )
          | Confirm
</template>

<script src="./Select.ts" lang="ts"></script>

<style src="./select.styl" lang="stylus"></style>
