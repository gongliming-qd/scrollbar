<template>
  <div>
    <el-input
      placeholder="请输入内容"
      v-model="input"
      style="width:300px"
    >
    </el-input>
    <div>
      {{input}}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      input: ''
    }
  },
  mounted(){
    console.log(this);
  },
  methods: {

  },
  components: {

  }
}
</script>

<style scoped lang="less">
</style>
