<template>
  <div class="MindMapHeader">
    <div class="leftBox">
      <img class="logo" src="./imgs/logo.png" alt />
      <el-tooltip :content="projectName" placement="bottom">
        <input
          v-if="hasProjectName"
          class="projectName"
          type="text"
          placeholder="Unnamed"
          v-model="projectName"
          @change="changeProjectName($event)"
          @input="projectNameInput"
        />
      </el-tooltip>
      <div @click="demo">demo</div>
      <div @click="demo1">demo1</div>

      <el-tooltip v-if="hasSave" content="Save" placement="bottom">
        <img @click="Save" class="save" :src="require(`./imgs/${saveColor}save.png`)" alt />
      </el-tooltip>
    </div>
    <div class="rightBox">
      <el-tooltip v-if="hasImport" content="Import " placement="bottom">
        <div class="importBox">
          <img class="import" src="./imgs/import.png" alt type="file" />
          <input
            class="choiceFileInput"
            type="file"
            ref="clearFile"
            accept=".PDmind"
            @change="getFile($event)"
          />
        </div>
      </el-tooltip>

      <el-tooltip v-if="hasExport" content="Export " placement="bottom">
        <img @click="Export" class="export" src="./imgs/export.png" alt />
      </el-tooltip>

      <div v-if="hasMyfile" @click="goMyFiles" class="myFiles">
        <img src="./imgs/myFiles.png" alt />
        <span>My Files</span>
      </div>

      <div v-if="hasAdd" class="add" @click="add">＋ New</div>
    </div>
    <promptPop ref="promptPop" @ok="ok"></promptPop>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import moment from "moment";
