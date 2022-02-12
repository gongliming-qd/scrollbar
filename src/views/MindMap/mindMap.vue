<template>
  <div>
    <div class="header">
      <Header
        ref="header"
        :saveState="saveState"
        :projectName="fileName"
        @Export="HeaderExport"
        @Save="HeaderSave"
      ></Header>
      <!-- @changeIsShowMindMapOperation="changeIsShowMindMapOperation" -->
    </div>
    <div class="section">
      <div class="main">
        <Main ref="Main" :tempJson="getjson"></Main>
      </div>
    </div>
    <ExportComponent ref="Export" @Export="Export"></ExportComponent>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { GetProjectFileInfo } from "@/request/home"
import Header from "../../components/MindMap/Header.vue";
import Main from "../../components/MindMap/Main.vue";
import ExportComponent from "../../components/MindMap/Export.vue";
import ExportUtils from "../../utils/ExportUtils";
import tool from "../../utils/tools";
import moment from "moment";
import { Loading } from "element-ui";
import aLiOss from '@/mixin/aLiOss.js';
export default {
  name: "MindMap",
  components: {
    Header,
    Main,
    // Operation,
    ExportComponent,
  },
  mixins: [aLiOss],
  computed: {
    ...mapGetters({
      minder: "getMinder",
      editor: "getEditor",
      tempMindMapData: "getTempMindMapData",
      tempMindMapName: "getTempMindMapName"
    }),
  },
  data() {
    return {
      UUID: "",
      json: {},
      ossId: "",
      getjson: JSON,
      fileName: '',
      saveState: 0,//0保存中 1保存成功 2保存失败
      HeaderSaveInterval: null
    };
  },
  async created() {

  },
  async mounted() {
    let that = this;
    var name;
    var data;
    if (!this.$store.state.loginStatus) {
      //导入来的
      if (this.$route.query.isImport == 1) {
        name = this.tempMindMapName;
        data = this.tempMindMapData;
        this.fileName = this.$route.query.fileName;
        var reader = new FileReader();
        reader.readAsText(data, 'utf-8');
        reader.onload = function (e) {
          that.getjson = e.target.result;
        }
      }
      //新建来的
      if (this.$route.query.isNew == 1) {
        name = "Unnamed";
        let response = await this.minder.exportData("json");
        let blob = new Blob([response]);
        data = new window.File([blob], "pdmind", { type: "text/plain" })
        this.fileName = name;
        that.getjson = data;
      }
      that.$refs.Main.tempJson = that.getjson;
      return;
    }
    //如果没有ossId 就需要先去oss 创建一个
    if (!this.$route.query.ossId) {
      //导入来的
      if (this.$route.query.isImport == 1) {
        name = this.tempMindMapName;
        data = this.tempMindMapData;
      }
      //新建来的
      if (this.$route.query.isNew == 1) {
        name = "Unnamed";
        let response = await this.minder.exportData("json");
        let blob = new Blob([response]);
        data = new window.File([blob], "pdmind", { type: "text/plain" })
      }
      const loading = Loading.service({
        lock: true,
        text: 'Loading...',
        background: 'rgba(192, 192, 192, 0.5)',
        target: 'body'
      })
      const path = await this.saveToOss(data, name);
      // 拿到 ossId 之后向oss 保存 和 获取 需要的参数
      this.ossId = path.name;
      loading.close()
      this.$router.replace({ path: '/supplierAllBack', query: { type: 2, ossId: this.ossId, fileName: name } })
    } else {
      this.ossId = this.$route.query.ossId;
      this.fileName = this.$route.query.fileName;
      let GetProjectFileInfoResults = await GetProjectFileInfo({ ossid: this.ossId })
      if (GetProjectFileInfoResults.data.data == null || GetProjectFileInfoResults.data.data.state != 0) {
        this.$alert('The file has been deleted, back to the home page.', 'Error', {
          confirmButtonText: 'OK',
          closeOnPressEscape: false,
          closeOnClickModal: false,
          showCancelButton: false,
          showClose: false,
          callback: action => {
            that.$router.push('/home/myMindmap')
          }
        });
        return;
      }
      this.fileName = GetProjectFileInfoResults.data.data.name;
    }
    var response = await this.GetFromOss(this.ossId);
    that.getjson = response;
    that.$refs.Main.tempJson = that.getjson;
    console.log("name123", name);
    console.log("data", data);
    console.log("ossId", this.ossId);
    this.HeaderSaveInterval = window.setInterval(function () {
      that.HeaderSave();
    }, 30000);
  },
  beforeDestroy() {
    window.clearInterval(this.HeaderSaveInterval)
  },
  methods: {
    async init() {
      this.UUID = tool.makeUUID();
      // window.minder.execCommand("template","right")
      // this.minder.exportData("json").template = "Right";
      console.log(this.minder.exportData("json"), 77777);
      let localStorageJson = {
        name: "Unnamed",
        createdTime: moment().format("YYYY/MM/DD HH:mm:ss"),
        updateTime: moment().format("YYYY/MM/DD HH:mm:ss"),
        json: await this.minder.exportData("json"),
        UUID: this.UUID,
        isFirstChangeRootText: true,
      };

      window.localStorage.setItem(this.UUID, JSON.stringify(localStorageJson));
      this.$router.replace({ path: "/mindMap", query: { UUID: this.UUID } });
    },
    async HeaderSave() {
      this.saveState = 0;
      let base64 = await this.minder.exportData("json");
      var blob = new Blob([base64]);
      let files = new window.File([blob], "pdmind", { type: "text/plain" })
      var res = await this.saveToOss(files, this.fileName, this.ossId);
      if (res) {
        this.saveState = 1;
      } else {
        this.saveState = 2;
      }
    },
    HeaderExport() {
      this.$refs.Export.show({ name: this.fileName });
    },
    async Export(currentSelectType, fileName) {
      try {
        switch (currentSelectType) {
          case "PDF":
            ExportUtils.ExportPDF(await this.minder.exportData("png"), fileName);
            break;
          case "PDmind":
            ExportUtils.ExportPDmind(
              await this.minder.exportData("json"),
              fileName
            );
            break;
          case "JPG":
            ExportUtils.ExportImg(
              await this.minder.exportData("png"),
              currentSelectType,
              fileName
            );
            break;
          case "PNG":
            ExportUtils.ExportImg(
              await this.minder.exportData("png"),
              currentSelectType,
              fileName
            );
            break;
          default:
            break;
        }
      } catch (error) {
        this.$message({
          showClose: true,
          message: `There are exceptions in the exported file. Please check and try again.`,
          type: "error",
        });
      }
      this.$refs.Export.hide();
    },
  },
};
</script>

<style scoped lang="less">
@import url("../../assets/css/common.less");
.header {
  // height: 64px;
  // width: 100%;
  // border-bottom: 1px solid #eaeaea;
}
.section {
  height: 100vh;
  width: 100%;
  display: table;
}
.operation {
  width: 300px;
  height: 100%;
  border-left: 1px solid #eaeaea;
  display: table-cell;
  vertical-align: middle;
}
.main {
  height: 100%;
  display: table-cell;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>