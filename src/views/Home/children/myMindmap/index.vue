<template>
  <div class="MindmapBox">
    <div
      class="MyMindmap"
      v-if="tableData.length > 0"
    >
      <!-- 添加按钮 -->
      <div
        class="itemMapAdd"
        @click="clickAppendSingle"
      >
        <img src="../../imgs/Unionadd.png" />
        <span class="titleAdd">Add New</span>
      </div>
      <!-- 正常数据 -->
      <div
        class="itemMapCommon"
        v-for="item in tableData"
        :key="item.id"
        @mouseenter="singleEnter(item)"
        @mouseleave="singleLeave(item)"
      >
        <div
          class="topICon"
          @click="intoDetail(item)"
        >
          <img src="../../imgs/MyMindmapimg.png" />
        </div>
        <div
          class="buttonIntro"
          @click="intoDetail(item)"
        >
          <span class="iconPosition">
            <img src="../../imgs/files.png" />
          </span>
          <span class="singleName">
            <Tool-tip :content="item.name"></Tool-tip>
          </span>
        </div>
        <!-- 操作按钮 -->
        <div
          class="selectIcon"
          v-show="item.menuShow"
        >
          <Dropdown
            :propObj="item"
            @change="menuChange"
            :selectData="menuSelect.menuSelectData"
            :buttonIcon="menuSelect.buttonIcon"
          ></Dropdown>
        </div>
      </div>
      <!-- 占空数据 -->
      <div
        class="itemMapHidden"
        v-for="item in [1,2,3,4,5,6,7,8,9,10]"
        :key="'none' + item"
      ></div>
    </div>
    <ListNone v-else></ListNone>
    <!-- 重命名 -->
    <Modal
      :visible.sync="aboutReName.visible"
      @change="_initCreatePage"
      :name="aboutReName.propsData.name"
      :id="aboutReName.propsData.id"
      :title="aboutReName.title"
    ></Modal>
    <!-- 验证modal -->
    <ConfirmModal
      :visible.sync="aboutDele.visible"
      @submit="DeleSubmit"
      :id="aboutDele.propsData.id"
      info="Are you sure you want to delete? It can be restored from Trash"
    ></ConfirmModal>
    <!-- 导出 -->
    <ExportComponent
      ref="Export"
      @Export="Export"
    ></ExportComponent>
  </div>
</template>

<script>
import { getProductList, deleProductTrash } from "@/request/home"
import _ from "lodash"
import ExportUtils from "@/utils/ExportUtils";

// 多出元素...
import ToolTip from "@/components/ToolTip/index.vue"
// 下拉菜单
import Dropdown from "@/components/selectMenu/index.vue"
// 数据为空显示
import ListNone from "./children/listNone/index.vue"
// 重命名modal
import Modal from './children/ReName/index.vue'
// 验证modal
import ConfirmModal from "@/components/ConfirmModal"
// 
import ExportComponent from "@/components/MindMap/Export.vue";

import aLiOss from '@/mixin/aLiOss.js';

