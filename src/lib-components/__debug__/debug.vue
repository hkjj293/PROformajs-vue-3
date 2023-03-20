<template>
    <div>
        <h2 @click="Trigger"><b>{{ title }}</b></h2>
        <span :hidden="trigger">
            <slot />
            <br />
            <hr style="border-width: 3px;" />
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
            trigger: true
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
</style>