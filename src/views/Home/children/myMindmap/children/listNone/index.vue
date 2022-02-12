<!--
 * @Author: glm
 * @Date: 2022-01-14 15:15:35
 * @LastEditors: your Name
 * @LastEditTime: 2022-01-25 10:44:35
-->
<template>
  <div class="listNone">
    <div class="noneImg">
    </div>
    <div class="title">No Mindmap, here we go now!</div>
    <div>
      <el-button
        @click="clickImport"
        round
        style="marginRight:24px"
      >Import local file</el-button>
      <el-button
        type="primary"
        round
        @click="clickAppendSingle"
      >Add New</el-button>
    </div>
    <!-- 导入本地 -->
    <ImportFile
      :visible.sync="aboutImport.visible"
      @change="ImportSubmit"
      :title="aboutImport.title"
    ></ImportFile>
  </div>
</template>

<script>
// 导入本地文件
import ImportFile from "../../../appendNew/children/importFile/index.vue"
export default {
  name: "listNone",
  data () {
    return {
      aboutImport: {
        visible: false,
        title: "Import Local File"
      }
    }
  },
  methods: {
    // 导入部分 -- 
    // 1. 点击导入
    clickImport () {
      // 判断是否已经登录
     this.aboutImport.visible = true
    },
    // 导入成功回调
    ImportSubmit () {
      // this.$message.success("修改成功！")
    },
    // 去新增
    clickAppendSingle () {
      const { href } = this.$router.resolve({
        path: "/mindMap?isNew=1"
      });
      window.open(href, "_blank")
    },
  },
  components: {
    ImportFile
  }

}
</script>

<style scoped lang="less">
.listNone {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 110px;
  .noneImg{
    display: inline-block;
    width: 356px;
    height: 228px;
    background: url('../../../../imgs/none.svg') center center no-repeat;
  }
  .title {
    font-weight: bold;
    font-size: 18px;
    margin-top: 54px;
    margin-bottom: 30px;
  }
}
</style>
