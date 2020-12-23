<template lang="pug">
  button.contact-card(
    ref="cardContainer",
    :class="{'center': !searchString.length || !matchingParameters.length}",
    @click="cardClickHandler",
    :aria-label="chatInfo.name || chatInfo.num",
  )

    transition(:duration="200", name="fade", mode="out-in")
      .contact-card__button(v-if="isSelectMode")
        .contact-card__button__check
          transition(name="fade", :duration="100")
            checked-icon.contact-card__button__check__icon(v-if="isSelected")

    .contact-card__avatar-wrapper
      .contact-card__avatar(
        :style="chatInfo.avatarPath\
          ? `background-image: url(${chatInfo.avatarPath}); background-size: cover;`\
          : `background-image: url(${require('~assets/img/default_avatar.svg')});`",
      )

    .contact-card__information
      .contact-card__information--top
        span.contact-card__information__name(
          v-html="findLetters(chatName, searchString).value",
        )
        span.contact-card__information__time {{lastMessageTime}}

      .contact-card__information--bottom(v-if="!searchString.length && !chatInfo.hasOngoingCall")
        .contact-card__information__last-seen
          span {{lastSeen}}
        template(v-if="lastMessage")
          span.contact-card__information__unread-counter(v-if="amountOfUnreadMessages > 0") {{amountOfUnreadMessages}}
          img.contact-card__information__status(
            v-else-if="lastMessage.status !== 'unread'",
            :src="require(`~assets/img/${lastMessage.status}2.svg`)",
          )
      button.contact-card__join-call(@click="joinCall", v-else-if="chatInfo.hasOngoingCall")
        | Присоединиться к звонку

      template(v-else)
        span.contact-card__information__common-contacts(
          v-if="commonContacts",
        )
          | Общих контактов - {{commonContacts}}

        .contact-card__information__matching-parameters(
          v-if="matchingParameters.length",
        )
          .parameter(
            v-for="position in matchingParameters",
            v-html="position",
            :dataValue="dataId",
          )
</template>

<script src="./ChatCard.ts" lang="ts"></script>

<style src="./chat-card.styl" lang="styl" scoped></style>
