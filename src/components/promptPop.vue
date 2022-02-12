<template>
  <div class="promptPop" v-if="isShow">
    <div class="mask"></div>
    <div class="section">
      <img
        class="close"
        @click="Cancel"
        src="./../assets/imgs/close.png"
        alt=""
      />
      <span class="sectionTitle">{{promptPopSectionTitle}}</span>
      <span class="sectionText"
        >{{promptPopSectionText}}</span
      >
      <div class="sectionButton">
        <div @click="Cancel" class="sectionButtonCancel">Cancel</div>
        <div @click="ok" class="sectionButtonConfirm">OK</div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "promptPop",
  computed: {},
  data() {
    return {
      isShow: false,
      promptPopSectionTitle:'',
      promptPopSectionText:''
    };
  },
  mounted(){
  },
  methods: {
    Cancel() {
      this.isShow = false;
    },
    ok() {
      this.$emit("ok");
    },
  },
};
</script>

<style scoped>
.promptPop {
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
  height: 20px;
  width: 20px;
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
}
.section {
  z-index: 100;
  width: 518px;
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  position: relative;
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
}
.sectionTitle {
  font-size: 14px;
  line-height: 20px;
  color: #16192c;
  display: inline-block;
  font-weight: bold;
  margin-bottom: 12px;
}
.sectionText {
  font-size: 14px;
  color: #425466;
  overflow-wrap: break-word;
}
.sectionButton {
  position: absolute;
  right: 24px;
  bottom: 24px;
  display: flex;
}
.sectionButtonCancel {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 124px;
  height: 36px;
  border: 1px solid #5452f6;
  box-sizing: border-box;
  border-radius: 20px;
  font-size: 14px;
  line-height: 20px;
  color: #5452f6;
  cursor: pointer;
}
.sectionButtonConfirm {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 122px;
  height: 36px;
  background: #5452f6;
  border-radius: 20px;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  margin-left: 8px;
  cursor: pointer;
}
</style>
