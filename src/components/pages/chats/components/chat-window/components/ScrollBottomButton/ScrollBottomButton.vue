<template lang="pug">
    .scroll-bottom-button(
        @click="$emit('click')"
    )
        .scroll-bottom-icon
            angle-icon
</template>

<script lang="ts">
    import Vue from 'vue';
    import { Component, Watch } from 'vue-property-decorator';

    import AngleIcon from 'components/icons/AngleIcon.vue';

    /**
     * Button component which scrolls the chat window page.
     */
    @Component({
        components: {
            'angle-icon': AngleIcon
        },
    })
    export default class ScrollBottomButton extends Vue {}
</script>

<style src="./scroll-bottom-button.styl" lang="stylus"></style>