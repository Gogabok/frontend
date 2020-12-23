<template lang="pug">
  .contacts-group
    span.contacts-group__header(v-if="!isHeaderHidden")
      slot(name="icon")
      span {{label}}
    .contacts-group__container
      template(v-if="!isLoading")
        slot
      .lds-roller-container(v-else)
        .lds-roller
          div(v-for="i in 8", :key="i")
</template>

<script src="./ItemsGroup.ts" lang="ts"></script>

<style src="./items-group.styl" lang="styl"></style>
