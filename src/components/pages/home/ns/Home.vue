<template lang="pug">
  Page
    CommonActionBar(:title="$t('mobilePages.home.title')")
    FlexboxLayout(height="100%").home
      Label Home Page
</template>

<script lang="ts" src="./Home.ts"></script>

<style src="./home.styl" lang="stylus" scoped></style>
