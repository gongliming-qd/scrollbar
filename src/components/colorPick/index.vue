<template>
  <div
    style="height:38px;"
    @click="openColor"
  >
    <slot
      name="inset"
      :row="nowColor"
    ></slot>
    <colorPicker
      style="marginLeft:10px;marginTop:-20px"
      ref="colorPicker"
      v-model="nowColor"
      @hide="close"
      :defaultColor="defaultColor"
      @change="headleChangeColor"
    ></colorPicker>
  </div>
</template>

<script>
export default {
  data () {
    return {
      nowColor: ""
    }
  },
  created () {
    this.nowColor = this.$props.defaultColor
  },
  watch:{
    defaultColor(){
        this.nowColor = this.$props.defaultColor
    }
  },
  props: {
    defaultColor: {
      type: String,
      default: "#7993ae"
    },
    params: {
      type: String,
    }
  },
  methods: {
    headleChangeColor (item) {
      this.$emit('command', this.params, item)
    },
    openColor () {
      this.$refs.colorPicker.openPanel()
      this.$emit('open')
    },
    close(){
      this.$emit('hide');
    }
  },
  components: {

  }
}
</script>

<style scoped lang="less">
/deep/ .m-colorPicker .colorBtn {
  width: 0;
  height: 0;
}
/deep/ .box.open{
  border-radius: 6px;
}
</style>
