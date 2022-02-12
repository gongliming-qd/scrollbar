<template>
  <div class="MindMapExport" v-if="isShow">
    <div class="mask"></div>
    <div class="section">
      <img class="close" @click="Cancel" src="./../../assets/imgs/close.png" alt />
      <span class="sectionTitle">Export As</span>
      <div class="sectionFileName">
        <span>File Name</span>
        <input
          v-model="projectName"
          type="text"
          @change="changeProjectName($event)"
          @input="projectNameInput"
        />
      </div>
      <div class="sectionFormat">
        <div
          @click="changeCurrentFormat('Picture')"
          :class="currentFormat == 'Picture' ? 'sectionFormatSelected' : ''"
        >
          <img src="./imgs/Picture.png" alt />
          <div>Picture</div>
        </div>
        <div
          @click="changeCurrentFormat('PDF')"
          :class="currentFormat == 'PDF' ? 'sectionFormatSelected' : ''"
        >
          <img src="./imgs/PDF.png" alt />
          <div>PDF</div>
        </div>
        <div
          @click="changeCurrentFormat('PDmind')"
          :class="currentFormat == 'PDmind' ? 'sectionFormatSelected' : ''"
        >
          <img src="./imgs/PDmind.png" alt />
          <div>PDmind</div>
        </div>
      </div>
      <div class="sectionSelectType">
        <span class="sectionSelectTypeTitle">Select Type</span>
        <div
          class="sectionSelectTypeItem"
          :class="
            currentSelectType == item ? 'sectionSelectTypeItemSelected' : ''
          "
          v-for="(item, index) in selectTypeList"
          :key="index"
          @click="changeCurrentSelectType(item)"
        >{{ item }}</div>
      </div>
      <div
        class="sectionSelectTypeInstruction"
        v-if="currentFormat == 'PDmind'"
      >Support PDmind Data Structure (Importable)</div>
      <div class="sectionButton">
        <div @click="Cancel" class="sectionButtonCancel">Cancel</div>
        <div @click="Export" class="sectionButtonConfirm">Export</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "MindMapExport",
  computed: {
    ...mapGetters({
      minder: "getMinder",
      editor: "getEditor",
    }),
  },
  data() {
    return {
      isShow: false,
      currentFormat: "Picture",
      currentSelectType: "JPG",
      selectTypeList: ["JPG", "PNG"],
      projectName: "",
      originalProjectName:""
    };
  },
  methods: {
    show(e) {
      this.isShow = true;
      this.projectName = e.name;
      this.originalProjectName = e.name
    },
    hide() {
      this.isShow = false;
    },
    changeCurrentFormat(e) {
      this.currentFormat = e;
      switch (e) {
        case "Picture":
          this.selectTypeList = ["JPG", "PNG"];
          this.currentSelectType = this.selectTypeList[0];
          break;
        case "PDF":
          this.selectTypeList = ["PDF"];
          this.currentSelectType = this.selectTypeList[0];
          break;
        case "PDmind":
          this.selectTypeList = ["PDmind"];
          this.currentSelectType = this.selectTypeList[0];
          break;
        default:
          this.selectTypeList = [];
          break;
      }
    },
    changeCurrentSelectType(e) {
      this.currentSelectType = e;
    },
    Export() {
      this.$emit("Export", this.currentSelectType, this.projectName);
    },
    Cancel() {
      this.isShow = false;
    },
    changeProjectName(e) {
      if (this.projectName == "") {
        this.projectName = this.originalProjectName;
      }
      this.projectName = this.projectName.trim() 
      if(this.projectName.length>50){
        return
      }
      if(/^[^\\/*?:<>|"]*$/.test(this.projectName)){
        return
      }
      this.projectName = this.projectName.trim(" ");
    },
    projectNameInput() {
      if (this.projectName.indexOf("\"text\":\"") > -1) {
        this.projectName = this.projectName.split("\"text\":\"")[1].split("\"")[0];
      }
      this.projectName = this.projectName.replace(/[\\:*?"<>/|]/g, "");
      if (this.projectName.length >= 50) {
        this.projectName = this.projectName.substring(0, 50);
      }
    },
  },
};
</script>

<style scoped>
.MindMapExport {
  z-index: 99;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999999999999999;
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
  height: 252px;
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  position: relative;
  padding-bottom: 60px;
}
.sectionTitle {
  font-size: 14px;
  line-height: 20px;
  color: #16192c;
  display: inline-block;
  font-weight: bold;
}
.sectionFileName {
  margin-top: 16px;
  height: 20px;
  display: flex;
}
.sectionFileName span {
  white-space: nowrap;
  margin-right: 16px;
}
.sectionFileName input {
  border: none;
  border-bottom: 1px solid #e8e8e8;
  width: 100%;
  color: rgba(22, 25, 44, 0.7);
}
.sectionFileName input:focus {
  outline: none;
  border-bottom: 1px solid #e8e8e8;
  color: rgba(22, 25, 44, 0.7);
}
.sectionFormat {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
.sectionFormat > div {
  width: 168px;
  height: 90px;
  background: #ececff;
  /* border: 1.5px solid #5452F6; */
  box-sizing: border-box;
  border-radius: 6.42308px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  line-height: 17px;
  color: #1d1d1f;
  cursor: pointer;
}
.sectionFormatSelected {
  border: 2px solid #5452f6;
}
.sectionSelectType {
  margin-top: 24px;
  display: flex;
}
.sectionSelectTypeTitle {
  font-size: 12px;
  line-height: 17px;
  color: #000000;
  margin-top: 2px;
}
.sectionSelectTypeItem {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 24px;
  border: 1px solid rgba(29, 29, 31, 0.5);
  box-sizing: border-box;
  border-radius: 4px;
  margin-left: 8px;
  font-size: 12px;
  line-height: 17px;
  color: rgba(29, 29, 31, 0.5);
  cursor: pointer;
}
.sectionSelectTypeItemSelected {
  border: 1px solid #5452f6;
  font-size: 12px;
  color: #5452f6;
  cursor: pointer;
}
.sectionSelectTypeInstruction {
  margin-top: 8px;
  font-size: 12px;
  line-height: 17px;
  color: rgba(0, 0, 0, 0.5);
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
.sectionButtonCancel:hover{
  background-color: #5452f6;
  color: white;
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
.sectionButtonConfirm:hover{
  background-color: #3734ff;
}
</style>
