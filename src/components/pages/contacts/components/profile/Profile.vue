<template lang="pug">
  .user-profile(
    :class="{\
      'scrolled': isScrolled,\
      'chat': $route.path.includes('chats'),\
    }",
  )
    template(v-if="profileOwner")
      header-bar(
        :profileOwner="profileOwner",
        :isContact="isContact",
        :addFileToGallery="addFileToGallery",
        @close="closeHandler",
        @call="callHandler",
        @message="writeMessage",
      )
      avatar-slider(
        :profileOwner="profileOwner",
        :isMobileMode="isMobileMode",
        @update-avatar="updateAvatar",
      )
      name-information(
        :profileOwner="profileOwner",
        :changeName="changeContactNameAction",
        :isContact="isContact",
        :type="profileOwner.type",
      )
      contact-information(:profileOwner="profileOwner")
      call-section(
        :profileOwner="profileOwner",
        @call="callHandler",
        @message="writeMessage",
      )
      members-section(
        v-if="profileOwner.type === 'group'",
        :chat="profileOwner",
        @add-members="addMembers",
      )
      proximity-section(
        :profileOwner="profileOwner",
        :isContact="isContact",
        @toggle-contact-state="toggleContactState",
        @toggle-favorite-state="toggleFavoriteState",
      )
      create-group(
        v-if="profileOwner.type === 'person'",
        :profileOwner="profileOwner",
        @create-group="createGroup",
      )
      limitations(
        :profileOwner="profileOwner",
        :type="profileOwner.type",
        @block="blockUser",
        @mute="muteUser",
        @unmute="unmuteUser",
      )
      media-player(
        v-if="gallery.length",
        :gallery="gallery",
        :idOnOpen="gallery[openIndex].id",
        :closeVideoPlayer="closeMediaPlayer",
      )
</template>

<script src="./Profile.ts" lang="ts"></script>

<style src="./profile.styl" lang="stylus" scoped></style>