export default {
  name: "MyMindmap",
  mixins: [aLiOss],
  data () {
    return {
      tableData: [
        // {id:1, name:'11111', menuShow:false}
      ],
      // 操作按钮
      menuSelect: {
        menuSelectData: [
          { id: "Open", defaultIcon: require("@/views/Home/imgs/open.svg"), hoverIcon: require("@/views/Home/imgs/open_hover.svg") },
          { id: "Rename", defaultIcon: require("@/views/Home/imgs/Rename.png"), hoverIcon: require("@/views/Home/imgs/Rename_hover.svg") },
          { id: "Copy", defaultIcon: require("@/views/Home/imgs/copy.png"), hoverIcon: require("@/views/Home/imgs/copy_hover.svg") },
          { id: "Export", defaultIcon: require("@/views/Home/imgs/Export.png"), hoverIcon: require("@/views/Home/imgs/Export_hover.svg") },
          { id: "Delete", defaultIcon: require("@/views/Home/imgs/Delete.png"), hoverIcon: require("@/views/Home/imgs/Delete_hover.svg") },
        ],
        buttonIcon: require('@/views/Home/imgs/gengduo.png'),
      },
      aboutReName: {
        visible: false,
        title: 'Tips',
        propsData: {}
      },
      aboutDele: {
        visible: false,
        propsData: {}
      },
    }
  },

  created () {
    this._initCreatePage()

  },
  watch: {
    '$store.state.loginStatus' () {
      if (this.$store.state.loginStatus && this.$store.state.nowNetwork) {
        this._initCreatePage()
      } else {
        this.tableData = []
      }
    }
  },
  methods: {
    // 执行created中的内容
    _initCreatePage () {
      // 1. 如果当前未登入，则不获取数据
      if (this.$store.state.loginStatus && this.$store.state.nowNetwork) {
        this.getData({ state: 1 })
      }
    },
    // 获取数据部分
    async getData (obj,) {
      let results = await getProductList({ ...obj })
      console.log(results)
      if (results.data.code === 200 && results.data.msg === 'ok') {
        if (results.data.data.length > 0) {
          this.tableData = _.cloneDeep(results.data.data)
          // 新增字段
          this.tableData.forEach(ele => {
            this.$set(ele, 'menuShow', false)
          })
          // 排序
          this.tableData = this.sortByKey(this.tableData, 'updateTime')
        } else if (results.data.data.length === 0) {
        this.tableData = []
      }
      } 
    },
    // 新增部分 --
    // 1. 点击新增
    clickAppendSingle () {
      const { href } = this.$router.resolve({
        path: "/mindMap?isNew=1"

      });
      window.open(href, "_blank")
    },
    // 菜单选择
    async menuChange (item, row) {
      // item : 菜单按钮key  row：当前选中对象
      if (item === 'Open') {
        // 打开
        this.intoDetail(row)
      }
      else if (item === 'Rename') {
        // 重命名
        this.openReName(row)
      } else if (item === 'Copy') {
        // 拷贝
        this.copy(row)
      } else if (item === 'Export') {
        // 导出
        let tempJson = await this.GetFromOss(row.ossAddress.split("https://pdmind.oss-us-east-1.aliyuncs.com/")[1]);
        await this.$parent.minder.importData(
          "json",
          tempJson
        );
        this.$refs.Export.show(row);
      } else if (item === 'Delete') {
        // 删除
        this.openDele(row)
      }
    },
    // 进入详情
    intoDetail (row) {
      const { href } = this.$router.resolve({
        path: `/mindMap?ossId=${row.ossAddress.split("https://pdmind.oss-us-east-1.aliyuncs.com/")[1]}&fileName=${row.name}`
      });
      window.open(href, "_blank")
    },
    async copy (e) {
      var response = await this.GetFromOss(e.ossAddress.split("https://pdmind.oss-us-east-1.aliyuncs.com/")[1]);
      var blob = new Blob([response]);
      let files = new window.File([blob], "pdmind", { type: "text/plain" })
      await this.saveToOss(files, e.name);
      console.log(111);
      this._initCreatePage()

    },
    // 重命名部分 --
    // 1. 弹出
    openReName (row) {
      this.aboutReName.visible = true
      this.aboutReName.propsData = row
    },
    // 导出部分 -- 
    async Export (currentSelectType, fileName) {
      try {
        switch (currentSelectType) {
          case "PDF":
            ExportUtils.ExportPDF(await this.$parent.minder.exportData("png"), fileName);
            break;
          case "PDmind":
            ExportUtils.ExportPDmind(
              await this.$parent.minder.exportData("json"),
              fileName
            );
            break;
          case "JPG":
            ExportUtils.ExportImg(
              await this.$parent.minder.exportData("png"),
              currentSelectType,
              fileName
            );
            break;
          case "PNG":
            ExportUtils.ExportImg(
              await this.$parent.minder.exportData("png"),
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
    // 删除部分 -- 
    // 1. 弹出
    openDele (row) {
      this.aboutDele.visible = true
      this.aboutDele.propsData = row
    },
    // 2. 确定
    async DeleSubmit (id) {
      let results = await deleProductTrash({ id, type: 0 })
      console.log(results)
      if (results.data.code === 200 && results.data.msg === 'ok') {
        this.$message.success("Succeed")
        this._initCreatePage()
      }
    },
    // 功能型部分 --
    singleEnter (row) {
      row.menuShow = true
    },
    singleLeave (row) {
      row.menuShow = false
    },
    sortByKey (array, key) {
      return array.sort(function (a, b) {
        var y = new Date(a[key]).getTime();
        var x = new Date(b[key]).getTime()
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    },
  },
  components: {
    ToolTip, ListNone, Modal, ConfirmModal, Dropdown, ExportComponent
  }
}
</script>

<style scoped lang="less">
.MindmapBox {
  width: 100%;
  min-height: calc(100vh-80px);
}
.MyMindmap {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-around;
  .itemMapCommon {
    width: 172px;
    height: 172px;
    background-color: #fff;
    margin: 5px 5px 15px;
    transition: all 0.6s;
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    &:hover {
      box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
      .selectIcon {
        display: block;
      }
    }
    .topICon {
      height: 130px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #e8eaf0;
    }
    .buttonIntro {
      height: 42px;
      display: flex;
      align-items: center;
      background-color: #fff;
      position: relative;
      font-size: 14px;
      padding: 0 8px;
      box-sizing: border-box;
      .iconPosition {
        display: inline-block;
        margin-right: 23px;
      }
      .singleName {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .selectIcon {
      position: absolute;
      top: 8px;
      right: 10px;
      text-align: right;
    }
  }
  .itemMapHidden {
    width: 172px;
    height: 172px;
    margin: 5px 5px 15px;
  }
  .itemMapAdd {
    width: 172px;
    height: 172px;
    background-color: #ffffff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 5px 15px;
    cursor: pointer;
    flex-direction: column;
    
    .titleAdd{
      margin-top: 10px;
      font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    color: #000000;
    }
    &:hover {
      filter: drop-shadow(0px 22px 30px #e8eaf0);
    }
  }
}
</style>
