<template lang="pug">
  .forward-container__users-list
    div.forward-container__users-list__letter-group(
      v-for="letter in alphabetArray",
      :key="letter",
      v-if="sortedUsers[letter]",
    )
      span.forward-container__users-list__letter-group__letter
        | {{letter}}

      .user-select(
        v-for="(user, index) in sortedUsers[letter]",
        @mousedown.prevent.stop
        @click.stop.prevent="handleUsersClick(user)",
        :class="{'user-select-selected' : selectedUsers.includes(user)}",
        :key="index",
      )
        .user-preview
          .user-preview__avatar(
            :style="`\
              background-image: url('${getAvatar(user)}');\
              background-size: cover;\
              background-position: center center;\
              ${!user.avatarPath && 'background-size: 100% 100%'}\
            `",
          )

          .user-preview__description
            .user-preview__title {{ user.name || user.num }}

        label.users__list-check.users__list-check-box
          span.users__list-check-border
          transition(:duration="200", name="fade", mode="out-in")
            checked-icon.users__list-check-icon(v-if="selectedUsers.includes(user)")
</template>

<script src="./UsersList.ts" lang="ts"></script>

<style src="./users-list.styl" lang="stylus" scoped></style>
