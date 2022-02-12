<template>
  <div class="Login">
    <div class="mask"></div>
    <div class="section">
      <img class="close" @click="Cancel" src="./../assets/imgs/close.png" alt />
      <img
        class="PDNob"
        style="margin-bottom: 30px;margin-top: 10px;"
        src="../assets/imgs/PDNob.svg"
        alt
      />
      <div class="title">Sign in</div>
      <el-form class="apply-form first-form" :model="formData" :rules="rule" ref="form">
        <el-form-item label prop="UserName">
          <el-input
            onfocus="this.placeholder=''"
            onblur="this.placeholder='Email'"
            placeholder="Email"
            v-model="formData.UserName"
            @input="checkInput1"
            @blur="UserNameTrim"
          ></el-input>
        </el-form-item>
        <el-form-item label prop="UserPassword">
          <el-input
            onfocus="this.placeholder=''"
            onblur="this.placeholder='Password'"
            placeholder="Password"
            v-model="formData.UserPassword"
            :type="isShowPassword ? 'text' : 'password'"
            @input="checkInput2"
            @blur="UserPasswordTrim"
          >
            <div
              slot="suffix"
              :class="[isShowPassword ? 'eyes' : 'uneye']"
              autocomplete="auto"
              @click="isShowPassword = !isShowPassword"
            />
          </el-input>
        </el-form-item>

        <el-form-item label prop="Code" v-if="signInCount >= 3">
          <div class="codeBox">
            <el-input
              class="codeInput"
              onfocus="this.placeholder=''"
              onblur="this.placeholder='Verfication Code'"
              placeholder="Verfication Code"
              v-model="formData.Code"
              @input="checkInput3"
            ></el-input>
            <div class="code" @click="refreshCode">
              <VerificationCode
                :fresh="flag"
                :contentWidth="144"
                :contentHeight="48"
                @makedCode="getMakedCode"
              ></VerificationCode>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <el-button
        :class="isOk ? 'signUpButton' : 'unsignUpButton'"
        type="primary"
        @click="signIn"
        round
      >Sign in</el-button>
      <div class="bottomBox">
        <div class="goLogIn">
          Need an account?
          <span class="goLogInButton" @click="goRegister">Sign up now</span>
        </div>
        <div class="goReset" @click="goReset">Forgot your password?</div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import api from "@/request/api";
