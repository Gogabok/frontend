<template lang="pug">
  .user-profile__section.member-section
    profile-item(
      :class="{'expanded': isExpanded}",
      label="Members list",
      @on-click="() => setExpandedState(!isExpanded)",
    )
      members-list-icon(slot="icon")

    .member-section__members-list(v-if="isExpanded")
      member-item(
        v-for="(person, index) in participants",
        :key="index",
        :userId="person",
        :isSelf="currentAppUserData.id === person",
        @open-tools-menu="() => openToolsMenu(person)",
      )
    profile-item(
      label="Add members",
      @on-click="addMembers",
    )
      add-member-icon(slot="icon")
</template>

<script src="./MembersSection.ts" lang="ts"></script>

<style src="./member-section.styl" lang="stylus" scoped></style>
