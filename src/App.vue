<!--
 * @Author: glm
 * @Date: 2022-01-12 14:20:41
 * @LastEditors: your Name
 * @LastEditTime: 2022-01-24 10:39:33
 * @Description: 
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import CheckBrowser from "./utils/CheckBrowser";
 
export default {
  name: "app",
  mounted() {
    var userBrowser = CheckBrowser.CheckBrowser();
    if (
      userBrowser != "Chrome" &&
      userBrowser != "Firefox" &&
      userBrowser != "Opera" &&
      userBrowser != "Safari" &&
      userBrowser != "Opera"
    ) {
      this.$router.push({ path: "/errorBrowser" });
    }
  },
  created () {
    this.offlineF = () => {
      this.$store.dispatch('setnowNetwork', false)
    }
    this.onlineF = () => {
      this.$store.dispatch('setnowNetwork', true)

    }
    window.addEventListener('offline', this.offlineF)
    window.addEventListener('online', this.onlineF);
  },
  beforeDestroy () {
    window.addEventListener('offline', this.offlineF);
    window.addEventListener('online', this.offlineF);
  },
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
body {
  font-family: "Inter-Regular";
}
.el-message {
  background: #eaefff !important;
  padding: 15px 24px !important;
  width: 446px !important;
  border-radius: 58px !important;
  border: none !important;
  font-size: 14px !important;
  color: #000000 !important;
  font-weight: bold !important;
}
.el-message--warning {
}
.el-message__content {
  color: #000000 !important;
}
.el-icon-warning {
  color: #faad14;
}
.el-icon-success {
  color: #52c41a;
}
.el-icon-error {
  color: #ff7172;
}


</style>
