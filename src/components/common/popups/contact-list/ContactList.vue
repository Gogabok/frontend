<template lang="pug">
  .contacts__container.contacts__container-list.contacts__container-add
    .contacts__container-overlay(@click="removePopup({ id: popup.id })")
    .contacts__list(
      ref="contactContainer",
      v-touch:start="movementHandlerStart",
    )
      list-header(
        :setSearchValue="setSearchValue",
        :areAllContactSelected="areAllContactSelected",
        @select-all="selectAll",
      )
      .contacts__list-body(ref="contactsBody")
        contacts-group(
          v-for="group in groupsToDisplay",
          :isLoading="group.isLoading",
          :label="group.label",
        )
          contact-card(
            v-for="contact in group.contacts",
            @select="selectContact",
            :isDisabled="disabledContactsIds.includes(contact.id)",
            :contact="contact",
            :isSelected="selectedContacts.includes(contact)",
          )

      list-footer(
        @accept="() => confirmHandler({ id: popup.id, data: { selectedContacts } })",
        @reject="() => removePopup({ id: popup.id })",
        :isAnyContactSelected="isAnyContactSelected",
      )

</template>

<script src="./ContactList.ts" lang="ts"></script>

<style src="./contact-list.styl" lang="stylus" scoped></style>

