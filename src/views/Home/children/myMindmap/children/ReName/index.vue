<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="487px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div v-loading="tableLoading">
        <div class="dialogBody">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="0"
          >
            <el-form-item
              label=""
              prop="title"
            >
              <el-input
                class="w300"
                v-model="ruleForm.title"
                placeholder="Please enter a name"
                @keyup.enter.native="submit('ruleForm')"
              ></el-input>
            </el-form-item>
          </el-form>
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
            @click="submit('ruleForm')"
          >Okay</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateProductName } from "@/request/home"

export default {
  data () {
    return {
      tableLoading: false,
      ruleForm: {
        title: ""
      },
      // 表单鉴权
      rules: {
        title: [
          { required: true, message: 'Name cannot be empty', trigger: 'blur' },
          {  max: 50, message: 'Length cannot exceed 50', trigger: 'blur' },
         { pattern: /^[^\\/*?:<>|"]*$/, message: 'Not allowed \\/*?:<>|' , trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    visible: {
      type: Boolean
    },
    title: {
      type: String
    },
    name: {
      type: String
    },
    id: {
      type: Number
    },
  },
  watch: {
    visible () {
      if (this.visible) {
        console.log(this.$props);
        this.ruleForm.title = this.$props.name
      }
    }
  },
  methods: {
    // 关闭
    handleClose () {
      this.$emit('update:visible', false)
      this.$refs.ruleForm.resetFields();
    },
    // 保存
    submit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.addProduct()
          this.handleClose()
        } else {
          return false
        }
      })
    },
    
    // 保存
    async addProduct () {
      // \/*?:<>|
      let params = { id: this.id, newname: this.ruleForm.title.trim() }
      let results = await updateProductName(params)
      console.log(results)
      if (results.data.msg === 'ok' && results.data.code === 200) {
        this.$message.success('Succeed')
        this.$emit('change')
      }
    },
  },
}
</script>

<style scoped lang="less">
.bottomBtn {
  margin-top: 36px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
