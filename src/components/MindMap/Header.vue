<template>
  <div class="MindMapHeader">
    <div class="leftBox">
      <img class="left" @click="goHome" src="./imgs/left.png" alt />
      <el-tooltip :disabled="isHideNameTooltip" :content="projectName" placement="bottom">
        <el-input
          class="mindMapName"
          @blur="changeMindMapName"
          @focus="focusMindMapName"
          v-model="projectName"
          placeholder
          maxlength="50"
        ></el-input>
      </el-tooltip>
      <div class="shu"></div>
      <div v-if="saveState == 0" class="saveBox">
        <img class="saveOk" src="./imgs/saveOk.svg" alt />
        <div>Saving...</div>
      </div>
      <div v-if="saveState == 1" class="saveBox">
        <img class="saveOk" src="./imgs/saveOk.svg" alt />
        <div>Successfully saved</div>
      </div>
      <div v-if="saveState == 2" class="saveBox">
        <img class="saveOk" src="./imgs/saveErr.svg" alt />
        <div>Save Faild</div>
      </div>
    </div>
    <div class="rightBox">
      <el-tooltip content="Import " placement="bottom">
        <img @click="clickImport" class="import" src="./imgs/import.png" alt type="file" />
      </el-tooltip>

      <el-tooltip content="Export " placement="bottom">
        <img @click="Export" class="export" src="./imgs/export.png" alt />
      </el-tooltip>

      <el-tooltip content="Save" placement="bottom">
        <img @click="Save" class="save" src="./imgs/save.png" alt />
      </el-tooltip>

      <Dropdown
        class="headImg"
        v-if="$store.state.loginStatus"
        @change="menuChange"
        :selectData="menuSelect.menuSelectData"
        :buttonIcon="menuSelect.buttonIcon"
        mouseLeaveHidden
        :buttonStyle="{ width: '40px' }"
        :styleItem="{ lineHeight: `48px`, marginBottom: `8px` }"
      >
        <template v-slot:header>
          <div class="setIcon">
            <img src="./imgs/header.svg" alt />
            <div class="setIconName">{{ $store.state.userInfo.email }}</div>
          </div>
        </template>
      </Dropdown>
      <el-button class="login" v-else type="primary" round @click="Tologin()">Log In</el-button>
    </div>
    <ImportFile
      :visible.sync="aboutImport.visible"
      @change="ImportSubmit"
      :title="aboutImport.title"
    ></ImportFile>
    <Login
      v-if="$store.state.modalStatus === '1'"
      @Cancel="loginCancel"
      @goRegister="loginGoRegister"
      @goReset="loginGoReset"
      @loginResponseSuccess="loginResponseSuccess"
      @loginResponseError="loginResponseError"
    ></Login>
    <Register
      v-if="$store.state.modalStatus === '2'"
      @Cancel="loginCancel"
      @goLogIn="Tologin"
      @registerSuccess="registerSuccess"
      @registerError="registerError"
    ></Register>
    <Reset
      v-if="$store.state.modalStatus === '3'"
      @Cancel="loginCancel"
      @goLogIn="Tologin"
      @changepasswordResponseSuccess="changepasswordResponseSuccess"
      @changepasswordResponseError="changepasswordResponseError"
    ></Reset>
  </div>
</template>


