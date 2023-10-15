<script setup>
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { inviteDetailService, inviteUpdateService } from '@/apis/invite'
import VnpKeyboard from '@/components/vant-number-plate/vnp-keyboard.vue'
import { showNotify } from 'vant'
import router from '@/router'
import { baseurl } from '@/utils/request'
import 'vant/es/notify/style'
import { isVisitDateExpired } from '@/utils/tools'

const route = useRoute()

const form_data = ref(null)
// 表单组织ref
const formRef = ref('')

const invite_id = route.params.invite_id

const initInviteDetail = async (invite_id) => {
  const resp = await inviteDetailService(invite_id)
  console.log(resp)
  form_data.value = resp.data
}
// 初始化访客详情信息
initInviteDetail(invite_id)

// 日期选择器只能选一年内的
const plus_one_year = new Date()
plus_one_year.setFullYear(plus_one_year.getFullYear() + 1)

const today = new Date()
// 日期选择器当前选中日期
const current_date = ref([
  today.getFullYear(),
  today.getMonth() + 1,
  today.getDate()
])
// 时间选择器当其选中时间
const current_time = ref([today.getHours(), today.getMinutes()])

// 是否显示手机号输入数字键盘
const mobile_keyboard_show = ref(false)
// 是否显示日期+时间选择器组
const vistor_datetimepicker_show = ref(false)

// 是否显示车牌键盘
const vistor_car_keyboard_show = ref(false)

// 修改邀请
async function submitInvite() {
  // 1. 校验表单
  await formRef.value.validate()
  // 2. 发送请求添加邀请
  console.log(formRef.value.getValues())
  await inviteUpdateService(invite_id, {
    ...formRef.value.getValues()
  })
  // 2.1 发送通知
  showNotify({ type: 'success', message: '修改成功！' })

  // 跳转到列表页
  router.back()
}

// 日期时间选择确定处理
const onDateTimeConfirm = () => {
  // console.log(date_time_str)
  form_data.value.visit_date =
    current_date.value.join('-') + ' ' + current_time.value.join(':')
  vistor_datetimepicker_show.value = false
}

// 日期时间选择取消处理
const onDateTimeCancel = () => {
  vistor_datetimepicker_show.value = false
}

// 生成访客二维码链接
const visit_url = ref(`${baseurl}/visitor-info/${invite_id}`)

// 一键复制访客链接到剪辑版
function handlerCopy() {
  navigator.clipboard
    .writeText(visit_url.value)
    .then(() => {
      showNotify({ type: 'success', message: '已成功复制到剪贴板' })
    })
    .catch((error) => {
      console.error(error)
      showNotify({ type: 'danger', message: '复制到剪贴板失败' })
    })
}

const disable_update_btn = computed(() => {
  if (form_data.value.status == 1) {
    return true
  }
  return isVisitDateExpired(form_data.value.status, form_data.value.visit_date)
})
</script>

<template>
  <div class="van-safe-area-bottom">
    <van-nav-bar
      fixed
      title="访客详情"
      safe-area-inset-top
      left-arrow
      @click-left="router.back()"
    />
    <van-form
      style="margin-top: 45px"
      ref="formRef"
      colon
      show-error
      :readonly="disable_update_btn"
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
          :rules="[
            { required: true },
            {
              pattern: /^(?:[\u4e00-\u9fa5]|[a-zA-Z]){2,20}$/,
              message: '姓名格式不正确，长度为2-20位'
            }
          ]"
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
          @touchstart.stop="mobile_keyboard_show = true"
          :rules="[
            {
              required: true
            },
            {
              message: '访客电话格式不正确，长度为11位',
              pattern: /^1[3-9]\d{9}/
            }
          ]"
        />
        <van-number-keyboard
          v-model="form_data.visitor_mobile"
          :show="mobile_keyboard_show && disable_update_btn === false"
          :maxlength="11"
          @blur="mobile_keyboard_show = false"
        />

        <van-field
          v-model="form_data.visitor_unit"
          name="visitor_unit"
          label="所属单位"
          placeholder="请输入所属单位"
        />

        <van-field name="visitor_num" label="来访人数 * ">
          <template #input>
            <van-stepper
              :disabled="disable_update_btn"
              default-value="1"
              v-model.number="form_data.visitor_num"
              integer
            />
          </template>
        </van-field>

        <van-field
          label="来访时间 * "
          placeholder="请输入来访时间"
          is-link
          v-model="form_data.visit_date"
          name="visit_date"
          readonly
          clickable
          @click="vistor_datetimepicker_show = true"
          :rules="[{ required: true }]"
        />
        <van-field
          v-model="form_data.visitor_car_number"
          name="visitor_car_number"
          placeholder="请输入车牌号"
          readonly
          label="车牌号码"
          is-link
          @click="vistor_car_keyboard_show = true"
        />

        <van-field
          v-model="form_data.visitor_reason"
          name="visitor_reason"
          rows="1"
          autosize
          label="来访原因 * "
          type="textarea"
          maxlength="50"
          placeholder="请输入来访原因"
          show-word-limit
          :rules="[{ required: true }]"
        />
        <van-field
          type="textarea"
          autosize
          readonly
          label="访客链接"
          :model-value="visit_url"
        >
          <template #button>
            <van-button round size="small" type="primary" @click="handlerCopy"
              >复制
            </van-button>
          </template>
        </van-field>
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
          <van-button round block type="warning" @click="router.back()">
            返回
          </van-button>
        </div>
        <div style="width: 100%; padding: 0 10px">
          <van-button
            :disabled="disable_update_btn"
            round
            block
            type="primary"
            @click="submitInvite"
          >
            {{ disable_update_btn ? '已过期/已到访' : '修改邀请' }}
          </van-button>
        </div>
      </div>
    </van-form>
    <!-- 日期选择弹出层 -->
    <van-popup
      safe-area-inset-bottom
      v-model:show="vistor_datetimepicker_show"
      position="bottom"
      :style="{ height: '55%' }"
    >
      <van-picker-group
        title="预约来访日期时间"
        :tabs="['选择日期', '选择大致时间']"
        next-step-text="下一步"
        @confirm="onDateTimeConfirm"
        @cancel="onDateTimeCancel"
      >
        <van-date-picker
          v-model="current_date"
          :min-date="today"
          :max-date="plus_one_year"
        />
        <van-time-picker v-model="current_time" />
      </van-picker-group>
    </van-popup>
    <!-- 车牌键盘 -->
    <vnp-keyboard
      v-model="form_data.visitor_car_number"
      v-model:show="vistor_car_keyboard_show"
    ></vnp-keyboard>
  </div>
</template>

<style scoped></style>
