<template lang="pug">
  .status-dropdown
    button.status-dropdown__active(@click="emitOpen")
      span.value {{currentStatus}}
      angle-icon.icon(:class="{ rotated: isOpen }")
    transition(name="expand")
      .status-dropdown__options-list(v-if="isOpen")
        status-option(
          v-for="status of statusesList",
          :status="status",
          @delete="() => deleteCustomStatus(status.id)",
          @select="() => changeUserStatus(status.id)",
        )
        .status-dropdown__add-status
          .add-status__input-wrapper
            input.add-status__input(
              v-model="newStatus",
              placeholder="Add custom status...",
              @keydown.enter="(event) => addCustomStatus(event.target.value)"
            )
            pencil-icon.add-status__icon
          .add-status__description
            | {{25 - newStatus.length}} symbols left.
</template>

<script src="./StatusDropdown.ts" lang="ts"></script>

<style src="./status-dropdown.styl" lang="stylus"></style>
