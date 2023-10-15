<script setup>
import { onActivated, onDeactivated, ref } from 'vue'
import { inviteListService } from '@/apis/invite'
import { useRouter } from 'vue-router'
import { isVisitDateExpired } from '@/utils/tools'

const router = useRouter()
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

const invite_list = ref(null)
const keyword = ref('')
const initInviteList = async () => {
  const resp = await inviteListService({
    employee_id: JSON.parse(sessionStorage.getItem('userinfo'))['userid'],
    keyword: keyword.value
  })
  console.log(resp)
  invite_list.value = resp.data
}

// 初始化数据
initInviteList()

const handlerInviteDetail = (invite_id) => {
  router.push(`/invite-detail/${invite_id}`)
}

const onLoad = async () => {
  if (refreshing.value) {
    invite_list.value = []
    refreshing.value = false
  }

  await initInviteList()
  loading.value = false
  finished.value = true
}

// 表示正处于刷新列表中
const onRefresh = () => {
  // 清空列表数据
  finished.value = false

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true
  onLoad()
}

async function handlerSearchButton() {
  await initInviteList()
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
  <div id="list_box">
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
