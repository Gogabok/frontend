<template lang="pug">
  action(
    name="Delete account",
    @click.native="deleteAccount",
    :icon="DeleteIcon",
  )
</template>

<script src="./DeleteAccount.ts" lang="ts"></script>

<style src="./delete-account.styl" lang="stylus" scoped></style>
