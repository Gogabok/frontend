<template lang="pug">
  .user-profile__section.create-group
    profile-item(
      label="Add member",
      @on-click="() => setSelectVisibility(true)",
    )
      add-member-icon(slot="icon")

    transition(name="fade")
      contacts-select(
        v-if="isSelectVisible",
        :participants="participants",
        @close="() => setSelectVisibility(false)",
        @add-members="addMembers",
      )
</template>

<script src="./AddMember.ts" lang="ts"></script>
