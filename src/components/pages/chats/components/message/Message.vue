<template lang="pug">
  .message.clearfix(
    :class="[\
       {'is-user-message': message.isUserMessage},\
       {'is-speaker-message' : !message.isUserMessage},\
       {'message-last': isLastMessage},\
     ]",
    :data-message-id="message.id",
    v-touch:start="touchStartHandler",
    v-touch:touchhold="messageHold",
    @click="messageClick",
  )

    div.message__back(
      :class="{'selected': isSelected}"
    )

    transition(
      :duration="200",
      name="fade",
      mode="in-out",
    )
      label.message__checkbox(
        v-if="isSelectMode"
      )
        input(
          type="checkbox",
          style="visibility: hidden; width: 0px; height: 0px; opacity: 0",
          @input.stop="selectMessage",
        )
        span.message__checkbox-border
        transition(:duration="200", name="fade", mode="out-in")
          checked-icon.message__checkbox-icon(v-if="isSelected")


    .message__wrapper(
      ref="messageWrapper",
      :class="{'select-mode': isSelectMode}"
    )
      transition(name="fade", mode="in-out")
        .message__container-control-reply(v-if="movingMessage")
          forward-icon

      tools-menu(
        ref="menuBox",
        :isVisible="isToolsMenuVisible",
        :position="toolsMenuPosition",
        :isMobileMode="isMobileMode",
        :hasAttachments="!!(message.attachment && message.attachment.src)",
        :hasMessageText="!!message.message",

        @close="closeToolsMenu",
        @reply="reply",
        @copy="copy",
        @translate="translate",
        @download="download",
        @forward="forward",
        @share="share",
        @delete="del",
      )

      .message__container(
        :class="[ {'message__container-contact': message.contacts && message.contacts.length && !message.message},\
                  {'message__container-map': message.location},\
                  {'message__container-image': message.attachment && message.attachment.type === 'image' && !message.message},\
                  {'message__container-image-with-text': message.attachment && message.attachment.type === 'image' && message.message},\
                  {'message__container-file': message.attachment && !message.message},\
                  {'message__container-video': message.attachment && message.attachment.type == 'video'},\
                  {'message__container-video-text': message.attachment && message.attachment.type == 'video' && message.message && message.message.length},\
                  {'message__container-forwarded': message.forwarded || message.replied},\
                  {'message__container-forwarded-with-text': (message.forwarded || message.repliedMessage) && message.message},\
                  {'message__container-replied': message.repliedMessage},\
                  {'message__container-replied-noself': message.isUserMessage && message.repliedMessage && message.repliedMessage.isUserMessage !== message.isUserMessage},\
                  {'message__container-replied-noself': !message.isUserMessage && message.repliedMessage && message.repliedMessage.isUserMessage !== message.isUserMessage} ]",

        ref="message",
      )

        forwarded-header(
          v-if="message.forwarded",
          :num="message.forwardedFromUser.num === userInfo.num\
            ? 'You'\
            : message.forwardedFromUser.num",
        )

        replied-header(
          v-if="message.repliedMessage",
          :repliedByNum="message.repliedMessage.num",
          :isRepliedToClientMessage="userInfo.num === message.repliedMessage.num",
        )

        replied-message(
          v-if="message.repliedMessage",
          :repliedMessage="message.repliedMessage",
          :isRepliedToClientMessage="userInfo.num === message.repliedMessage.num",
          @scroll-to-message="scrollTo",
        )
        .message__forward-image(
          v-if="isForwardIconVisible",
          @click.stop.prevent="forwardImage",
        )
          forward-icon

        a.message__container-file__item.doc(
          v-if="message.attachment && message.attachment.type === 'doc'",
          :href="message.attachment.src",
          target="_blank",
        )
          span.file__attachment
            atach-icon
          span.file__name
            | {{message.attachment.name}}.{{message.attachment.extension}}

        audio-track(
          v-if="message.attachment && message.attachment.type == 'audio'",
          :link="message.attachment.src",
        )

        .message__container-file__item(
          v-if="message.attachment && message.attachment.type == 'video'",
        )
          .message__container-file__item-video
            .message__container-file__item-video-button(
              @click="!isSelectMode && openVideoPlayer(message.attachment.id)",
            )
              .message__container-file__item-video-button-item
                play-icon(white)
            div.message__container-file__item-video-item(
              :style="`\
                background-image: url(${message.attachment.poster});\
                background-size: cover;\
                background-position: center center;\
                width: 400px;\
                padding-top: 100%;\
                height: 0px;\
                max-width: 100%;\
            `",
            )
        button.message__container-file__item(
          v-if="message.attachment && message.attachment.type === 'image'",
          @click="openVideoPlayer(message.attachment.id)"
        )
          div.message__image(
            :style="`\
              background-image: url(${message.attachment.src});\
              background-size: cover;\
              background-position: center center;\
              width: 400px;\
              max-width: 100%;\
            `",
            :alt="message.attachment.type",
          )

        media-group(
          v-if="message.mediaGroup && message.mediaGroup.length",
          :message="message",
          @open-player="openVideoPlayer",
        )

        p.message__text(v-if="message.message")
          | {{ message.message }}

        .message__footer
          span.message__text-size(
            v-if="message.attachment && message.attachment.type === 'doc'"
          )
            | {{message.attachment.size}} |
            | .{{message.attachment.extension}}

          span.date {{ messageTime }}

          div.message__status(v-if="this.message.isUserMessage")
            img(v-if="message.status !== 'unread'", :src='require(`~assets/img/${message.status}2.svg`)')

        .message__tools(@click.stop="toggleToolsMenu", ref="dots" v-if="!isSelectMode")
          .message__tools-container
            .message__tools-item.message__tools-item-first
            .message__tools-item.message__tools-item-second
            .message__tools-item.message__tools-item-third
</template>

<script src="./Message.ts" lang="ts"></script>

<style src="./message.styl" lang="stylus" scoped></style>
