<template lang="pug">
  .main-container(
    ref='app',
    :class="{'is-mobile': isMobileMode}",
  )
    .app-wrap
      #page-wrap.wrap
        .wrap__body(
          :class="{'active-menu': isMenuOpen}",
          v-touch:start="movementHandlerStart",
        )
          left-side-menu(ref="menu", @close="closeMenu")

          .right-side
            .content
              router-view(ref="currentPage")

        bottom-menu(
          :isMenuOpen="isMenuOpen",
          :isVisible="isBottomMenuVisible",
          @toggle-menu="toggleMenu",
          @toggle-share="toggleShareVisibility",
        )

        transition(name="fade" mode="in-out")
          call(v-if="hasOngoingCall")

        transition(name="fade" mode="out-in")
          incoming-call(v-if="hasIncomingCall")

    notifications-list

    transition(name="fade", mode="out-in")
      share-container(v-if="isShareVisible", @close-share="() => setShareVisibility(false)")

    .popup-list(v-if="popups.length")
      transition-group(name="fade-in", mode="out-in")
        .popup-list-item(v-for="popup in popups", :key="popup.id")
          text-alert(
            v-if="popup.settings.type === popupType.Alert",
            :popup="popup",
          )
          confirm-component(
            v-if="popup.settings.type === popupType.Confirm",
            :popup="popup",
          )
          contacts-list-popup(
            v-if="popup.settings.type === popupType.Contacts",
            :popup="popup",
          )
</template>

<script lang="ts" src="./App.ts"></script>

<style lang="stylus" src="./app.styl"></style>
<style lang="stylus" src="./app-mobile.styl"></style>
