<template lang="pug">
  .dialog-time.dialog-time__translate(
    :class="{'dialog-time__translate-show': isPayedDialog}",
  )
    .dialog-time__item.cost_text
      div.cost_text-item
        span.cost_text-item__price Message cost, $: {{messageCost}}
        span.cost_text-item__content {{messageText}}
        br(v-if="messageSubText.length")
        br(v-if="messageSubText.length")
        span(v-if="messageSubText.length") {{messageSubText}}
</template>

<script src="./TransactionMessage.ts" lang="ts"></script>

<style src="./transaction-message.styl" lang="styl"></style>
