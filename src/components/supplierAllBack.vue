<template>
    <div></div>
</template>

<script>

export default {
    name: "supplierAllBack",
    computed: {},
    data() {

        return {

        };
    },
    mounted() {
        if (this.$route.query.type == 1) {
            this.$router.replace({
                path: '/mindmap', query: { isImport: 1 }
            })
        } else if (this.$route.query.type == 2) {
            this.$router.replace({
                path: '/mindmap', query: { ossId: this.$route.query.ossId, fileName: this.$route.query.fileName }
            })
        }
    },

};
</script>

<style scoped>
</style>
