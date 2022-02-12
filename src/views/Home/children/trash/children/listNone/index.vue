<template>
  <div class="listNone">
    <div class="noneImg">
    </div>
    <div class="title">No data</div>
  </div>
</template>

<script>
// 导入本地文件
export default {
  name: "listNone",
}
</script>

<style scoped lang="less">
.listNone {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 140px;
  .noneImg{
    display: inline-block;
    width: 356px;
    height: 228px;
    background: url('../../../../imgs/recyble.png') center center no-repeat;
  }
  .title {
    font-weight: bold;
    font-size: 18px;
    margin-top: 54px;
    margin-bottom: 30px;
    color: rgba(29, 29, 31, 0.5);
    line-height: 26px;
  }
}
</style>