<script>
import merge from 'webpack-merge'
import { mapGetters, mapMutations } from "vuex";
import Dropdown from "@/components/selectMenu/index.vue"
import Register from "@/components/Register.vue";
import Reset from "@/components/Reset.vue";
import Login from "@/components/Login.vue";
import ImportFile from "@/views/Home/children/appendNew/children/importFile/index.vue"
import aLiOss from '@/mixin/aLiOss.js';
export default {
  name: "MindMapHeader",
  props: {
    projectName: {
      type: String,
      default: "Unnamed",
    },
    saveState: {
      type: Number,
      default: 2,
    },
  },
  computed: {
    ...mapGetters({
      minder: "getMinder",
      editor: "getEditor",
    }),
  },
  mixins: [aLiOss],
  data() {
    return {
      isHideNameTooltip:false,
      saveColor: "",
      aboutImport: {
        visible: false,
        title: "Import Local File"
      },
      menuSelect: {
        menuSelectData: [
          { id: "My Mindmap", defaultIcon: require("@/views/Home/imgs/blackInfo.png"), hoverIcon: require("@/views/Home/imgs/headerIcon.png") },
          { id: "Logout", defaultIcon: require("@/views/Home/imgs/log-out.svg"), hoverIcon: require("@/views/Home/imgs/log-out-fff.svg") },
        ],
        buttonIcon: require('@/views/Home/imgs/header.svg'),
      },
    }
  },
  methods: {
    ...mapMutations(["setHasRedo"]),
    changeMindMapName() {
      let that = this;
      if (this.projectName == "") {
        this.projectName = this.$parent.fileName
        return;
      }
      var reg = /\\|\/|\?|\:|\*|\*|\"|\<|\>|\|/g;
      this.projectName = this.projectName.replace(reg, "");
      this.projectName = this.projectName.trim() 
      // 判断是否已经登录
      if (this.$store.state.loginStatus) {
        this.$parent.fileName = this.projectName;
        this.$emit("Save");
      } else {
        this.$store.dispatch('setModalStatus', '1')
      }
      this.$router.push({
          query:merge(this.$route.query,{'fileName': this.$parent.fileName})
      })
      this.isHideNameTooltip = false;

      this.$parent.HeaderSaveInterval = window.setInterval(function () {
        that.$parent.HeaderSave();
      }, 30000);
    },
    focusMindMapName() {
      window.clearInterval(this.$parent.HeaderSaveInterval)
      this.isHideNameTooltip = true;
    },
    // 导入
    clickImport() {
      this.aboutImport.visible = true
      // // 判断是否已经登录
      // if (this.$store.state.loginStatus) {
      //   this.aboutImport.visible = true
      // } else {
      //   this.$store.dispatch('setModalStatus', '1')
      // }
    },
    // 导入部分 --
    ImportSubmit() {
      this.$message.success("修改成功！")
    },
    // 去登录
    Tologin() {
      this.$store.dispatch('setModalStatus', '1')
    },
    // 登录取消
    loginCancel() {
      this.$store.dispatch('setModalStatus', '0')
    },
    // 登录去注册
    loginGoRegister() {
      this.$store.dispatch('setModalStatus', '2')
    },
    // 登录去重置
    loginGoReset() {
      this.$store.dispatch('setModalStatus', '3')
    },
    // 登录成功
    loginResponseSuccess(data) {
      this.$store.dispatch('setModalStatus', '0')
      this.$store.dispatch('setLoginStatus', true)
      this.$store.dispatch('setUserInfo', data)
      this.$message.success('Login succeeded!')
    },
    // 登录失败
    loginResponseError() {

    },
    // 注册成功
    registerSuccess(data) {
      this.loginResponseSuccess(data)
    },
    // 注册失败
    registerError() {
    },
    // 重置密码成功
    changepasswordResponseSuccess() {
      this.Tologin()
    },
    // 重置密码失败
    changepasswordResponseError() {
    },
    async menuChange(item) {
      // item : 菜单按钮key  row：当前选中对象
      if (item === 'Logout') {
        this.toLoginOut()
      } else {
        await this.$router.push('/home/myMindmap')
        this.$parent.initMenuSelect()
      }
    },
    toLoginOut() {
      this.$message.success('logout successful!')
      this.$store.dispatch('setModalStatus', '0')
      this.$store.dispatch('setLoginStatus', false)
      localStorage.removeItem("token");
      this.$store.dispatch('setUserInfo', { email: "" })
      this.$router.push('/home/myMindmap')
    },
    Export() {
      // 判断是否已经登录
      if (this.$store.state.loginStatus) {
        this.$emit("Export");
      } else {
        this.$store.dispatch('setModalStatus', '1')
      }
    },
    Save() {
      // 判断是否已经登录
      if (this.$store.state.loginStatus) {
        this.$emit("Save");
      } else {
        this.$store.dispatch('setModalStatus', '1')
      }
    },
    goHome() {
      this.$router.push('/home/myMindmap')
    }
  },
  components: {
    ImportFile, Dropdown, Login, Register, Reset
  }
}
</script>

<style scoped>
.MindMapHeader {
  /* width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: none; */
  /* z-index: 1000; */
}
.leftBox {
  display: flex;
  align-items: center;
  position: absolute;
  height: 48px;
  border-radius: 41px;
  top: 20px;
  left: 24px;
  z-index: 98;
  background: white;
}
.left {
  height: 32px;
  left: 32px;
  margin-left: 16px;
  margin-right: 5px;
  cursor: pointer;
}
.mindMapName {
  width: 190px;
  font-weight: bold;
  font-size: 16px;
  color: #1d1d1f;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
.mindMapName >>> .el-input__inner {
  border: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0px;
}
.shu {
  height: 17px;
  width: 1px;
  background: rgba(0, 0, 0, 0.2);
  margin-right: 14px;
  margin-left: 12px;
}
.rightBox {
  display: flex;
  align-items: center;
  position: absolute;
  height: 48px;
  border-radius: 41px;
  top: 20px;
  right: 24px;
  z-index: 98;
  background: white;
}
.import {
  margin-left: 16px;
  height: 40px;
  left: 40px;
  cursor: pointer;
}
.export {
  height: 40px;
  left: 40px;
  cursor: pointer;
}
.saveBox {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #1d1d1f;
  margin-right: 24px;
}
.save {
  height: 40px;
  left: 40px;
  margin-right: 16px;
  cursor: pointer;
}
.login {
  height: 32px;
  width: 84px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 8px;
}
.headImg {
  margin-top: 3px;
  margin-right: 10px;
}
.setIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  word-wrap: break-word;
  padding: 0 13px;
  box-sizing: border-box;
}
.setIconName {
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  margin-top: 12px;
  margin-bottom: 20px;
  width: 251px;
  word-wrap: break-word;
  text-align: center;
  height: 30px;
}
</style>