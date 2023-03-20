<template>
    <div>
        <h2><b>{{ title }}</b></h2>
        <slot />
        <br />
        <hr />
        <br />
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
    }
}
</script>