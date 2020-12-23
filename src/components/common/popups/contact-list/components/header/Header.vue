<template lang="pug">
  .contacts__list-header
    .contacts__list-search.search
      label.search__icon(for="search-contact-input")
        img(src="~assets/img/icons/search1.svg", alt="search")
      .search__input
        input#search-contact-input(
          placeholder="Search...",
          v-model="searchValue",
          type="text",
        )
      button.contacts__list-header-select(
        v-if="!areAllContactSelected",
        @click="$emit('select-all')",
      ) Select all
      button.contacts__list-header-select(
        v-if="areAllContactSelected",
        @click="$emit('select-all')",
      ) Deselect all

</template>

<script src="./Header.ts" lang="ts"></script>

<style src="./header.styl" lang="stylus" scoped></style>
