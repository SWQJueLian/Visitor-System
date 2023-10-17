<script setup>
import { onActivated, onDeactivated, ref } from 'vue'
import { inviteListService } from '@/apis/invite'
import { useRouter } from 'vue-router'
import { isVisitDateExpired, toDayFormatStr } from '@/utils/tools'

const router = useRouter()
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

const invite_list = ref([])
const keyword = ref('')
const udata = JSON.parse(sessionStorage.getItem('userinfo'))
// 保存最后一个项目的datetime用于瀑布流刷新
const pre_datetime = ref('')

const initInviteList = async () => {
  //console.log('触发initlist')
  // 方便调试
  let employee_id = ''
  if (udata == null) {
    employee_id = 'SongWeiQuan'
  } else {
    employee_id = udata['userid']
  }
  // end 方便调试
  const data = {
    employee_id: employee_id,
    keyword: keyword.value,
    datetime: pre_datetime.value || toDayFormatStr()
  }
  //console.log(data)
  const resp = await inviteListService(data)
  //console.log(resp)
  // 没数据了就表示到尾了，设置finished为true, 阻止继续触发onload
  if (resp.data.results.length <= 0) {
    finished.value = true
  }
  // 往头部追加
  invite_list.value.push(...resp.data.results)
  // 保存pre_datetime
  pre_datetime.value = resp.data.pre_datetime
  //console.log(pre_datetime.value)
}

// 初始化数据
// 不用了，直接给onload自动触发，如不然首次会加载多一次
// initInviteList()

const handlerInviteDetail = (invite_id) => {
  router.push(`/invite-detail/${invite_id}`)
}

const onLoad = async () => {
  console.log('触发onload函数')
  if (refreshing.value) {
    invite_list.value = []
    refreshing.value = false
  }

  await initInviteList()
  loading.value = false
}

// 表示正处于刷新列表中（）
const onRefresh = () => {
  // 清空列表数据
  finished.value = false

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true
  onLoad()
}

async function handlerSearchButton() {
  // 搜索前置空
  invite_list.value = []
  await initInviteList()
  // 这个必须放后面，不然逻辑就不对，和今夜页面一样，会出现多加载一次
  finished.value = false
}

onActivated(() => {
  console.log('myinvite activated')
  if (sessionStorage.getItem('is_current_add') == 1) {
    initInviteList()
    sessionStorage.setItem('is_current_add', 0)
  }
})

onDeactivated(() => {
  console.log('myinvite deactivated')
})
</script>
<template>
  <div id="list_box" class="van-safe-area-bottom">
    <van-sticky>
      <van-search
        v-model="keyword"
        shape="round"
        placeholder="请输入搜索关键词"
      >
        <template #right-icon>
          <div class="mybtn-search2" @click="handlerSearchButton">搜索</div>
        </template>
      </van-search>
    </van-sticky>
    <van-pull-refresh
      :style="{ height: 'calc(100%-65px)' }"
      v-model="refreshing"
      @refresh="onRefresh"
      id="pull_refresh"
    >
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell-group>
          <van-cell
            v-for="item in invite_list"
            :key="item.id"
            :title="`${item.visitor_name}`"
            is-link
            center
            @click="handlerInviteDetail(item.id)"
          >
            <template #value>
              <van-tag v-if="item.status == 1" plain type="success"
                >已到访</van-tag
              >
              <van-tag
                v-else-if="isVisitDateExpired(item.status, item.visit_date)"
                plain
                color="#d1d1d1"
                type="primary"
                >已过期</van-tag
              >
              <van-tag v-else plain type="primary">未到访</van-tag>
            </template>
            <template #label>
              <p style="margin: 0">{{ item.visitor_mobile }}</p>
              <p style="margin: 0">{{ item.visit_date }}</p>
            </template>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
    <van-back-top />
  </div>
</template>

<style scoped>
.mybtn-search2 {
  padding: 2px 10px;
  background: linear-gradient(to right, #00bbff, #009dff);
  border-radius: 20px;
  color: white;
  cursor: pointer;
}
</style>
