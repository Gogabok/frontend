<template lang="pug">
  .contacts-menu
    contacts-menu-topbar(
      :areAllItemsSelected="areAllItemsSelected",
      :amountOfSelectedItems="selectedItems.length",
      :isSelectMode="isSelectMode",

      @search-string-update="updateSearchString",
      @set-select-mode="setSelectMode",
      @toggle-select-all="selectAllItems",
      @add-new-contact="createGroupChat",
    )

    .contacts-menu__container(ref="contactsContainer")
      template(v-if="areGroupsVisible")
        contact-card.self(
          v-if="items.some(contact => contact.id === currentUser.id) && currentUser.contains(searchString)",
          :isSelected="selectedItems.includes(currentUser)",
          :searchString="searchString",
          :isSelectMode="isSelectMode",
          :commonContacts="items ? items.length : 0",
          :contactInfo="currentUser.value()",
          @select="() => selectItem(currentUser)",
        )

        contacts-group(
          v-for="(group, index) in groupsToDisplay",
          :isLoading="group.isLoading",
          :label="group.label",
          :key="group.label + index",
          :ref="`group-${group.label}`"
        )
          component(:is="group.icon", v-if="group.icon", slot="icon")
          contact-card(
            v-for="item in group.content",
            :ket="item.id()",
            :contactInfo="item.value()",
            :isSelected="selectedItems.includes(item)",
            :searchString="searchString",
            :isSelectMode="isSelectMode",
            :commonContacts="items ? items.length : 0",
            @select="() => selectItem(item)",
            @set-contact-favorite="setContactFavorite",
            @delete-contact-favorite="deleteContactFavorite"
          )

      span.contacts-menu__not-found(v-else)
        | No matching contacts
      .contacts-menu__ghost-contact-card(ref="clonedBox")

    menu-footer(
      v-if="isSelectMode",
      @close-select-mode="() => setSelectMode(false)",
    )
      button.contacts-menu__footer-item(
        @click="setContactsFavorite",
        :disabled="!isAnyItemSelected",
        :class="{'active': isAnyItemSelected}",
      )
        star-icon

      button.contacts-menu__footer-item(
        @click="createGroupChat",
        :disabled="!isAnyItemSelected || isAnyGroupChatSelected",
        :class="{'active': isAnyItemSelected && !isAnyGroupChatSelected}",
      )
        create-chat-icon

      button.contacts-menu__footer-item(
        @click="deleteSelectedContacts",
        :disabled="!isAnyItemSelected",
        :class="{'active': isAnyItemSelected}",
      )
        delete-icon
</template>

<script lang="ts" src="./ContactMenu.ts"></script>

<style lang="stylus" src="./contact-menu.styl"></style>
