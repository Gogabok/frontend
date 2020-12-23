<template lang="pug">
  .contacts-page(
    v-touch:start="startHandler",
    ref="app",
  )
    .contacts-page__container
      chats-menu(
        :items="chatCards",
        @join-call='joinCall',
        @delete='deleteChats',
        @set-favorite='setChatsFavorite',
        @add-to-contact='addChatsToContacts',
        ref="contactMenu",
      )
      chat-window(v-if="$route.query.id")
      .empty-chat(v-else)
        span Пожалуйста, выберите Чат

</template>

<script lang="ts" src="./Chats.ts"></script>

<style lang="stylus" src="./chats.styl"></style>
