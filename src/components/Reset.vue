<template>
    <div class="Reset">
        <div class="mask"></div>
        <div class="section">
            <img class="close" @click="Cancel" src="./../assets/imgs/close.png" alt />
            <img
                class="PDNob"
                style="margin-bottom: 30px;margin-top: 10px;"
                src="../assets/imgs/PDNob.svg"
                alt
            />
            <div class="title">Forget Password</div>
            <el-form class="apply-form first-form" :model="formData" :rules="rule" ref="form">
                <el-form-item label prop="UserEmail">
                    <el-input
                        onfocus="this.placeholder=''"
                        onblur="this.placeholder='Enter Your Valid Email'"
                        placeholder="Enter Your Valid Email"
                        v-model="formData.UserEmail"
                        @input="checkInput1"
                        @blur="UserEmailTrim"
                    ></el-input>
                </el-form-item>
                <el-form-item label prop="EmailCode">
                    <div class="verificationBox">
                        <el-input
                            class="verificationInput"
                            onfocus="this.placeholder=''"
                            onblur="this.placeholder='Email Verification Code'"
                            placeholder="Email Verification Code"
                            v-model="formData.EmailCode"
                            @input="checkInput2"
                        ></el-input>
                        <el-button
                            :class="isSend ? 'verificationButton' : 'unverificationButton'"
                            type="primary"
                            @click="emailcode"
                            round
                        >{{ EmailCodeButtonContent }}</el-button>
                    </div>
                </el-form-item>

                <el-form-item label prop="UserPassword">
                    <el-input
                        onfocus="this.placeholder=''"
                        onblur="this.placeholder='Reset Password'"
                        placeholder="Reset Password"
                        v-model="formData.UserPassword"
                        :type="isShowPassword ? 'text' : 'password'"
                        @input="checkInput3"
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
            </el-form>

            <el-button
                :class="isOk ? 'signUpButton' : 'unsignUpButton'"
                type="primary"
                @click="changepassword"
                round
            >OK</el-button>
            <div class="goLogIn">
                Back To
                <span class="goLogInButton" @click="goLogIn">Login in</span>
            </div>
        </div>
    </div>
</template>

<script>
import api from "@/request/api";
import tools from '@/utils/tools';
export default {
    name: "Login",
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
            formData: {
                UserEmail: '',
                UserPassword: '',
                EmailCode: ''
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
                        message: 'Please enter code',
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
            this.$refs["form"].validateField(["EmailCode"], errMsg => {
                if (errMsg) {
                    return false;
                } else {
                    return true;
                }
            });
        },
        checkInput3() {
            this.$refs["form"].validateField(["UserPassword"], errMsg => {
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
        changepassword() {
            if (!this.isOk) {
                return;
            }
            let data = {
                EmailTempToken: this.EmailTempToken,
                PassWord: this.formData.UserPassword,
                EmailCode: this.formData.EmailCode
            }
            api.changepassword(data).then(res => {
                console.log("更改密码成功", res);
                if (res.data.code == 200) {
                    sessionStorage.setItem("resetTempEmail", this.formData.UserEmail);
                    sessionStorage.setItem("resetTempPassword", this.formData.UserPassword);
                    this.$emit("changepasswordResponseSuccess")
                } else {
                    this.$message({
                        showClose: true,
                        message: res.data.msg,
                        type: "error",
                    });
                    this.$emit("changepasswordResponseError")
                }
            }).catch(rej => {
                console.log("更改密码失败", rej);
                // this.$message({
                //     showClose: true,
                //     message: rej.data.msg,
                //     type: "error",
                // });
                this.$emit("changepasswordResponseError")
            })
        },
        errorInput(ele) {
            ele.css("borderColor", '#db2029');
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
.Reset {
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
    /* margin-top: 16px; */
}
.Reset >>> .el-input__inner {
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
}

.Reset >>> input::-webkit-input-placeholder {
    font-size: 14px;
    line-height: 20px;
    color: rgba(29, 29, 31, 0.3);
}
.Reset >>> input:-moz-placeholder {
    font-size: 14px;
    line-height: 20px;
    color: rgba(29, 29, 31, 0.3);
}
.Reset >>> input:-ms-input-placeholder {
    font-size: 14px;
    line-height: 20px;
    color: rgba(29, 29, 31, 0.3);
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
.Reset >>> .el-form-item {
    margin-bottom: 32px;
}
.Reset >>> .el-input__suffix {
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
