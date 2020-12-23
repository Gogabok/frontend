<template lang="pug">
  .create-group__select
    .create-group__select__backlayer
    .create-group__select__content
      search-bar(
        :areAllContactsChosen="areAllContactsSelected",
        @search-string-update="updateSearchString",
        @select-all-contacts="selectAllContacts",
      )
      contacts-list(
        :contacts="contacts",
        :searchString="searchString",
        :chosenContacts="selectedContacts",
        :participants="participants",
        @contact-choose="contactChooseHandler",
      )
      .create-group__select__footer
        button.close(@click="close")
          plus-icon
        button.confirm(
          @click="createChat",
          :disabled="!selectedContacts.length",
          :class="{'active': !!selectedContacts.length}",
        )
          | Confirm
</template>

<script src="./Select.ts" lang="ts"></script>

<style src="./select.styl" lang="stylus"></style>
