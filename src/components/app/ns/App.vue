<template lang="pug">
  RadSideDrawer(ref="drawer")
    StackLayout(~drawerContent).drawerContent
      slot(name="drawerContent")
    Frame(~mainContent ref="drawerMainContent")
      slot(name="mainContent")
</template>

<script lang="ts" src="./App.ts"></script>

<style src="./app.styl" lang="stylus" scoped></style>