import VerificationCode from './VerificationCode.vue';
import tools from '@/utils/tools';
export default {
  name: "Login",
  components: {
    VerificationCode
  },
  computed: {

  },
  watch: {
    'formData.UserName': function (val) {
      if (this.signInCount >= 3) {
        if (this.formData.UserName && this.formData.UserPassword && this.formData.Code) {
          this.isOk = true
        } else {
          this.isOk = false
        }
      } else {
        if (this.formData.UserName && this.formData.UserPassword) {
          this.isOk = true
        } else {
          this.isOk = false
        }
      }
    },
    'formData.UserPassword': function (val) {
      if (this.signInCount >= 3) {
        if (this.formData.UserName && this.formData.UserPassword && this.formData.Code) {
          this.isOk = true
        } else {
          this.isOk = false
        }
      } else {
        if (this.formData.UserName && this.formData.UserPassword) {
          this.isOk = true
        } else {
          this.isOk = false
        }
      }
    },
    'formData.Code': function (val) {
      if (this.signInCount >= 3) {
        if (this.formData.UserName && this.formData.UserPassword && this.formData.Code) {
          if (this.formData.Code == this.code) {
            this.isOk = true
          } else {
            this.isOk = false
          }
        } else {
          this.isOk = false
        }
      } else {
        if (this.formData.UserName && this.formData.UserPassword) {
          this.isOk = true
        } else {
          this.isOk = false
        }
      }
    }
  },
  data() {
    const validateCode = (rule, value, callback) => {
      if (value != this.code) {
        callback(new Error("Wrong verification code"))
      } else {
        callback()
      }
    }
    const validateUserNameASCII = (rule, value, callback) => {
      var re = /[^a-zA-Z0-9!"#$%&'()*+,.\\\/:;<=>?@\[\] ^_`{|}~-]/g;
      this.formData.UserName = value.replace(re, "")
      callback()
    }
    const validateUserPasswordASCII = (rule, value, callback) => {
      var re = /[^a-zA-Z0-9!"#$%&'()*+,.\\\/:;<=>?@\[\] ^_`{|}~-]/g;
      this.formData.UserPassword = value.replace(re, "")
      callback()
    }
    return {
      signInCount: 0,
      isShowPassword: false,
      isOk: false,
      flag: true,
      code: '',
      formData: {
        UserName: '',
        UserPassword: '',
        Code: ''
      },
      rule: {
        UserName: [
          { validator: validateUserNameASCII, trigger: "change" },
          { required: true, message: 'Email address cannot be empty', trigger: 'blur' },
          {
            required: true,
            pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
            message: 'Email is invalid',
            trigger: 'blur',
          },
          {
            required: true,
            pattern: /^\S{1,100}$/,
            message: 'Email is invalid', trigger: 'blur'
          },
        ],
        UserPassword: [
          { validator: validateUserPasswordASCII, trigger: "change" },
          { required: true, message: 'Password cannot be empty', trigger: 'blur' }
        ],
        Code: [
          { required: true, message: 'Correct verification code cannot be empty', trigger: 'blur' },
          { validator: validateCode, trigger: "blur" }
        ],
      },
    };
  },
  mounted() {
    if (sessionStorage.getItem("resetTempEmail")) {
      this.formData.UserName = sessionStorage.getItem("resetTempEmail");
      this.formData.UserPassword = sessionStorage.getItem("resetTempPassword");
      sessionStorage.removeItem("resetTempEmail");
      sessionStorage.removeItem("resetTempPassword");
    }
    this.checkSignErrCount();
  },
  methods: {
    checkSignErrCount() {
      this.signInCount = window.localStorage.getItem("signInErrCount");
      var signInErrData = window.localStorage.getItem("signInErrData")
      if (signInErrData != moment().format('YYYY-MM-DD')) {
        localStorage.setItem("signInErrCount", 0)
        localStorage.setItem("signInErrData", moment().format('YYYY-MM-DD'))
        this.signInCount = 0;
      } else {
        if (this.signInCount >= 3) {
          setTimeout(() => {
            this.isOk = false;
            this.refreshCode();
          }, 500);
        }
      }
    },
    Cancel() {
      this.$emit("Cancel")
    },
    goRegister() {
      this.$emit("goRegister")
    },
    goReset() {
      this.$emit("goReset")
    },
    refreshCode() {
      this.flag = !this.flag;
    },
    getMakedCode(code) {
      this.code = code;
      this.checkInput3();
      this.isOk = false;
    },
    checkInput1() {
      this.$refs["form"].validateField(["UserName"], errMsg => {
        if (errMsg) {
          return false;
        } else {
          return true;
        }
      });

    },
    checkInput2() {
      this.$refs["form"].validateField(["UserPassword"], errMsg => {
        if (errMsg) {
          return false;
        } else {
          return true;
        }
      });
    },
    checkInput3() {
      this.$refs["form"].validateField(["Code"], errMsg => {
        if (errMsg) {
          return false;
        } else {
          return true;
        }
      });
    },
    signIn() {
      if (!this.isOk) {
        return;
      }

      let params = {
        userName: this.formData.UserName,
        passWord: this.formData.UserPassword
      }
      api.login(params).then(res => {
        console.log("登录成功成功", res);
        if (res.data.code == "200") {
          localStorage.setItem("token", res.data.data.token)
          localStorage.setItem("userInfo", JSON.stringify(res.data.data.userInfo))
          this.$emit("loginResponseSuccess", res.data.data.userInfo)
        } else {
          this.$emit("loginResponseError", res.msg)
        }
      }).catch(rej => {
        console.log("登录失败", rej);
        this.$emit("loginResponseError", '登录失败')
      }).finally(i => {
        let num = window.localStorage.getItem("signInErrCount");
        localStorage.setItem("signInErrCount", ++num)
        localStorage.setItem("signInErrData", moment().format('YYYY-MM-DD'))
        this.signInCount = num;
        if (this.signInCount == 3) {
          setTimeout(() => {
            this.isOk = false;
            this.refreshCode();
          }, 500);
        }
      })
    },
    UserNameTrim() {
      this.formData.UserName = tools.LTrim(tools.RTrim(this.formData.UserName))
    },
    UserPasswordTrim() {
      this.formData.UserPassword = tools.LTrim(tools.RTrim(this.formData.UserPassword))
    }

  },
};
</script>

<style scoped>
.Login {
  z-index: 99;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mask {
  height: 100%;
  width: 100%;
  background: black;
  opacity: 0.7;
  position: absolute;
  top: 0;
  left: 0;
}
.close {
  height: 22px;
  width: 22px;
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
}
.section {
  z-index: 100;
  width: 466px;
  background: #ffffff;
  border-radius: 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 32px;
}
.title {
  font-style: normal;
  font-weight: bold;
  font-size: 32px;
  line-height: 33px;
  text-transform: capitalize;
  color: #000000;
  margin-bottom: 32px;
}
.subtitle {
  margin-top: 32px;
  font-size: 14px;
  line-height: 20px;
  color: #1d1d1f;
}
.el-input {
  display: flex !important;
  height: 48px;
  border: 1px solid #dddfe5;
  box-sizing: border-box;
  border-radius: 30px;
  display: block;
  flex-direction: row;
  align-items: center;
}
.Login >>> .el-input__inner {
  border-radius: 30px;
  height: 48px;
  width: 100%;
  position: initial;
  font-size: 14px;
  color: #1d1d1f;
}
.verificationInput {
  width: 270px;
  height: 48px;
}
.verificationButton {
  margin-top: 16px;
  float: right;
  height: 46px;
  width: 144px;
  border-radius: 30px;
  background: #5452f6;
  border: 2px solid #5452f6;
}
.verificationBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.signUpButton {
  margin-top: 6px;
  height: 56px;
  background: #5452f6;
  border-radius: 40px;
  border: none;
  font-weight: bold;
  font-size: 18px;
  font-family: "Inter-Bold";
}
.unsignUpButton {
  margin-top: 6px;
  height: 56px;
  background: #5452f6;
  opacity: 0.3;
  border-radius: 40px;
  border: none;
  font-weight: bold;
  font-size: 18px;
  font-family: "Inter-Bold";
}
.goLogIn {
  font-size: 14px;
  line-height: 20px;
  color: #1d1d1f;
  text-align: center;
}
.goLogInButton {
  color: #5452f6;
  cursor: pointer;
  text-decoration: underline;
}
.goRules {
  margin-top: 32px;
  font-size: 12px;
  line-height: 16px;
  color: rgba(29, 29, 31, 0.5);
}

.goRulesButton {
}
.goReset {
  font-size: 14px;
  line-height: 20px;
  color: #5452f6;
  cursor: pointer;
  text-decoration: underline;
}

.Login >>> input::-webkit-input-placeholder {
  font-size: 14px;
  line-height: 20px;
  color: rgba(29, 29, 31, 0.3);
}
.Login >>> input:-moz-placeholder {
  font-size: 14px;
  line-height: 20px;
  color: rgba(29, 29, 31, 0.3);
}
.Login >>> input:-ms-input-placeholder {
  font-size: 14px;
  line-height: 20px;
  color: rgba(29, 29, 31, 0.3);
}

.Login >>> .el-input__suffix {
  display: flex;
  justify-content: center;
  align-items: center;
}
.Login >>> .el-form-item {
  margin-bottom: 32px;
}
.uneye {
  margin-right: 10px;
  border: none;
  background: url("./MindMap/imgs/uneye.png") no-repeat;
  height: 32px;
  width: 32px;
  background-size: 32px 32px;
}
.eyes {
  margin-right: 10px;
  border: none;
  background: url("./MindMap/imgs/eyes.png") no-repeat;
  height: 32px;
  width: 32px;
  background-size: 32px 32px;
}
.bottomBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}
.codeInput {
  width: 298px;
}
.codeBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.code {
  width: 144px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
}
</style>
