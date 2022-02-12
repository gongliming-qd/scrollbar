<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="487px"
      :before-close="handleClose"
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
              label
              prop="list"
            >
              <el-upload
                class="upload-demo"
                :limit="1"
                accept=".PDmind"
                :on-remove="removeFile"
                :http-request="changeFile"
                :file-list="ruleForm.list"
                :on-exceed="dragMore"
                drag
                action
                multiple
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  Drag the file here, or
                  <em>click upload</em>
                </div>
                <div
                  class="el-upload__tip"
                  slot="tip"
                >Note: Only PDmind file are supported to import</div>
              </el-upload>
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

import { } from "@/request/home"
import uploadMixin from '@/mixin/aLiOss.js';
import { mapMutations, mapGetters } from "vuex";

export default {
  name: "importFile",
  mixins: [uploadMixin],
  components: {},
  data () {
    return {
      tableLoading: false,
      uploadApi: "/api/ProjectFiles/getprojectfiles",
      ruleForm: {
        list: []
      },
      // 表单鉴权
      rules: {
        list: [
          { required: true, message: 'Please select a file to upload', trigger: 'change' }
        ]
      },
      stopForBreakFileStatus: false,
      stopForBreakFileResults: false
    }
  },
  computed: {
    ...mapGetters({
      minder: "getMinder",
      editor: "getEditor",
      tempMindMapData: "getTempMindMapData",
      tempMindMapName: "getTempMindMapName"
    }),
  },
  props: {
    visible: {
      type: Boolean,
    },
    title: {
      type: String,
    }
  },
  methods: {
    ...mapMutations([
      "setTempMindMapName",
      "setTempMindMapData"
    ]),
    // 删除文件
    removeFile (file, fileList) {
      this.ruleForm.list = fileList
    },
    // 缩略图预览选择文件
    changeFile (file) {
      console.log(file.file);
      // 1. 文件类型效验
      const index = file.file.name.lastIndexOf(".");
      const ext = file.file.name.substr(index + 1);
      if (ext !== 'PDmind') {
        this.$message.warning('Format error! PDMind file only')
        this.ruleForm.list = []
        return
      }
      let ImgUrl = window.URL.createObjectURL(file.file)
      // 预览列表重新搞,包括存储文件file
      let obj = { name: file.file.name, url: ImgUrl, fileUrl: file.file }
      this.ruleForm.list = [obj]
    },
    // 超出限制拖拽多个保留第一个
    dragMore (files) {
      let file = files[0]
      let ImgUrl = window.URL.createObjectURL(file)
      // 预览列表重新搞,包括存储文件file
      let obj = { name: file.name, url: ImgUrl, fileUrl: file }
      this.ruleForm.list = [obj]
    },
    // formData 提交
    async addProduct () {
      let { fileUrl, name } = this.ruleForm.list[0]
      console.log(fileUrl);
      console.log(name);
      // 1. 文件类型效验
      const index = name.lastIndexOf(".");
      const ext = name.substr(index + 1);
      let setname = name.substr(0, index);

      if (ext !== 'PDmind') {
        this.$message.warning('Format error! PDMind file only')
        return
      }
      // 2. 做文件大小限制
      const size = fileUrl.size / 1024 / 1024
      if (size > 10) {
        this.$message.warning('Import failed! The file cannot exceed 10M')
        return
      }
      // 3. 文件为空效验
      if (size === 0) {
        this.$message.warning('File error')
        return
      }
      console.log(setname);
      // 4. 做文件长度限制
      console.log(setname.length);
      if (setname.length > 50) {
        setname = setname.substr(0, 50)
      }
      // 5. 损坏文件限制
      this.stopForBreakFileStatus = false
      // 5.1 读取文件
      await this.readerFile(fileUrl)
      let timer = setInterval(async () => {
        if (this.stopForBreakFileStatus) {
          // 读取文件结束
          if(this.stopForBreakFileResults){
            // 未损坏文件
            await this.$message.success('Import successfully')
            this.handleClose();
            this.setTempMindMapData(fileUrl);
            this.setTempMindMapName(setname);
            this.$router.replace({ path: '/supplierAllBack', query: { type: 1 } })
          }
          else{
            // 损坏文件
            this.$message.warning('File error')
          }
          clearInterval(timer)
          
        }
      }, 100)
    },
    // 判断是否是损坏文件
    readerFile (fileUrl) {
      var reader = new FileReader();
      reader.readAsText(fileUrl, 'utf-8');
      reader.onload = (e) => {
        let resultStr = e.target.result
        console.log(resultStr);
        this.stopForBreakFileResults = /^\{"root":\{"data":/.test(resultStr) && resultStr.includes(`"template":"`) && resultStr.includes(`"theme":"`) && resultStr.includes(`"version":"`)
        this.stopForBreakFileStatus = true
      }

    },
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
        } else {
          return false
        }
      })
    },


  },
}
</script>

<style scoped lang="less">
.upload-demo {
  width: 100%;
}
/deep/ .el-upload {
  width: 100%;
}
/deep/ .el-upload-dragger {
  width: 100%;
  height: 230px;
  background-color: #f5f4ff;
  border: 1.5px dashed #c4c4ff;
}
/deep/ .el-upload-dragger .el-upload__text {
  font-family: Inter;
  font-weight: 500;
  font-size: 16px;
}
/deep/ .el-upload-dragger .el-upload__text em {
  color: #5452f6;
}
/deep/ .el-icon-upload:before {
  content: "";
  background: url("../../../../imgs/folder.png") center no-repeat;
  display: inline-block;
  width: 100px;
  height: 70px;
  margin-bottom: -30px;
}
/deep/ .el-upload-list__item:hover {
  background-color: #f5f4ff;
}
/deep/ .el-upload-list__item {
  line-height: 2.8;
}
/deep/ .el-upload-list__item .el-icon-close {
  top: 12px;
}
/deep/ .el-upload-list__item .el-icon-close-tip {
  opacity: 0;
}
.bottomBtn {
  margin-top: 36px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
