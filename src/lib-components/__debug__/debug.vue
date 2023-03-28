<template>
    <div class="debug">
        <h2 @click="Trigger"><b>{{ title }}</b></h2>
        <span v-if="trigger">
            <slot />
            <br />
        </span>
    </div>
</template>

<script>
export default {
    name: 'debug',
    props: {
        title: {
            type: String,
            required: true
        },
    },
    data() {
        return {
            trigger: false
        }
    },
    methods: {
        Trigger() {
            this.trigger = !this.trigger
        }
    }
}
</script>

<style scoped>
h2 {
    min-width: 200px;
}

div {
    cursor: pointer;
}

.debug {
    border-width: 1px;
    border-color: gray;
    border-style: solid;
    padding: 15px;
    margin: 15px;
}
</style>