<template lang="pug">
  .forward-container
    .forward-container__backplate
    search-bar(
      :areAllUsersChosen="selectedUsers.length === users.length",
      @select-all-contacts="selectAllUsersHandler",
      @search-string-update="updateSearchString",
    )
    users-list(
      :searchString="searchString",
      :selectedUsers="selectedUsers",
      @user-choose="userChooseHandler",
    )
    footer-bar(
      @confirm="sendHandler",
      @close="closeHandler",
      :isAnyUserSelected="!!selectedUsers.length",
    )
</template>

<script src="./AddParticipant.ts" lang="ts"></script>

<style src="./add-participant.styl" scoped lang="stylus"></style>
