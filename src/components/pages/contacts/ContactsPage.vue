<template lang="pug">
  .contacts-page(v-touch:start="startHandler")
    .contacts-page__container
      contacts-menu(
        ref="contactMenu",
        :items="contacts",
        @set-favorite="setContactsFavorite",
        @set-target-favorite="setContactFavoriteState"
        @delete-favorite="deleteContactsFavorite",
        @create-group="createGroupChat",
        @delete="deleteContacts",
      )

      transition(name="slide")
        profile(v-if="$route.query && $route.query.id && $route.query.id !== currentUserInfo.id")
        .empty-profile(v-else)
          span Пожалуйста, выберите Контакт
</template>

<script src="./ContactsPage.ts" lang="ts"></script>

<style src="./contacts-page.styl" lang="stylus" scoped></style>
