<template lang="pug">
  .user-profile__section.limitations-section(v-if="profileOwner")
    .limitations-section__mute
      profile-item.user-profile__section__item(
        :label="muteLabel",
        @on-click="muteClickHandler",
        :class="{'active': isMuteOptionsVisible}",
      )
        .mute-icon(slot="icon", :class="{'crossed': profileOwner.isMuted}")
          mute-icon

      .limitations-section__mute__options(v-if="isMuteOptionsVisible")
        button.limitations-section__mute__option(
          v-for="option of options",
          @click="() => muteDurationClickHandler(option.value)",
        )
          | {{option.label}}


    profile-item.user-profile__section__item(
      :label="blockLabel",
      @on-click="blockHandler",
    )
      block-icon.block-icon(slot="icon", :class="{'rotated': profileOwner.isBlocked}")

    profile-item.chat-profile__section__item(
      label="Leave group",
      @on-click="leaveGroup",
      v-if="profileOwner.type === 'group'",
    )
      leave-icon(slot="icon")
</template>

<script src="./Limitations.ts" lang="ts"></script>

<style src="./limitations.styl" lang="stylus" scoped></style>
