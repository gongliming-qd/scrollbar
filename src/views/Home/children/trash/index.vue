<template>
  <div class="MindmapBox">
    <div
      class="MyMindmap"
      v-if="tableData.length > 0"
    >
      <!-- 正常数据 -->
      <div
        class="itemMapCommon"
        v-for="item in tableData"
        :key="item.id"
        @mouseenter="singleEnter(item)"
        @mouseleave="singleLeave(item)"
      >
        <div class="topICon">
          <img src="../../imgs/MyMindmapimg.png">
        </div>
        <div class="buttonIntro">
          <span class="iconPosition">
            <img src="../../imgs/files.png">
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
        :key="'none'+item"
      >
      </div>
    </div>
    <ListNone v-else></ListNone>
    <!--删除modal -->
    <ConfirmModal
      :visible.sync="aboutDele.visible"
      @submit="DeleSubmit"
      :id="aboutDele.propsData.id"
      info="Are you sure you want to delete? It cannot be restored after deletion"
    ></ConfirmModal>
  </div>
</template>

<script>
import { getProductList, deleProductTrash } from "@/request/home"
import _ from "lodash"
// 多出元素...
import ToolTip from "@/components/ToolTip/index.vue"
// 下拉菜单
import Dropdown from "@/components/selectMenu/index.vue"
// 数据为空显示
import ListNone from "./children/listNone/index.vue"
// 验证modal
import ConfirmModal from "@/components/ConfirmModal"
export default {
  data () {
    return {
      tableData: [],
      // 操作按钮
      menuSelect: {
        menuSelectData: [
          { id: "Undo", defaultIcon: require("@/views/Home/imgs/undo.png"), hoverIcon: require("@/views/Home/imgs/undoHover.png") },
          { id: "Shift delete", defaultIcon: require("@/views/Home/imgs/Delete.png"), hoverIcon: require("@/views/Home/imgs/Delete_hover.svg") },
        ],
        buttonIcon: require('@/views/Home/imgs/gengduo.png'),
      },

      // 删除部分
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
    // 执行created中的内容/获取数据
    _initCreatePage () {
      // 1. 如果当前未登入，则不获取数据
      if (this.$store.state.loginStatus && this.$store.state.nowNetwork) {
        this.getData({ state: 2 })
      }
    },
    // 获取数据部分
    async getData (obj) {
      let results = await getProductList({ ...obj })
      console.log(results)
      if (results.data.code === 200 && results.data.msg === 'ok') {
        if (results.data.data.length > 0) {
          this.tableData = _.cloneDeep(results.data.data)
          this.tableData.forEach(ele => {
            this.$set(ele, 'menuShow', false)
          })
        } else if (results.data.data.length === 0) {
          this.tableData = []
        }
      }
      console.log(this.tableData);
    },
    // 菜单选择
    menuChange (item, row) {
      // item : 菜单按钮key  row：当前选中对象
      if (item === 'Undo') {
        // 恢复
        this.UndoSubmit(row.id)
      } else if (item === 'Shift delete') {
        // 删除
        this.openDele(row)
      }
    },
    // 恢复部分--
    // 1. 确定
    async UndoSubmit (id) {
      let results = await deleProductTrash({ id, type: 2 })
      console.log(results)
      if (results.data.code === 200 && results.data.msg === 'ok') {
        this.$message.success("Succeed")
        this._initCreatePage()
      }
    },
    // 删除部分--
    // 1. 弹出
    openDele (row) {
      this.aboutDele.visible = true
      this.aboutDele.propsData = row
    },
    // 2. 确定
    async DeleSubmit (id) {
      let results = await deleProductTrash({ id, type: 1 })
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
  },
  components: {
    ToolTip, ListNone, ConfirmModal, Dropdown
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
}
</style>
