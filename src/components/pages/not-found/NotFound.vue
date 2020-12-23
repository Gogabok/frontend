<template lang="pug">
  DefaultPage(:showSidePanel="false")
    .main-content(slot="main-content")
      section.not-found
        span.message {{ $t('pages.not-found.message') }}
        img.error(src="~assets/img/404.png")
        router-link(to="/", style="color: blue; margin-top: 20px;") Go Home
</template>

<script lang="ts" src="./NotFound.ts"></script>

<style lang="stylus" src="./not-found.styl" scoped></style>
