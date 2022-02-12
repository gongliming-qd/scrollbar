<!--
 * @Author: glm
 * @Date: 2022-01-10 17:00:26
 * @LastEditors: your Name
 * @LastEditTime: 2022-01-18 14:29:53
 * @Description: 
-->
<template>
  <div>
    <el-dialog
      title="Tips"
      :visible.sync="visible"
      width="510px"
      :before-close="handleClose"
    >
      <div>
        <div class="dialogBody">
          {{info}}
        </div>
        <div class="bottomBtn">
          <el-button
            round
            style="marginRight:24px"
            @click="handleClose()"
          >Cancel</el-button>
          <el-button
            type="primary"
            round
            @click="submit"
          >Okay</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    visible: {
      type: Boolean,
    },
    info: {
      type: String,
      default: 'Are you sure you want to make the current?'
    },
    id: {
      type: Number
    }

  },
  methods: {
    // 关闭
    handleClose () {
      this.$emit('update:visible', false)
    },
    // 保存
    async submit () {
      await this.$emit("submit", this.id)
      this.handleClose()
    },
    // 保存
    async addProduct () {

    },
  },
  components: {

  }
}
</script>

<style scoped lang="less">
@import url("../../assets/css/common.less");

.bottomBtn {
  margin-top: 36px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.dialogBody {
  font-size: 14px;
}
</style>
