<template lang="pug">
  .share__container
    .share__overlay(@click="() => $emit('close-share')")
    .share__body
      span.share__box-name Status
      .share__dropdown-wrapper(:class="{ 'active': isStatusDropdownOpen }")
        status-dropdown.dropdown(
          ref="dropdown"
          :isOpen="isStatusDropdownOpen",
          @open="onOpen",
          @change="onStatusChange",
        )
      transition(name="fade")
        .share__dropdown-backlayer(v-if="isStatusDropdownOpen")
      .share__line
      .share__box(ref="body")
        share-item(
          v-for="data of dataToShare",
          v-if="data.value",
          :data="data.value",
          :description="data.description",
          :label="data.label",
        )
</template>

<script lang="ts" src="./ShareContainer.ts"></script>

<style src="./share-container.styl" lang="stylus" scoped></style>
