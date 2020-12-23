<template lang="pug">
  .contacts-page__dialogs(v-if="!!activeChat")
    .vue-bar-container
      .chat-window(ref="chatWindow")
        dialog-header(
          v-if="activeChat",
          :activeChat="activeChat",
          :isMobileMode="isMobileMode",
          :isSelectMode="isSelectMode",
          :selectedMessagesAmount="selectedMessages.length",
          :isAllMessagesSelected="isAllMessagesSelected",
          :pageType="activeChat.type",
          @go-back="$emit('go-back')",
          @cancel-select="() => setSelectMode(false)",
          @select-all="selectAllMessagesHandler",
          @open-profile="openProfile",
        )
        .dialog-container(ref="messagesContainer")
          transaction-message(
            v-if="activeChat && activeChat.isPayedMessages",
            :isPayedDialog="true",
            :messageCost="cost",
            :messageText="textToTranslate",
            :messageSubText="translatedText",
          )

          template(v-if="activeChat && activeChat.dialogs")
            dialog-content(
              v-for="(dialog, index) in activeChat.dialogs",
              :key="index",
              :dialog="dialog",
              :selectedMessages="selectedMessages",
              :isSelectMode="isSelectMode",
              :isLoadMessagesBorderReached="isMessagesLoader !== null ? isLoadMessagesBorderReached : false"
              @reply="$emit('set-replied-message', $event)"
              @open-video-player="openVideoPlayer",
              @select-message="selectMessage",
              @set-select-type="selectType = $event",
              @forward-image="imageForwardHandler",
              @set-messages-loading="showMessagesLoader"
            )

          transaction-message(
            :isPayedDialog="isPayedDialog",
            :messageCost="`1,11`",
            :messageText="`Sending message with translation from English to Russian.`",
          )

          transition(name="fade", mode="in-out")
            media-player(
              v-if="isMediaPlayerVisible\
                    && activeChat\
                    && activeChat.attachments.length",
              ref="player",

              :gallery="mediaPlayerGallery",
              :isPlayedVideoPlayer="false",
              :closeVideoPlayer="closeVideoPlayer",
              :idOnOpen="mediaPlayerIdOnOpen",

              @forward="forwardHandler",
            )

        scroll-bottom-button(
          v-if="isScrollBottomButtonVissible"
          @click="smoothlyScrollToEndForTime(0)"
        )
        transition(name="fade", mode="in-out")
          message-loader(
            v-show="isMessagesLoader === true || isMessagesLoader === null"
          )

      contacts-input-field(
        :isCameraOpen="isCameraOpen",
        :selectedMessages="selectedMessages",
        :isSelectMode="isSelectMode",
        :selectType="selectType",
        :chosenContacts="chosenContacts"
        @open-camera="openCamera",
        @send-message="sendMessage",
        @ttm="transactionHandler",
        @cancel-select="() => setSelectMode(false)",
        @forward="forwardHandler",
        @delete="deleteHandler",
      )

      transition(name="fade", mode="in-out")
        camera-interface.contacts__camera(
          v-if ="isCameraOpen",
          @send-message="sendMessage",
          @close="closeCamera",
        )

      transition(name="profile-transition")
        profile.profile(v-if="$route.query.profile")
</template>

<script src="./ChatWindow.ts" lang="ts"></script>

<style src="./chat-window.styl" lang="stylus"></style>
