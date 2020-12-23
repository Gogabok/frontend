<template lang="pug">
  .contacts__input-field
    .contacts__input-field__buttons-container__media
      transition(mode="out-in", name="fade")
        button.input__emoji.input__emoji-translate.contacts__input-field__translate(
          :class="{'active':isPayedDialog}",
          @click="transactionHandler",
          v-if="isTransferIconVisible",
        )
          transfer-icon(:isActive="isPayedDialog")

      button.input__emoji.input__emoji-plus(
        @click="plusIconClickHandler",
        :class="{\
          'input__emoji-plus-active': isPlusIconRotated,\
          'input__emoji-plus-active-single': !isTransferIconVisible,\
        }",
      )
        plus-icon

    .contacts__input-field__input-wrapper(
      :class="{\
        'wide': isInputFocused,\
        'hidden': isSelectMode && !this.isContactsListVisible,\
      }",
      ref="inputContainer",
    )
      textarea.contacts__input-field__input-wrapper__input(
        @input="inputHandler",
        @focus="focusStateChangeHandler(true)",
        @blur="focusStateChangeHandler(false)",
        placeholder="Message...",
        rows="1",
        v-model="messageText",
        ref="textArea",
        @keyup.ctrl.enter="messageText.trim().length && sendButtonClickHandler()",
      )

    .contacts__input-field__buttons-container
      button.input__emoji.input__emoji-send(
        @click.stop="sendButtonClickHandler",
        :class="{'active': isSendButtonActive}",
      )
        transition(name="mic-icon-transition", mode="out-in")
          forward-icon(v-if="isSelectMode && selectType === 'forward'")
          delete-icon(v-else-if="isSelectMode && selectType === 'delete'")
          microphone-icon(v-else-if="isMicIconVisible")
          send-message-icon(v-else)

    transition(name="fade")
      attachments-panel(
        v-if="isAttachmentsMenuVisible",
        :isPayedDialog="isPayedDialog",
        @close="closeAttachmentMenu",
        @toggle-transaction="transactionHandler",
        @open-camera="openCamera",
      )

    attachments-preview(
      @add-file="addFileHandler"
      @remove-file="removeFileHandler"
    )

    audio-record-panel(
      v-if="isMicrophoneMenuActive",
      @close="closeMicrophoneMenu",
      @send-message="audioMessageSendHandler",
    )

    reply-message-bar(
      v-if="repliedMessage",
      :message="repliedMessage",
      @clear-replied-message="clearRepliedMessage",
    )

    transition(name="fade" mode="out-in")
      div.confirm__delete(v-if="isVisibleDeleteConfirm")
        .confirm__delete-container
          p.confirm__delete-title Delete messages
          p.confirm__delete-text
            | An unread message is deleted in both your and your correnpondents' dialogues.
          p.confirm__delete-text
            | An incoming and/or read message is deleted in your dialogue only.
</template>

<script src="./ContactsInputField.ts" lang="ts"></script>

<style scoped src="./contacts-input-field.styl" lang="styl"></style>
