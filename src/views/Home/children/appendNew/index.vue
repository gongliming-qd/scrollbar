<!--
 * @Author: glm
 * @Date: 2022-01-14 15:15:35
 * @LastEditors: your Name
 * @LastEditTime: 2022-01-24 10:39:36
-->
<template>
  <div class="appendNew">
    <!-- 导入按钮 -->
    <div
      class="importBtn"
      @click="clickImport"
    >
      <img src="../../imgs/append_import.png">
      <div class="importIntro">
        <span class="topTntro">Import file</span>
        <span class="bottomIntro">PDmind</span>
      </div>
    </div>
    <div
      class="appendBtn"
      @click="clickAppendSingle"
    >
      <img src="../../imgs/append_add.png">
      <div class="importIntro">
        <span class="topTntro">Add New</span>
        <span class="bottomIntro">Here we go now!</span>

      </div>
    </div>
    <ImportFile
      :visible.sync="aboutImport.visible"
      @change="ImportSubmit"
      :title="aboutImport.title"
    ></ImportFile>
  </div>
</template>

<script>
import ImportFile from "./children/importFile/index.vue"
export default {
  name: "appendNew",
  data () {
    return {
      aboutImport: {
        visible: false,
        title: "Import Local File"
      }
    }
  },
  methods: {
    // 点击导入
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
  created () {
    this.offlineF = () => {
      this.$store.dispatch('setnowNetwork', false)
    }
    this.onlineF = () => {
      this.$store.dispatch('setnowNetwork', true)
    }
    window.addEventListener('offline', this.offlineF);
    window.addEventListener('online', this.onlineF);
  },
  beforeDestroy () {
    window.addEventListener('offline', this.offlineF);
    window.addEventListener('online', this.offlineF);
  },
  components: {
    ImportFile
  }
}
</script>

<style scoped lang="less">
.appendNew {
  width: 100%;
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  .importBtn {
    margin-right: 80px;
    width: 335px;
    height: 176px;
    border-radius: 32px;
    overflow: hidden;
    background-color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px dashed #c4c4ff;
    &:hover {
      box-shadow: 0px 41px 70px rgba(84, 82, 246, 0.15);
    }
    .importIntro {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      flex-direction: column;
      margin-left: 20px;
      .topTntro {
        color: #5452f6;
        font-weight: bold;
        font-size: 18px;
        line-height: 25px;
        margin-bottom: 7px;
      }
      .bottomIntro {
        font-size: 14px;
        line-height: 20px;
        color: rgba(84, 82, 246, 0.5);
      }
    }
  }
  .appendBtn {
    margin-right: 80px;
    width: 335px;
    height: 176px;
    border-radius: 32px;
    overflow: hidden;
    background: linear-gradient(2.52deg, #5452f6 8.37%, #9493ff 97.9%);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      box-shadow: 0px 41px 70px rgba(84, 82, 246, 0.15);
    }
    .importIntro {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      flex-direction: column;
      margin-left: 20px;
      .topTntro {
        color: #fff;
        font-weight: bold;
        font-size: 18px;
        line-height: 25px;
        margin-bottom: 7px;
      }
      .bottomIntro {
        font-size: 14px;
        line-height: 20px;
        color: #fff;
        opacity: 0.5;
      }
    }
  }
}
</style>
