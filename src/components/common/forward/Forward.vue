<template lang="pug">
  .forward-container(:class="{'padded': type === 'message'}")
    .forward-container__backplate(@click="closeHandler")
    search-bar(
      :areAllContactsChosen="chosenContacts.length === contacts.length",
      @select-all-contacts="selectAllContactsHandler",
      @search-string-update="updateSearchString",
    )
    contacts-list(
      :searchString="searchString",
      :chosenContacts="chosenContacts",
      @contact-choose="contactChooseHandler",
    )
    input-field(
      @send="sendHandler",
      @close="closeHandler",
      :isAnyContactSelected="!!chosenContacts.length",
    )
</template>

<script src="./Forward.ts" lang="ts"></script>

<style src="./forward.styl" scoped lang="stylus"></style>
