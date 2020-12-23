<template lang="pug">
  .message__container-forwarded-box(
    :class="{'toCurrentUser': isRepliedToClientMessage}"
  )
    span.message__container-forwarded-text
      quotes-icon
      span {{repliedByText}}
</template>

<script src="./RepliedHeader.ts" lang="ts"></script>
