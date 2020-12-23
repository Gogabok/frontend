<template lang="pug">
  .contact-preview(
    :class="{\
      'is-user-contact': isUserContact,\
      'is-active': isActive,\
    }"
  )
    router-link.profile-link(draggable='false', :to='`/contacts?id=${id}`')
    .contact-preview__container
      .contact-preview__avatar(:class='status')
        .avatar-icon(
          :style="`background-image: url(${avatarPath}); background-size: cover;`",
          v-if="avatarPath",
        )
        img.avatar-icon.default(
          v-else,
          src="~assets/img/default_avatar.svg",
        )

      .contact-preview__description
        .contact-preview__title {{ num }}
        .dropdown-container(v-if="isUserContact")
          button.contact-preview__subtitle.dropdown-menu(
            @click='handleDropdown',
            :class="{'active': statusDropdownActive}",
          )
            | {{statusLabel}}
          .dropdown-content
            ul(@click='statusDropdownActive = false')
              li(@click="status = 'is-online'") Online
              li(@click="status = 'is-offline'") Offline
              li(@click="status = 'is-away'") Away
              li(@click="status = 'is-busy'") Do not disturb
              li(@click="status = 'is-live'") Live
        .contact-preview__subtitle(
          v-else,
          @click='handleDropdown',
          :class="{'active': statusDropdownActive}",
        )
          span {{statusLabel}}
      .contact-preview__arrow
        angle-icon
</template>


<script lang="ts" src="./ContactPreview.ts"></script>

<style lang="stylus" src="./contact-preview.styl"></style>
