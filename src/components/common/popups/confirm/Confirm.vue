<template lang="pug">
  .confirm(
    :class="{\
      'confirm-centered': popup.settings.align.vertical === 'center',\
      }",
    :style="[\
      !isMobileMode && {\
        top: `${popup.settings.position.top}px`,\
        right: `${popup.settings.position.right}px`,\
        bottom: `${popup.settings.position.bottom}px`,\
        left: `${popup.settings.position.left}px`,\
      },\
      {\
        'align-items': `flex-${popup.settings.align.vertical}`\
      },\
    ]",
  )
    .confirm__overlay(@click="removePopup({ id: popup.id })")
    .confirm__container
      span.confirm__text {{popup.textMessage}}
      .confirm__controls
        button.confirm__controls-item(@click="removePopup({ id: popup.id })")
          plus-icon.confirm__controls-item-close
          span Cancel
        button.confirm__controls-item(@click="confirmHandler({ id: popup.id })")
          accept-icon.confirm__controls-item-accept
          span Confirm
</template>

<script src="./Confirm.ts" lang="ts"></script>

<style src="./confirm.styl" lang="stylus" scoped></style>
