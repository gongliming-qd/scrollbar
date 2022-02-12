<template>
  <div class="Register">
    <div class="mask"></div>
    <div class="section">
      <img class="close" @click="Cancel" src="./../assets/imgs/close.png" alt />
      <img
        class="PDNob"
        style="margin-bottom: 30px;margin-top: 10px;"
        src="../assets/imgs/PDNob.svg"
        alt
      />
      <div class="title">Sign up</div>
      <div class="subtitle">Create New Account</div>

      <el-form class="apply-form first-form" :model="formData" :rules="rule" ref="form">
        <el-form-item label prop="UserEmail">
          <el-input
            onfocus="this.placeholder=''"
            onblur="this.placeholder='Email'"
            placeholder="Email"
            v-model="formData.UserEmail"
            @input="checkInput1"
            @blur="UserEmailTrim"
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

        <el-form-item label prop="EmailCode">
          <div class="verificationBox">
            <el-input
              class="verificationInput"
              onfocus="this.placeholder=''"
              onblur="this.placeholder='Verfication Code'"
              placeholder="Verfication Code"
              v-model="formData.EmailCode"
              @input="checkInput3"
            ></el-input>
            <el-button
              :class="isSend ? 'verificationButton' : 'unverificationButton'"
              type="primary"
              @click="emailcode"
              round
            >{{ EmailCodeButtonContent }}</el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-button
        :class="isOk ? 'signUpButton' : 'unsignUpButton'"
        type="primary"
        @click="register"
        round
      >sign up</el-button>
      <div class="goLogIn">
        Already have an account?
        <span class="goLogInButton" @click="goLogIn">Log in</span>
      </div>
      <div class="goRules">
        <el-checkbox class="isAgree" v-model="isAgree"></el-checkbox>By creating an account, you agree to
        <span
          class="goRulesButton"
          @click="goTermsOfService"
        >Terms of Service</span>and
        <span class="goRulesButton" @click="goPrivacyPolicy">Privacy Policy.</span>
      </div>
    </div>
  </div>
</template>

