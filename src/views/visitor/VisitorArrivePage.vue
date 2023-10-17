<script setup>
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { inviteDetailService, inviteStatusUpdateService } from '@/apis/invite'
import { showNotify } from 'vant'
import 'vant/es/notify/style'
import { isVisitDateExpired } from '@/utils/tools'

const route = useRoute()

const form_data = ref(null)
// 表单组织ref
const formRef = ref('')

const invite_id = route.params.invite_id

const initInviteDetail = async (invite_id) => {
  const resp = await inviteDetailService(invite_id)
  form_data.value = resp.data
}
// 初始化访客详情信息
initInviteDetail(invite_id)

// 是否显示密码输入框
const show_confirm_dialog = ref(false)
const showPWKeyboard = ref(false)
const password = ref('')

// 修改邀请
async function submitInvite() {
  show_confirm_dialog.value = false
  // 1. 校验表单
  await formRef.value.validate()
  // 2. 发送请求添加邀请
  console.log(formRef.value.getValues())
  await inviteStatusUpdateService(invite_id, {
    status: 1,
    password: password.value
  })
  // 2.1 发送通知
  showNotify({ type: 'success', message: '已通知邀请人，感谢！' })

  // 跳转到列表页
  //router.back()
  // 禁用按钮，防止再次点击
  form_data.value.status = 1
}

const disable_update_btn = computed(() => {
  if (form_data.value?.status == 1) {
    return true
  }
  return isVisitDateExpired(
    form_data.value?.status,
    form_data.value?.visit_date
  )
})
</script>

<template>
  <van-loading v-if="!form_data" type="spinner" color="#1989fa" />
  <div v-else class="van-safe-area-bottom">
    <van-nav-bar fixed title="访客信息" safe-area-inset-top />
    <van-form
      style="margin-top: 45px"
      ref="formRef"
      colon
      show-error
      readonly
      :submit-on-enter="false"
    >
      <van-cell-group title="员工信息">
        <van-field
          v-model="form_data.employee.employee_name"
          readonly
          name="employee_name"
          label="邀请人"
        />
        <van-field
          v-model="form_data.employee.employee_department"
          readonly
          name="employee_department"
          label="所属部门"
        />
      </van-cell-group>
      <van-cell-group title="访客信息">
        <van-field
          v-model="form_data.visitor_name"
          name="visitor_name"
          label="访客姓名 * "
          placeholder="请输入访客姓名"
        >
          <template #right-icon>
            <van-tag v-if="form_data.status == 1" plain type="success"
              >已到访</van-tag
            >
            <van-tag
              v-else-if="
                isVisitDateExpired(form_data.status, form_data.visit_date)
              "
              plain
              color="#d1d1d1"
              type="primary"
              >已过期</van-tag
            >
            <van-tag v-else plain type="primary">未到访</van-tag>
          </template>
        </van-field>

        <van-field
          label="访客电话 * "
          placeholder="请输入访客电话"
          v-model="form_data.visitor_mobile"
          readonly
          clickable
          name="visitor_mobile"
        />

        <van-field
          v-model="form_data.visitor_unit"
          name="visitor_unit"
          label="所属单位"
          placeholder="无"
        />

        <van-field
          name="visitor_num"
          label="来访人数 * "
          v-model="form_data.visitor_num"
        >
        </van-field>

        <van-field
          label="来访时间 * "
          v-model="form_data.visit_date"
          name="visit_date"
          readonly
          clickable
        />
        <van-field
          v-model="form_data.visitor_car_number"
          name="visitor_car_number"
          readonly
          label="车牌号码"
          placeholder="无"
        />

        <van-field
          v-model="form_data.visitor_reason"
          name="visitor_reason"
          rows="1"
          autosize
          label="来访原因 * "
          type="textarea"
          maxlength="50"
          show-word-limit
        />
      </van-cell-group>

      <div
        style="
          margin: 16px 5px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        "
      >
        <div style="width: 100%; padding: 0 10px">
          <van-button
            :disabled="disable_update_btn"
            round
            block
            type="primary"
            @click="show_confirm_dialog = true"
          >
            {{ disable_update_btn ? '已过期/已到访' : '访客到达' }}
          </van-button>
        </div>
      </div>
    </van-form>
    <van-popup
      id="pw"
      v-model:show="show_confirm_dialog"
      position="top"
      round
      :style="{ height: 'auto', 'background-color': '#F7F8FA' }"
      @opened="showPWKeyboard = true"
    >
      <van-password-input
        style="margin: 30px 10px"
        :value="password"
        info="密码为 6 位数字"
        :error-info="errorInfo"
        :focused="showPWKeyboard"
        :gutter="10"
        @focus="showPWKeyboard = true"
      />
      <van-number-keyboard
        title="点空白处可关闭"
        maxlength="6"
        theme="custom"
        close-button-text="确定"
        v-model="password"
        :hide-on-click-outside="false"
        :show="showPWKeyboard"
        @blur="showPWKeyboard = false"
        @hide="show_confirm_dialog = false"
        @close="submitInvite"
      />
    </van-popup>
  </div>
</template>

<style scoped></style>
