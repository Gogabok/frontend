<template lang="pug">
  aside.dialog-header
    .dialog-header__chat-info
      button.dialog-header__chat-info__arrow(
        v-if="isMobileMode && !isSelectMode",
        @click="handleBack",
      )
        img(src="~assets/img/icons/angle-thin.svg", alt="<", title="Go back")

      label.dialog-header__chat-info__checkbox(v-if="isSelectMode")
          input(type="checkbox", hidden, @input.stop="handlerSelectAll")
          div.dialog-header__chat-info__checkbox-border
            transition(:duration="200", name="fade", mode="out-in")
              checked-icon.dialog-header__chat-info__checkbox-icon(
                v-if="isAllMessagesSelected",
              )


      .dialog-header__chat-info__avatar(:class="activeChat.status")
        .dialog-header__chat-info__avatar__icon(
          :style="activeChat.avatarPath\
                 ? `background-image: url(${activeChat.avatarPath}); background-size: cover;`\
                 : `background-image: url(${require('~assets/img/default_avatar.svg')}); `",
        )

      .dialog-header__chat-info__container(
        @click="openChatSettings",
        v-if="!isSelectMode",
      )
        span.dialog-header__chat-info__container-name
          | {{activeChat.name || `&${activeChat.num}`}}
        span.dialog-header__chat-info__container-status
          template(v-if="pageType === 'group'")
            | Members: {{activeChat.participants.length}}
          template(v-else)
            | вчера

      p.dialog-header__chat-info__selected-counter(v-if="isSelectMode")
        | Selected: {{selectedMessagesAmount}}

    transition(name="fade")
      div.dialog-header__calls(v-if="!isSelectMode")
        button(v-if="activeChat.hasOngoingCall", @click="joinCall")
          | Присоединиться к звонку
        template(v-else)
          button.dialog-header__calls__call.video(@click="videoHandler")
            video-call-icon
          button.dialog-header__calls__call.audio(@click="audioHandler")
            call-icon

      button.dialog-header__cancel-select(
        v-else
        @click="handleSelectCancel",
      )
        | Cancel
</template>

<script src="./DialogHeader.ts" lang="ts"></script>

<style src="./dialog-header.styl" lang="styl"></style>
