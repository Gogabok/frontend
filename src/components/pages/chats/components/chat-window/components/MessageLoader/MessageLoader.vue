<template lang="pug">
    .message-loader
        .message-loader-icon
            .lds-roller-container
                .lds-roller
                    div(v-for="i in 8", :key="i")
</template>

<script lang="ts">
    import Vue from 'vue';
    /**
     * Loader component that is displayed while loading new messages.
     */
    export default class MessageLoader extends Vue {}
</script>

<style src="./message-loader.styl" lang="stylus"></style>