<template lang="pug">
  .user-profile__section.create-group
    profile-item(
      label="Create group",
      @on-click="createGroup",
    )
      add-member-icon(slot="icon")

</template>

<script src="./CreateGroup.ts" lang="ts"></script>
