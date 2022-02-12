<template>
    <el-tooltip :content="content" placement="bottom-start" effect="dark" :disabled="isDisabled">
        <div class="contentnowrap" :class="{isLink: 'link-text'}" @mouseenter="isShowTooltip" @click="linkTo">{{content}}</div>
    </el-tooltip>
</template>
 
<script>
    export default{
        name: 'ShowTooltips',
        props: {
            content: {
                type: String,
                default: ''
            },
            isLink: {
                type: Boolean,
                default: false,
                required: false
            }
        },
        data(){
            return {
                isDisabled: false
            }
        },
        methods: {
            isShowTooltip(e){
                let clientWidth = e.target.clientWidth,
                    scrollWidth = e.target.scrollWidth,
                    arrList = Array.from(e.target.classList)
                if(scrollWidth > clientWidth){
                    this.isDisabled = false
                    if(!arrList.includes('hover-blue')){
                        e.target.classList.add('hover-blue')
                    }
                } else {
                    this.isDisabled = true
                    e.target.classList.remove('hover-blue')
                }
            },
            linkTo(){
                if(this.isLink){
                    this.$emit("linkTo")
                }
            }
        }
    }
</script>
 
<style lang="less">
    .contentnowrap{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .hover-blue:hover{
        // color: red;
    }
    .link-text{
        // color: red;
        cursor: pointer;
    }
    .el-tooltip__popper{
        font-size: 14px;
    }
</style>
