<template>
  <div class="MyFiles">
    <div class="header">
      <Header :hasImport="true"></Header>
    </div>
    <div class="section">
      <div class="sectionTop">
        <span class="sectionTopTitle">My Files</span>
        <span class="sectionTopText">( Used {{ totalSize }} MB , Remaining {{ leftSize }} MB )</span>
        <span class="sectionTopInstructions">
          It is recommended to export the file locally.When the browser cache
          is emptied, the file will be cleaned up.
        </span>
      </div>

      <el-table
        class="sectionTable"
        :data="tableData"
        style="width: 100%; padding-left: 26px"
        :header-cell-style="{ color: 'black', 'font-weight': 'normal', 'font-family': 'Inter-Bold' }"
        :row-style="{ color: 'black' }"
        @cell-dblclick="dbSelected"
        height="calc(100vh - 65px - 16px - 24px - 50px - 30px)"
        :default-sort="{ prop: 'updateTime', order: 'descending' }"
      >
        <template slot="empty">
          <span>No data</span>
        </template>
        <el-table-column label="File Name" style="margin-left: 26px;">
          <template slot-scope="scope">
            <div style="display: flex;align-items: center">
              <div style="float: left;display: flex;">
                <img class="sectionTableLogo" src="../../components/MindMap/imgs/logo2.png" alt />
              </div>
              <span style="margin-left: 10px">{{ scope.row.name }}.PDmind</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Creation time" prop="createdTime" width="250"></el-table-column>
        <el-table-column label="Update time" prop="updateTime" width="250"></el-table-column>
        <el-table-column label="File size" width="150">
          <template slot-scope="scope">
            <span>
              {{
                scope.row.size.size.toFixed(2)
              }}{{ scope.row.size.sizeUnit }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="Operation" width="330">
          <template slot-scope="scope">
            <span class="operationText" @click="Edit(scope.row.UUID)">Edit</span>
            <span class="operationText" @click="showExport(scope.row)">Export</span>
            <span class="operationText" @click="remove(scope.row.UUID)">Delete</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height: 24px"></div>
    <Export ref="Export" @Export="Export"></Export>
    <promptPop ref="promptPop" @ok="ok"></promptPop>
    <div style="height: 100vh; top: 0px; position: absolute; z-index: -1">
      <Main id="main"></Main>
    </div>
  </div>
</template>

<script>
import Header from "../../components/MindMap/Header.vue";
import Main from "../../components/MindMap/Main.vue";

import tool from "../../utils/tools";
import Export from "../../components/MindMap/Export.vue";
import promptPop from "../../components/promptPop.vue";
import ExportUtils from "../../utils/ExportUtils";
import { mapMutations, mapGetters } from "vuex";

export default {
  name: "MyFiles",
  components: {
    Header,
    Export,
    promptPop,
    Main,
  },
  computed: {
    ...mapGetters({
      minder: "getMinder",
      editor: "getEditor",
      selectedNode: "getSelectedNode",
      hasRedo: "getHasRedo",
      hasUndo: "getHasUndo",
    }),
  },

  data() {
    return {
      totalSize: 0,
      leftSize: 0,
      tableData: [],
      UUID: "",
    };
  },
  created() { },
  mounted() {
    this.getTableDataList();
    this.totalSize = tool.getLocalStorageAllSize();
    this.leftSize = (2 - this.totalSize).toFixed(2);
    if (this.leftSize < 0) {
      this.leftSize = 0.00
    }
  },
  methods: {
    ...mapMutations([
      "setMinder",
      "setEditor",
      "setHasRedo",
      "setHasUndo",
      "setSelectedNode",
    ]),
    getTableDataList() {
      this.tableData = [];
      var storage = window.localStorage;
      for (var i = 0; i < storage.length; i++) {
        var key = storage.key(i);
        if (storage.getItem(key).indexOf("name") > -1) {
          let json = JSON.parse(storage.getItem(key));
          json.size = tool.getLocalStorageSize(key);
          this.tableData.push(json);
        }
      }
    },
    remove(e) {
      this.$refs.promptPop.promptPopSectionTitle = "Tips";
      this.$refs.promptPop.promptPopSectionText =
        "Are you sure you want to delete the file(s)? The file(s) cannot be restored after deletion.";
      this.$refs.promptPop.isShow = true;
      this.UUID = e;
    },
    ok() {
      window.localStorage.removeItem(this.UUID);
      this.getTableDataList();
      this.$refs.promptPop.isShow = false;
    },
    dbSelected(row, column, cell, event) {
      if (column.label == "Operation") {
        return
      }
      const { href } = this.$router.resolve({
        path: "/mindMap",
        query: { UUID: row.UUID },
      });

      window.open(href, "_blank")

    },
    Edit(e) {
      const { href } = this.$router.resolve({
        path: "/mindMap",
        query: { UUID: e },
      });
      window.open(href, "_blank")
    },
    showExport(e) {
      this.UUID = e.UUID;
      this.$refs.Export.projectName = e.name;
      this.$refs.Export.show();
      this.minder.importData(
        "json",
        JSON.parse(window.localStorage.getItem(this.UUID)).json
      );
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
        console.log('error', error);
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
<style scoped>
.MyFiles {
  background: #f5f7fd;
}
.header {
  height: 64px;
  width: 100%;
  border-bottom: 1px solid #eaeaea;
}
.section {
  height: calc(100vh - 65px - 16px - 24px);
  margin: 16px 24px 0px 24px;
  background: white;
  border-radius: 10px;
  position: relative;
}
.sectionTop {
  height: 64px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eaeaea;
}
.sectionTopTitle {
  font-family: "Inter-Bold";
  font-size: 18px;
  color: #000000;
  margin-left: 24px;
}
.sectionTopText {
  font-weight: bold;
  font-size: 14px;
  color: #000000;
  margin-left: 13px;
}
.sectionTopInstructions {
  font-style: normal;
  font-size: 12px;
  color: #1d1d1f;
  margin-left: 40px;
  opacity: 0.6;
}
.sectionTable {
}

.sectionTableLogo {
  height: 24px;
  width: 24px;
}
.operationText {
  font-size: 14px;
  color: #5452f6;
  margin-right: 8px;
}
</style>
<style>
.sectionTable .el-table__cell {
  border: none !important;
  cursor: pointer;
}
.sectionTable tbody tr:hover > td {
  background-color: #f0f0ff !important;
}
</style>