import tool from "../../utils/tools";
import promptPop from "../../components/promptPop.vue";
import aLiOss from '@/mixin/aLiOss.js';
export default {
  name: "MindMapHeader",
  components: { promptPop },
  props: {
    hasProjectName: {
      type: Boolean,
      default: false,
    },
    hasSave: {
      type: Boolean,
      default: false,
    },
    hasExport: {
      type: Boolean,
      default: false,
    },
    hasImport: {
      type: Boolean,
      default: false,
    },
    hasMyfile: {
      type: Boolean,
      default: true,
    },
    hasAdd: {
      type: Boolean,
      default: true,
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
      projectName: "Unnamed",
      saveColor: "",
      okUUID: ""
    };
  },
  async mounted() {
  },
  methods: {
    ...mapMutations(["setHasRedo"]),
    getFile(event) {
      let files = event.target.files;
      if (files[0].name.split(".")[files[0].name.split(".").length - 1].toLowerCase() != "pdmind") {
        this.$message({
          showClose: true,
          message: `This feature does not support this type of file.<br/>Please upload PDmind file.`,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
        return;
      }
      var reader = new FileReader();
      reader.readAsText(files[0], "UTF-8");
      reader.onload = function (evt) {
        var fileString = evt.target.result;
        if (fileString == "") {
          this.$message({
            showClose: true,
            message: `The imported file is abnormal. Please check and try again.`,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
          return;
        }
        var UUID = tool.makeUUID();
        let storageJson = {
          name: files[0].name.substring(0, files[0].name.length - 7),
          createdTime: moment().format("YYYY/MM/DD HH:mm:ss"),
          updateTime: moment().format("YYYY/MM/DD HH:mm:ss"),
          json: fileString,
          UUID: UUID,
          isFirstChangeRootText: false,
        };
        if (storageJson.name.length >= 50) {
          storageJson.name = storageJson.name.substring(0, 50);
        }
        if (tool.getFileSize(fileString) >= 2 - tool.getLocalStorageAllSize()) {
          window.sessionStorage.setItem(UUID, JSON.stringify(storageJson));
        } else {
          window.localStorage.setItem(UUID, JSON.stringify(storageJson));
        }
        this.okUUID = UUID;
        this.showPromptPop();


        event.target.value = "";
      }.bind(this);

    },
    showPromptPop() {
      this.$refs.promptPop.promptPopSectionTitle = "Are you sure to create a new page after importing the file?";
      this.$refs.promptPop.promptPopSectionText = "";
      this.$refs.promptPop.isShow = true;
    },
    ok() {
      const { href } = this.$router.resolve({
        path: "/mindMap",
        query: { UUID: this.okUUID },
      });
      window.open(href, "_blank")
      this.$refs.promptPop.isShow = false;
    },
    Export() {
      this.$emit("Export");
    },
    add() {
      const { href } = this.$router.resolve({
        path: "/mindMap"
      });
      window.open(href, "_blank")
    },
    async demo() {
      let base64 = await this.minder.exportData("json");
      var blob = new Blob([base64]);
      let files = new window.File([blob], "pdmind", { type: "text/plain" })
      let filesName = "测试";


      const path = await this.saveToOss(files, filesName);
      console.log('pathpath', path);
    },
    async demo1() {
      const response = await this.GetFromOss("test/2/2_2022-01-13_1642067238081mPWQw");
      console.log('responseresponse', response);
    },
    Save() {
      if (tool.getLocalStorageAllSize() >= 2) {
        this.$message({
          showClose: true,
          message: "Not enough space, save failed",
          type: "error",
          dangerouslyUseHTMLString: true,
          duration: 5000,
        });
        return;
      } else {
        this.$message({
          showClose: true,
          message: "Saved successfully",
          type: "success",
          duration: 5000,
        });
      }
      let json = JSON.parse(window.localStorage.getItem(this.$parent.UUID));
      json.updateTime = moment().format("YYYY/MM/DD HH:mm:ss");
      window.localStorage.setItem(this.$parent.UUID, JSON.stringify(json));
    },
    goMyFiles() {
      const { href } = this.$router.resolve({
        path: "/myFiles"
      });
      window.open(href, "_blank")

    },
    changeProjectName(e) {
      if (this.projectName == "") {
        this.projectName = "Unnamed"
      }
      this.projectName = this.projectName.trim(" ");
      let json = JSON.parse(window.localStorage.getItem(this.$parent.UUID));
      json.updateTime = moment().format("YYYY/MM/DD HH:mm:ss");
      json.name = this.projectName;
      window.localStorage.setItem(this.$parent.UUID, JSON.stringify(json));
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
.MindMapHeader {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
}
.leftBox {
  display: flex;
  align-items: center;
}
.logo {
  height: 40px;
  width: 40px;
  margin-left: 24px;
}

.projectName {
  border: none;
  font-weight: bold;
  font-size: 16px;
  color: #1d1d1f;
  margin: 0px 24px;
  width: 168px;
  padding: 8px;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
.projectName:focus {
  outline: none;
  background: #e1e8ff;
}
.add {
  width: 100px;
  height: 36px;
  background: #5452f6;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #ffffff;
  margin-right: 24px;
}
.add:hover {
  background: #2421ff;
}
.importBox {
  position: relative;
  height: 32px;
  width: 32px;
  overflow: hidden;
  margin-right: 2px;
}
.import {
  height: 32px;
  width: 32px;
}
.importBox:hover {
  background: #f0f0f0;
  border-radius: 8px;
}
.choiceFileInput {
  height: 32px;
  width: 32px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}

.rightBox {
  display: flex;
  align-items: center;
}
.operation {
  height: 32px;
  width: 32px;
}
.export {
  height: 32px;
  width: 32px;
  cursor: pointer;
}
.export:hover {
  background: #f0f0f0;
  border-radius: 8px;
}
.save {
  height: 32px;
  width: 32px;
  cursor: pointer;
  margin-right: 20px;
  border-radius: 6px;
}
.save:hover {
  background: #f0f0f0;
}
.myFiles {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #5452f6;
  font-weight: bold;
  margin-right: 32px;
  cursor: pointer;
  margin-left: 30px;
}
.myFiles img {
  height: 24px;
  width: 24px;
  margin-right: 8px;
}
</style>
