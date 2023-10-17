<script setup>
import { onActivated, onDeactivated, ref } from 'vue'
import { inviteAddService } from '@/apis/invite'
import { showNotify } from 'vant'
import 'vant/es/notify/style'
import VnpKeyboard from '@/components/vant-number-plate/vnp-keyboard.vue'

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
// 默认提交参数
const default_post_dict = {
  visitor_name: '', // 访客名
  visitor_num: 1, // 访客人数
  visitor_mobile: '', // 访客手机号
  visit_date: '', // 来访日期
  // vistor_time: '', // 来访时间
  visitor_car_number: '', // 车牌号码
  visitor_unit: '', // 访客所属单位
  visitor_reason: ''
}
// 表单data
const form_data = ref({ ...default_post_dict })
// 是否显示手机号输入数字键盘
const mobile_keyboard_show = ref(false)

// 是否显示来访日期选择器popup
// const vistor_datepicker_show = ref(false)
// const onDateConfirm = ({ selectedValues }) => {
//   form_data.value.vistor_date = selectedValues.join('-')
//   vistor_datepicker_show.value = false
// }
// // 是否显示来访时间选择器popup
// const vistor_timepicker_show = ref(false)
// const onTimeConfirm = ({ selectedValues }) => {
//   console.log(selectedValues)
//   form_data.value.vistor_time = selectedValues.join(':')
//   vistor_timepicker_show.value = false
// }

// 日期+时间选择器组
const vistor_datetimepicker_show = ref(false)
const onDateTimeConfirm = () => {
  // console.log(date_time_str)
  form_data.value.visit_date =
    current_date.value.join('-') + ' ' + current_time.value.join(':')
  vistor_datetimepicker_show.value = false
}

const onDateTimeCancel = () => {
  vistor_datetimepicker_show.value = false
}

// 是否显示车牌键盘
const vistor_car_keyboard_show = ref(false)

// 表单组织ref
const formRef = ref('')

// 重置表单
function resetForm() {
  formRef.value.resetValidation()
  form_data.value = {
    ...default_post_dict
  }
}

// 发送邀请
async function submitInvite() {
  // 1. 校验表单
  await formRef.value.validate()
  // console.log(formRef.value.getValues())
  // 2. 发送请求添加邀请
  await inviteAddService({
    ...formRef.value.getValues(),
    employee_id: employee_data.value['employee_id']
  })
  // 2.1 发送通知
  showNotify({ type: 'success', message: '邀请成功' })
  // 2.2 重置表单
  resetForm()
  // showToast('添加成功！')
  // set flag to refresh list
  sessionStorage.setItem('is_current_add', 1)
}

// 初始化员工信息
const employee_data = ref({})
const userinfo_obj = JSON.parse(sessionStorage.getItem('userinfo'))
console.log(JSON.parse(sessionStorage.getItem('userinfo')))
employee_data.value['employee_name'] = userinfo_obj?.username
employee_data.value['employee_department'] = userinfo_obj?.department_name
employee_data.value['employee_id'] = userinfo_obj?.userid

onActivated(() => {
  console.log('addinvite activated')
})

onDeactivated(() => {
  console.log('addinvite deactivated')
})
</script>

<template>
  <div style="margin-bottom: 65px" class="van-safe-area-bottom">
    <!-- <van-nav-bar title="访客系统" safe-area-inset-top /> -->
    <van-form ref="formRef" colon show-error>
      <van-cell-group title="员工信息">
        <van-field
          v-model="employee_data.employee_name"
          readonly
          name="employee_name"
          label="邀请人"
        />
        <van-field
          v-model="employee_data.employee_department"
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
        />

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
          :show="mobile_keyboard_show"
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
        <!-- <van-field
          label="来访时间"
          is-link
          v-model="form_data.vistor_time"
          name="vistor_time"
          readonly
          clickable
          @click="vistor_timepicker_show = true"
        /> -->
        <van-field
          v-model="form_data.visitor_car_number"
          name="visitor_car_number"
          readonly
          label="车牌号码"
          placeholder="请输入车牌号"
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
          <van-button round block type="warning" @click="resetForm">
            清空表单
          </van-button>
        </div>
        <div style="width: 100%; padding: 0 10px">
          <van-button round block type="primary" @click="submitInvite">
            发送邀请
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
      <!-- <van-date-picker
        v-model="current_date"
        :min-date="today"
        :max-date="plus_one_year"
        @confirm="onDateConfirm"
        @cancel="vistor_datepicker_show = false"
      /> -->
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
    <!-- 时间选择弹出层 -->
    <!-- <van-popup
      safe-area-inset-bottom
      v-model:show="vistor_timepicker_show"
      position="bottom"
      :style="{ height: '40%' }"
    >
      <van-time-picker
        v-model="current_time"
        @confirm="onTimeConfirm"
        @cancel="vistor_timepicker_show = false"
      />
    </van-popup> -->
    <!-- 车牌键盘 -->
    <vnp-keyboard
      v-model="form_data.visitor_car_number"
      v-model:show="vistor_car_keyboard_show"
    ></vnp-keyboard>
  </div>
</template>

<style scoped></style>
