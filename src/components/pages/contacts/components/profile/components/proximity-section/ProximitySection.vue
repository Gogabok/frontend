<template lang="pug">
  .user-profile__section.proximity-section
    profile-item.user-profile__section__item(
      :label="contactsStateLabel",
      @on-click="toggleContactState",
    )
      delete-contact-icon(v-if="isContact", slot="icon")
      add-contact-icon(v-else, slot="icon")

    profile-item.user-profile__section__item(
      v-if="isContact",
      :label="favoriteStateLabel",
      @on-click="toggleFavoriteState",
      :class="{'favorite' : profileOwner.isFavorite}",
    )
      star-icon.star(slot="icon")
</template>

<script src="./ProximitySection.ts" lang="ts"></script>

<style src="./proximity-section.styl" lang="stylus"></style>
