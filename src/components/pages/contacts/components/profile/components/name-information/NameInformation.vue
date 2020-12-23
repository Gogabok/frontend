<template lang="pug">
  .user-profile__section.name-section(
    :class="{'empty-about': profileOwner.type === 'person' && !profileOwner.about.length}",
  )
    .name-section__name
      input.name-section__input(
        ref="nameField",
        v-model="localName",
        type="text",
        :disabled="!isContact",
        @focus="edit",
        @blur="save",
        @keydown.enter="input.blur",
      )

      .name-section__icon(v-if="isContact")
        transition(name="fade" mode="out-in")
          pencil-icon(v-if="!isEditMode")
          loading-icon(v-else-if="isLoading")
          accept-icon.accept(v-else)

    p.name-section__about(v-if="profileOwner.type === 'person' && profileOwner.about.length")
      | {{profileOwner.about}}
    p.name-section__members(v-else-if="profileOwner.type === 'group'")
      | {{profileOwner.participants.length}} members
</template>

<script src="./NameInformation.ts" lang="ts"></script>

<style src="./name-information.styl" lang="stylus" scoped></style>
