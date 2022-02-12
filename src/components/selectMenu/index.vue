<template>
  <div>
    <el-dropdown
      trigger="click"
      :ref="`dropdown_${propObj.id}`"
      @command="dropdownSelect($event, propObj)"
    >
      <!-- 激活按钮 -->
      <img
        v-if="buttonIcon"
        class="buttonImg"
        :style="{...buttonStyle}"
        :src="buttonIcon"
      >
      <slot v-else name="triggerButton"></slot>
        
      <!-- @mouseleave.native="singleNativeLeave(propObj)" -->
      <el-dropdown-menu
        slot="dropdown"
        :style="{...boxStyle}"
        @mouseenter.native="singleEnter(propObj)"
      >
        <slot name="header"></slot>
        <el-dropdown-item
          :command="item.id"
          v-for="item in lists"
          :key="item.id"
          :style="{...styleItem}"
        >
          <div
            class="setDropdownSingle"
            @mouseleave="changImgByLeave(item)"
            @mouseenter="changImgByEnter(item)"
          > <img :src="item.status? item.hoverIcon:item.defaultIcon">
            <span>{{item.id}}</span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import _ from "lodash"
export default {
  data () {
    return {
      lists: []
    }
  },
  props: {
    // 可能有v-for遍历需要存储当前的遍历值
    propObj: {
      type: Object,
      default: () => {
        return {
          id: 1
        }
      }
    },
    // 下拉选择菜单
    selectData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 按钮图片
    buttonIcon: {
      type: String,
      default: ''
    },
    // 移出modal是否需要隐藏下拉菜单
    mouseLeaveHidden: {
      type: Boolean,
      default: false
    },
    // 激活按钮样式
    buttonStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 单行样式
    styleItem: {
      default: () => {
        return {}
      }
    },
    // 盒子样式
    boxStyle: {
      default: () => {
        return {}
      }
    }
  },

  methods: {
    dropdownSelect (item, row) {
      // item : 菜单按钮key  row：当前选中对象
      this.$emit('change', item, row)
    },
    singleEnter (row) {
      row.menuShow = true


    },
    singleLeave (row) {
      row.menuShow = false
      
    },
    singleNativeLeave (row) {
      row.menuShow = false
      if (!this.mouseLeaveHidden) this.$refs['dropdown_' + row.id].visible = false
    },
    changImgByEnter (row) {
      row.status = true
    },
    changImgByLeave (row) {
      row.status = false
    }

  },
  created () {

    this.lists = _.cloneDeep(this.$props.selectData) || []
    this.lists.forEach(item  => {
      this.$set(item , 'status', false)
    })

  }
}
</script>

<style scoped lang="less">
.setDropdownSingle {
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 0 8px;
  > img {
    margin-right: 12px;
  }
  &:hover {
    background-color: #5452f6;
    color: #fff;

  }
}
.buttonImg {
  cursor: pointer;
}
/deep/ .el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: transparent;
  color: #606266;
}
/deep/ .el-tooltip__popper {
  max-width: 180px;
  max-height: 94px;
  overflow: hidden;
}
.el-dropdown-menu__item {
  padding: 0 10px;
}
</style>
