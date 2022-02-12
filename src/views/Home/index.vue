<template>
  <div class="home">
    <div class="header">
      <Home-header></Home-header>
    </div>
    <div class="centerBody">
      <div class="menu">
        <div
          class="itemMenu"
          :class="{ active: defaultActive === 'appendNew' }"
          @click="routerRepeace('appendNew')"
        >
          <span class="iconSetWidth">
            <i class="menuIconAdd"></i>
          </span>
          <span>Add New</span>
        </div>
        <div
          class="itemMenu"
          :class="{ active: defaultActive === 'myMindmap' }"
          @click="routerRepeace('myMindmap')"
        >
          <span class="iconSetWidth">
            <i class="menuIconMap"></i>
          </span>
          <span>My Mindmap</span>
        </div>
        <div
          class="itemMenu"
          :class="{ active: defaultActive === 'trash' }"
          @click="routerRepeace('trash')"
        >
          <span class="iconSetWidth">
            <i class="menuIconTrash"></i>
          </span>
          <span>Trash</span>
        </div>
      </div>
      <div class="content">
        <div class="showContend">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <div style="height: 100vh; top: 0px;left:9999px; position: fixed; z-index: -10;">
      <Main id="main" :tempJson="getjson"></Main>
    </div>
  </div>
</template>

<script>
import Main from "@/components/MindMap/Main.vue";
import { mapGetters } from "vuex";

import HomeHeader from "./children/header/index.vue"
export default {
  name: "Home",
  computed: {
    ...mapGetters({
      minder: "getMinder",
      editor: "getEditor",
    }),
  },
  data() {
    return {
      defaultActive: 'appendNew',
      getjson: JSON,
    }
  },
  methods: {
    async initMindMap(){
      this.getjson = await this.minder.exportData("json");
    },
    initMenuSelect() {
      if (this.$route.path.includes('appendNew')) {
        this.defaultActive = "appendNew"
      } else if (this.$route.path.includes('myMindmap')) {
        this.defaultActive = "myMindmap"
      } else {
        this.defaultActive = "trash"
      }
    },
    routerRepeace(item) {
      this.defaultActive = item
      this.$router.push(`/home/${item}`)
    }
  },
  created () {
   

    this.initMenuSelect()
    this.$nextTick(() => {
      this.initMindMap()
    })
  },
  
  components: {
    HomeHeader,
    Main
  }
}
</script>

<style scoped lang="less">
@import url("../../assets/css/common.less");

.home {
  font-family: Inter;
  color: #1d1d1f;
  font-size: 14px;
  background: #f5f7fd;
  .header {
    height: 64px;
    width: 100%;
    box-shadow: 0px 2px 0px #eaeaea;
  }
  .centerBody {
    position: absolute;
    top: 65px;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    .menu {
      height: 100%;
      width: 250px;
      background-color: #ffffff;
      box-sizing: border-box;
      padding: 20px 16px 0;
      .itemMenu {
        width: 208px;
        height: 40px;
        display: flex;
        align-items: center;
        padding: 6px 12px;
        box-sizing: border-box;
        font-size: 14px;
        border-radius: 5px;
        margin-bottom: 16px;
        cursor: pointer;
        &:hover {
          background-color: #ebebff;
          color: #1d1d1f;
        }
        .iconSetWidth {
          width: 40px;
          display: inline-block;
        }
        .menuIconAdd {
          width: 20px;
          height: 20px;
          display: inline-block;
          background: url("./imgs/document-add.svg") center center;
          margin-right: 10px;
        }
        .menuIconMap {
          width: 20px;
          height: 20px;
          display: inline-block;
          background: url("./imgs/default_menu2.svg") center center;
        }
        .menuIconTrash {
          width: 20px;
          height: 20px;
          display: inline-block;
          background: url("./imgs/delete.svg") center center;
        }
      }
      .itemMenu.active {
        background-color: #5452f6;
        color: white;
        .menuIconAdd {
          background: url("./imgs/hover_menu1.svg") center center;
        }
        .menuIconMap {
          background: url("./imgs/My Mindmap.svg") center center;
        }
        .menuIconTrash {
          background: url("./imgs/hover_menu3.svg") center center;
        }
      }
    }

    .content {
      flex: 1;
      overflow-y: scroll;
      padding: 20px 25px 0px;
      box-sizing: border-box;
      position: relative;
      background-color: #f5f7fd;
      .showContend {
        width: 100%;
        min-height: calc(100vh - 200px);
        background-color: #f5f7fd;
      }
    }
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    ::-webkit-scrollbar {
      width: 7px;
      height: 7px;
      background-color: #f5f5f5;
    }

    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      background-color: #f5f5f5;
    }

    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
      background-color: #c8c8c8;
    }
  }
}
</style>
