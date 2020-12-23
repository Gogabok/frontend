<template lang="pug">
  .forward-container__search-bar
    img.forward-container__search-bar__search-icon(
      src="~assets/img/icons/search1.svg",
      alt="search",
    )
    input.forward-container__search-bar__input(
      @input="inputHandler",
      placeholder="Search...",
    )
    label.forward-container__search-bar__all-checked
      input.forward-container__search-bar__all-checked__checkbox(
        type="checkbox",
        name="selectAll",
        :checked="areAllContactsChosen",
        @input="selectAllContacts",
      )
      .forward-container__search-bar__all-checked__face
        transition(:duration="200", name="fade", mode="out-in")
          checked-icon(v-if="areAllContactsChosen")
</template>

<script src="./SearchBar.ts" lang="ts"></script>


<style src="./search-bar.styl" lang="stylus" scoped></style>
