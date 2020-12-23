<template lang="pug">
  .contacts-menu
    search-bar(
      :areAllItemsSelected="areAllItemsSelected",
      :isSelectMode="isSelectMode",
      :amountOfSelectedItems="selectedItems.length",

      @search-string-update="updateSearchString",
      @set-select-mode="setSelectMode",
      @toggle-select-all="selectAllItems",
    )

    .contacts-menu__container(ref="contactsContainer")
      template(v-if="areGroupsVisible")
        chats-group(
          v-for="(group, index) in groupsToDisplay",
          :isHeaderHidden="Boolean(group.isHeaderHidden)",
          :isLoading="group.isLoading",
          :label="group.label",
          :key="group.label + index",
        )
          chat-card(
            v-for="item in group.content",
            :chatInfo="item.value()",
            :isSelectMode="isSelectMode",
            :isSelected="selectedItems.includes(item)",
            :searchString="searchString",
            :currentUserData="currentUserData",
            :key="item.id()",
            @join-call="joinCall",
            @select="() => selectItem(item)",
          )
      span.contacts-menu__not-found(v-else)
        | No matching chats
      .contacts-menu__ghost-contact-card(ref="clonedBox")

    menu-footer(
      v-if="isSelectMode"
      @close-select-mode="() => setSelectMode(false)"
    )
      button.contacts-menu__footer-item(
        @click="setContactsFavorite",
        :disabled="!isAnyItemSelected",
        :class="{'active': isAnyItemSelected}",
      )
        star-icon

      button.contacts-menu__footer-item(
        @click="addToContacts",
        :disabled="!isAnyItemSelected",
        :class="{'active': isAnyItemSelected}",
      )
        add-contact-icon

      button.contacts-menu__footer-item(
        @click="deleteSelectedChats",
        :disabled="!isAnyItemSelected",
        :class="{'active': isAnyItemSelected}",
      )
        delete-icon
</template>

<script lang="ts" src="./ContactMenu.ts"></script>

<style lang="stylus" src="./contact-menu.styl"></style>
