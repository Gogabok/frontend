<template lang="pug">
  .call(
    :class="[\
      { 'fullscreen': isFullscreen },\
      { 'minified': isMinified },\
    ]",
    @mousedown="generalMovementHandler.start",
    @touchstart="generalMovementHandler.start",
    ref="callContainer",
  )
    .call__bar(
      v-if="!isFullscreen && !isMinified && !isMobileMode",
      v-touch:start="moveHandler.start",
    )
      span.call__title {{callTitle}}
      button.call__close-icon(@click="endCall")
        plus-icon
    .call__corner.left.bottom(@mousedown.stop="resizeHandler.start")
    .call__border.left(@mousedown.stop="resizeHandler.start")
    .call__border.bottom(@mousedown.stop="resizeHandler.start")

    .call__content
      transition(name="fade", mode="out-in")
        .call__gradient(v-if="isVisibleControls")

      transition(name="fade-up" mode="out-in")
        call-header(
          v-if="isVisibleControls && !isMinified",
          :isAddUserVisible="callerData.type === 'group'",
          :callerName="callTitle",
          :isLoading="isLoading",
          :isFullscreen="isFullscreen",
          :duration="secCounter",
          @toggle-fullscreen="fullScreenHandler",
          @minify="minifyCall",
          @add-user="showAddParticipantInterface",
          @open-settings="() => setSettingsVisibility(true)",
          @disable-incoming-video="",
        )

      transition(name="fade-up" mode="out-in")
        call-info(v-if="isVisibleControls && !isMinified && !isLoading")

      .call__interlocutors(
        ref="mainWindow",
        :style="doStackParticipants && {\
          'grid-template-columns': '1fr',\
        }",
      )
        .target-overlay(
          v-if="ghostUserId && !mainWindowUsersIds.includes(ghostUserId)",
          :class="{ crop: listOfParticipants.length <= 2 }",
        )
          plus-icon
        template(v-if="!isMinified")
          template(
            v-for="(participant, index) in visibleParticipants",
          )
            call-participant(
              v-if="!participant.id.includes(SCREEN_POSTFIX)",
              :key="participant.id",
              :data="participant",
              @mousedown.native="event => onUserMouseDown(event, participant.id)",
              @touchstart.native="event => onUserMouseDown(event, participant.id)",
              :style="index === visibleParticipants.length - 1 && {\
                'grid-column': `${\
                  visibleParticipants.length % 2 === 0\
                    ? 'auto'\
                    : '1/-1'\
                }`,\
              }",
            )
            screen-video(
              v-else,
              :id="participant.id.split(SCREEN_POSTFIX)[0]",
              :style="index === visibleParticipants.length - 1 && {\
                'grid-column': `${\
                  visibleParticipants.length % 2 === 0\
                    ? 'auto'\
                    : '1/-1'\
                }`,\
              }",
              @mousedown.native="event => onUserMouseDown(event, participant.id)",
              @touchstart.native="event => onUserMouseDown(event, participant.id)",
            )

      call-footer(
        ref="footer",
        :isTarget="ghostUserId && mainWindowUsersIds.includes(ghostUserId)",
        :isGroupChat="listOfParticipants.length > 2",
        :mainWindowUsersIds="mainWindowUsersIds",
        :listOfParticipants="listOfParticipants",
        :SCREEN_POSTFIX="SCREEN_POSTFIX",
        @start-move="onUserMouseDown",
      )

      .ghost-user(v-if="isGhostUserVisible", ref="ghostUser")
        img.ghost-user__image(@mousedown.prevent, :src="ghostUserImage")

      transition(name="fade-down" mode="out-in")
        call-controls(
          v-if="isVisibleControls && !isMinified && !isCallEnded.isEnded",
          :isLoading="isLoading",
          :isUnpinned="false",
          :isFullscreenEnabled="isFullscreen",
          :isTarget="mainWindowUsersIds.includes(ghostUserId)",
          @end-call="endCall",
          @open-full-screen="openNativeFullScreen",
          @lock-controls="lockControlsVisibility",
          @unlock-controls="unlockControlsVisibility",
        )

      transition(name="fade-down-center" mode="out-in")
        span.call__ended-message(v-if="isCallEnded.isEnded")
          template(v-if="isCallEnded.code === CallStates.DECLINED") Declined
          template(v-else-if="isCallEnded.code === CallStates.BUSY") Busy
          template(v-else-if="isCallEnded.code === CallStates.FAILED_TO_CONNECT") Failed to connect
          template(v-else-if="isCallEnded.code === CallStates.NO_RESPONSE") No response
          template(v-else) Call Ended

      settings(
        v-if="isSettingsVisible",
        @close="() => setSettingsVisibility(false)",
        @select-audio-device="selectAudioDevice",
        @select-video-device="selectVideoDevice",
      )
</template>

<script src="./VideoCall.ts" lang="ts"></script>

<style src="./video-call.styl" lang="stylus"></style>
