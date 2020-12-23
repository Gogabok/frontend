<template lang="pug">
  .contact-card__controllers

    .contact-card__controllers__sides-container.contact-card__controllers__leftSide(
      :style="leftSideControllersOpened && !isHolding ? 'opacity: 1' : 'opacity: 0'"
    )

      span.contact-card__controllers__sides-container-item
        star-icon
        span Add

      span.contact-card__controllers__sides-container-item
        delete-icon
        span Delete


    .contact-card__controllers__sides-container.contact-card__controllers__rightSide(
      :style="!leftSideControllersOpened && !isHolding ? 'opacity: 1' : 'opacity: 0'"
    )

      span.contact-card__controllers__sides-container-item
        chats-icon
        span Chat

      span.contact-card__controllers__sides-container-item
        call-icon
        span Audio call

      span.contact-card__controllers__sides-container-item
        videoCall-icon
        span Video call

      
    button.contact-card__controllers__body(
      v-touch:touchhold="() => isMobileMode && cardHoldHandler()"
      v-touch:start="movementHandlerStart"
      ref="cardContainer",
      :class="{'center': !searchString.length || !matchingParameters.length}",
      @click="cardClickHandler",
      :aria-label="contactInfo.name || contactInfo.num",
    )

      transition(:duration="200", name="fade", mode="out-in")
        .contact-card__controllers__body__button(v-if="isSelectMode")
          .contact-card__controllers__body__button__check
            transition(name="fade", :duration="100")
              checked-icon.contact-card__controllers__body__button__check__icon(
                v-if="isSelected"
              )

      .contact-card__controllers__body__avatar-wrapper
        .contact-card__controllers__body__avatar(
          :style="contactInfo.avatarPath\
            ? `background-image: url(${contactInfo.avatarPath}); background-size: cover;`\
            : `background-image: url(${require('~assets/img/default_avatar.svg')});`",
        )

      .contact-card__controllers__body__information
        span.contact-card__controllers__body__information__name(
          v-html="findLetters(contactInfo.name || contactInfo.num, searchString).value",
        )
        .contact-card__controllers__body__information__last-seen(
          v-if="!searchString.length"
        )
          span {{lastSeen}}

        template(v-else)
          span.contact-card__controllers__body__information__common-contacts(
            v-if="commonContacts",
          )
            | Общих контактов - {{commonContacts}}

          .contact-card__controllers__body__information__matching-parameters(
            v-if="matchingParameters.length",
          )
            .parameter(
              v-for="position in matchingParameters",
              v-html="position",
              :dataValue="dataId",
            )

    button.contact-card__controllers__body(
      ref="cardContainerGhost",
      :aria-label="contactInfo.name || contactInfo.num",
      v-if="isHolding"
    )

      .contact-card__controllers__body__avatar-wrapper
        .contact-card__controllers__body__avatar(
          :style="contactInfo.avatarPath\
            ? `background-image: url(${contactInfo.avatarPath}); background-size: cover;`\
            : `background-image: url(${require('~assets/img/default_avatar.svg')});`",
        )

      .contact-card__controllers__body__information
        span.contact-card__controllers__body__information__name(
          v-html="findLetters(contactInfo.name || contactInfo.num, searchString).value",
        )
        .contact-card__controllers__body__information__last-seen(
          v-if="!searchString.length"
        )
          span {{lastSeen}}

        template(v-else)
          span.contact-card__controllers__body__information__common-contacts(
            v-if="commonContacts",
          )
            | Общих контактов - {{commonContacts}}

          .contact-card__controllers__body__information__matching-parameters(
            v-if="matchingParameters.length",
          )
            .parameter(
              v-for="position in matchingParameters",
              v-html="position",
              :dataValue="dataId",
            )

</template>

<script src="./ContactCard.ts" lang="ts"></script>

<style src="./contact-card.styl" lang="styl" scoped></style>