<script>
import tools from '@/utils/tools';
import api from "@/request/api";
export default {
  name: "Register",
  computed: {},
  data() {
    const validateUserNameASCII = (rule, value, callback) => {
      var re = /[^a-zA-Z0-9!"#$%&'()*+,.\\\/:;<=>?@\[\] ^_`{|}~-]/g;
      this.formData.UserEmail = value.replace(re, "")
      callback()
    }
    const validateUserPasswordASCII = (rule, value, callback) => {
      var re = /[^a-zA-Z0-9!"#$%&'()*+,.\\\/:;<=>?@\[\] ^_`{|}~-]/g;
      this.formData.UserPassword = value.replace(re, "")
      callback()
    }
    return {
      isShowPassword: false,
      isOk: false,
      EmailCodeButtonContent: "Send code",
      EmailCodeButtonTime: 60,
      isSend: true,
      isAgree: false,
      formData: {
        UserEmail: '',
        UserPassword: '',
        EmailCode: '',
      },
      rule: {
        UserEmail: [
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
          }
        ],
        UserPassword: [
          { validator: validateUserPasswordASCII, trigger: "change" },

          { required: true, message: 'Password cannot be empty', trigger: 'blur' },
          {
            required: true,
            pattern: /^(?=.*?\d)(?=.*?[a-z])(?=.*?[A-Z])[\da-zA-Z@$!%*#_~?&^]{8,20}$/,
            message: 'Password must be 8-20 characters and contain numbers, upper and lowercase letters.',
            trigger: 'blur',
          }
        ],
        EmailCode: [
          { required: true, message: 'Code cannot be empty', trigger: 'blur' },
          {
            required: true,
            pattern: /^\d{6}$/,
            message: 'Please enter a valid code',
            trigger: 'blur',
          }
        ]
      },
      EmailTempToken: ''
    };
  },
  watch: {
    'formData.UserEmail': function (val) {
      if (this.formData.UserEmail && this.formData.UserPassword && this.formData.EmailCode) {
        this.isOk = true
      } else {
        this.isOk = false
      }
    },
    'formData.UserPassword': function (val) {
      if (this.formData.UserEmail && this.formData.UserPassword && this.formData.EmailCode) {
        this.isOk = true
      } else {
        this.isOk = false
      }
    },
    'formData.EmailCode': function (val) {
      if (this.formData.UserEmail && this.formData.UserPassword && this.formData.EmailCode) {
        this.isOk = true
      } else {
        this.isOk = false
      }
    }
  },
  mounted() {
  },
  methods: {
    Cancel() {
      this.$emit("Cancel")
    },
    goLogIn() {
      this.$emit("goLogIn")
    },
    checkInput1() {
      this.$refs["form"].validateField(["UserEmail"], errMsg => {
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
      this.$refs["form"].validateField(["EmailCode"], errMsg => {
        if (errMsg) {
          return false;
        } else {
          return true;
        }
      });
    },
    emailcode() {
      this.$refs["form"].validateField(["UserEmail"], errMsg => {
        if (errMsg) {
          return false;
        } else {
          if (!this.isSend) {
            return;
          }
          let data = {
            UserName: this.formData.UserEmail
          }
          api.emailcode(data).then(res => {
            let clock = window.setInterval(() => {
              if (this.EmailCodeButtonTime < 1) {
                this.EmailCodeButtonContent = 'Send code';
                this.EmailCodeButtonTime = 60;
                this.isSend = true;
                clearInterval(clock);
              } else {
                this.EmailCodeButtonContent = `Sent (${this.EmailCodeButtonTime--}s)`;
                this.isSend = false
              }
            }, 1000)
            console.log("邮箱验证码发送成功", res);
            this.EmailTempToken = res.data.data.token;
          }).catch(rej => {
            console.log("邮箱验证码发送失败", rej);
          })
        }
      });
    },
    register() {
      let that = this;
      if (!this.isAgree) {
        this.$message({
          showClose: true,
          message: "You must agree to the Terms of Service",
          type: "warning",
          duration: 5000,
        });
        return;
      }
      if (!this.isOk) {
        return;
      }
      let data = {
        EmailTempToken: this.EmailTempToken,
        EmailCode: this.formData.EmailCode,
        UserName: this.formData.UserEmail,
        PassWord: this.formData.UserPassword
      }
      api.register(data).then(res => {
        console.log("注册成功", res);
        if (res.data.code == 200) {
          localStorage.setItem("token", res.data.data.token)
          localStorage.setItem("userInfo", JSON.stringify(res.data.data.userInfo))
          that.$message({
            showClose: true,
            message: "success",
            type: "success",
            duration: 5000,
          });

          let params = {
            userName: that.formData.UserEmail,
            passWord: that.formData.UserPassword
          }
          api.login(params).then(loginRes => {
            console.log("登录成功成功", loginRes);
            if (loginRes.data.code == "200") {
              localStorage.setItem("token", loginRes.data.data.token)
              localStorage.setItem("userInfo", JSON.stringify(loginRes.data.data.userInfo))
              that.$emit("registerSuccess", loginRes.data.data.userInfo)

            } else {
              that.$emit("registerError", "自动登录失败")
            }
          }).catch(loginRej => {
            console.log("登录失败", loginRej);
            that.$emit("registerError", "自动登录失败")
          })

        } else {
          that.$emit("registerError")
        }
      }).catch(rej => {
        that.$emit("registerError")
        console.log("注册失败", rej);
      })
    },
    goTermsOfService() {
      window.open("http://www.baidu.com", "_blank");
    },
    goPrivacyPolicy() {
      window.open("http://www.baidu.com", "_blank");
    },
    UserEmailTrim() {
      this.formData.UserEmail = tools.LTrim(tools.RTrim(this.formData.UserEmail))
    },
    UserPasswordTrim() {
      this.formData.UserPassword = tools.LTrim(tools.RTrim(this.formData.UserPassword))
    }
  },
};
</script>

<style scoped>
.Register {
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
}
.subtitle {
  margin-top: 32px;
  font-size: 14px;
  line-height: 20px;
  color: #1d1d1f;
  margin-bottom: 16px;
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
.Register >>> .el-input__inner {
  border-radius: 30px;
  height: 48px;
  width: 100%;
  position: initial;
  font-size: 14px;
  color: #1d1d1f;
}
.verificationInput {
  width: 298px;
  height: 48px;
}
.verificationButton {
  float: right;
  height: 46px;
  width: 144px;
  border-radius: 30px;
  background: #5452f6;
  border: 2px solid #5452f6;
}
.unverificationButton {
  opacity: 0.3;
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
  margin-top: 16px;
}
.goLogInButton {
  color: #5452f6;
  text-decoration: underline;
  cursor: pointer;
}
.goRules {
  margin-top: 32px;
  font-size: 12px;
  line-height: 16px;
  color: rgba(29, 29, 31, 0.5);
}
.goRulesButton {
  color: #5452f6;
  text-decoration: underline;
  cursor: pointer;
}

.Register >>> input::-webkit-input-placeholder {
  font-size: 14px;
  line-height: 20px;
  color: rgba(29, 29, 31, 0.3);
}
.Register >>> input:-moz-placeholder {
  font-size: 14px;
  line-height: 20px;
  color: rgba(29, 29, 31, 0.3);
}
.Register >>> input:-ms-input-placeholder {
  font-size: 14px;
  line-height: 20px;
  color: rgba(29, 29, 31, 0.3);
}
.Register >>> .el-checkbox__inner {
  height: 20px;
  width: 20px;
  margin-right: 10px;
}
.Register >>> .el-checkbox__inner:after {
  box-sizing: content-box;
  content: "";
  border: 1px solid #fff;
  border-left: 0;
  border-top: 0;
  height: 10px;
  left: 7px;
  position: absolute;
  top: 2px;
  transform: rotate(45deg) scaleY(0);
  width: 4px;
  transition: transform 0.15s ease-in 0.05s;
  transform-origin: center;
  transform: rotate(45deg) scaleY(1);
}
.Register >>> .el-form-item {
  margin-bottom: 32px;
}
.Register >>> .el-input__suffix {
  display: flex;
  justify-content: center;
  align-items: center;
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
</style>
