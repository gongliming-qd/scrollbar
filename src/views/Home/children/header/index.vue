<template>
  <div class="MindMapHeader">
    <div class="leftBox">
      <img
        class="logo"
        src="../../imgs/logo.png"
        alt
      />
    </div>
    <div class="rightBox">
      <Dropdown
        v-if="$store.state.loginStatus"
        @change="menuChange"
        :selectData="menuSelect.menuSelectData"
        :buttonIcon="menuSelect.buttonIcon"
        :boxStyle="{'box-shadow': '0px 4px 12px rgba(0, 0, 0, 0.2)','border-radius': '16px'}"
        mouseLeaveHidden
        :buttonStyle="{width:'40px'}"
        :styleItem="{lineHeight:`48px`, marginBottom:`8px`}"
      >
        <template v-slot:header>
          <div class="setIcon">
            <img
              src="../../imgs/header.svg"
              alt=""
            >
            <div class="name">
              {{$store.state.userInfo.email}}
            </div>
          </div>
        </template>
      </Dropdown>
      <el-button
        v-else
        type="primary"
        round
        @click="Tologin()"
      >Log In</el-button>
    </div>
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
// 下拉菜单
import Dropdown from "@/components/selectMenu/index.vue"
import Register from "@/components/Register.vue";
import Reset from "@/components/Reset.vue";
import Login from "@/components/Login.vue";
export default {
  name: "Header",
  components: {
    Dropdown, Login, Register, Reset
  },
  data () {
    return {
      modalStatus: '0',
      loginStatus: false,
      userInfo: {
        email: "",
      },
      menuSelect: {
        menuSelectData: [
          { id: "My Mindmap", defaultIcon: require("@/views/Home/imgs/blackInfo.png"), hoverIcon: require("@/views/Home/imgs/headerIcon.png") },
          { id: "Logout", defaultIcon: require("@/views/Home/imgs/log-out.svg"), hoverIcon: require("@/views/Home/imgs/log-out-fff.svg") },
        ],
        buttonIcon: require('@/views/Home/imgs/header.svg'),
      },
    };
  },
  created () {
    this.$store.dispatch('setModalStatus', '0')
  },
  methods: {
    // 去登录
    Tologin () {
      this.$store.dispatch('setModalStatus', '1')
    },
    // 登录取消
    loginCancel () {
      this.$store.dispatch('setModalStatus', '0')
    },
    // 登录去注册
    loginGoRegister () {
      this.$store.dispatch('setModalStatus', '2')
    },
    // 登录去重置
    loginGoReset () {
      this.$store.dispatch('setModalStatus', '3')
    },
    // 登录成功
    loginResponseSuccess (data) {
      this.$store.dispatch('setModalStatus', '0')
      this.$store.dispatch('setLoginStatus', true)
      this.$store.dispatch('setUserInfo', data)
      this.$message.success('Login succeeded!')
    },
    // 登录失败
    loginResponseError () {

    },

    // 注册成功
    registerSuccess (data) {
      this.loginResponseSuccess(data)
    },
    // 注册失败
    registerError () {
    },

    // 重置密码成功
    changepasswordResponseSuccess () {
      this.Tologin()
    },
    // 重置密码失败
    changepasswordResponseError () {
    },
    async menuChange (item) {
      // item : 菜单按钮key  row：当前选中对象
      if (item === 'Logout') {
        this.toLoginOut()
      } else {
        await this.$router.push('/home/myMindmap')
        this.$parent.initMenuSelect()
      }
    },
    toLoginOut () {
      this.$message.success('logout successful!')
      this.$store.dispatch('setModalStatus', '0')
      this.$store.dispatch('setLoginStatus', false)
      localStorage.removeItem("token");
      this.$store.dispatch('setUserInfo', { email: "" })
    }
  },
};
</script>

<style scoped lang="less">
.MindMapHeader {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  .leftBox {
    display: flex;
    align-items: center;
    .logo {
      height: 40px;
      width: 40px;
      margin-left: 24px;
    }
  }
  .rightBox {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
}
.setIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  word-wrap: break-word;
  padding: 0 13px;
  box-sizing: border-box;
  .name {
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
}
</style>
