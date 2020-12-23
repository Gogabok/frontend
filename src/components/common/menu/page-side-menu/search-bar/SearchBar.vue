<template lang="pug">
  transition-group.contacts-topbar(
    :class="{'select-mode': isSelectMode}",
    name="change",
    tag="div",
    mode="out-in",
  )
    .contacts-topbar__container(v-if="!isSelectMode", key="searchMode")
      .search
        .search__icon
          label(for="search-input")
            img(src="~assets/img/icons/search1.svg", alt="search")

        .search__input
          input(
            type="text",
            id="search-input",
            @input="searchFunction($event.target.value)",
            placeholder="Search...",
          )

      button.contacts-topbar__add-contact(@click="setSelectMode(true)")
        | Select
    .contacts-topbar__container(v-else, key="selectMode")
      button.contacts-topbar__checkbox(@click="selectAll")
        transition(name="fade", :duration="100")
          span(v-if="areAllItemsSelected") Deselect all
          span(v-else) Select all
      span.contacts-topbar__select-counter Selected: {{amountOfSelectedItems}}
      button.contacts-topbar__cancel-icon(@click="cancelButtonClickHandler")
        | Cancel
</template>

<script src="./SearchBar.ts" lang="ts"></script>

<style src="./search-bar.styl" lang="stylus"></style>
