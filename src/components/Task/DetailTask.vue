<template>
  <div v-loading="loading" class="w-full h-full px-5">
    <div class="flex mb-10 justify-between items-center">
      <span class="font-semibold text-title-xl">{{ taskDetail?.title }}</span>
      <div>
        <el-button @click="() => (showLogTime = true)" round type="warning"> Log time </el-button>
      </div>
    </div>

    <!-- Priority -->
    <div class="flex items-center p-3">
      <div class="w-50 space-x-2 flex items-center">
        <el-icon>
          <Star />
        </el-icon>
        <span class="mr-4">Priority</span>
      </div>
      <span
        class="py-1 px-10 w-40 text-center text-black rounded-xl"
        :class="stylePriority[taskDetail?.priority?.name]"
        >{{ taskDetail?.priority?.name }}</span
      >
    </div>
    <!-- Status -->
    <div class="flex items-center p-3">
      <div class="w-50 space-x-2 flex items-center">
        <el-icon>
          <Check></Check>
        </el-icon>
        <span class="mr-4">Status</span>
      </div>
      <span
        class="p-1 text-black px-10 w-40 text-center rounded-xl"
        :class="styleStatus[taskDetail?.status?.name]?.class"
        >{{ taskDetail?.status?.name }}</span
      >
    </div>

    <!-- Assigned To -->
    <div class="flex items-center p-3">
      <div class="w-50 space-x-2 flex items-center">
        <el-icon>
          <User />
        </el-icon>
        <span class="mr-4"> Assign to</span>
      </div>

      <span>{{ taskDetail?.assign_to?.name }}</span>
    </div>

    <!-- Due Date -->
    <div class="flex items-center p-3">
      <div class="w-50 space-x-2 flex items-center">
        <el-icon>
          <Calendar />
        </el-icon>
        <span class="mr-4">Due date</span>
      </div>
      <span>{{ taskDetail?.due_date }}</span>
    </div>

    <!-- Spent Time -->
    <div class="flex items-center p-3">
      <div class="w-50 space-x-2 flex items-center">
        <el-icon>
          <Timer />
        </el-icon>
        <span class="mr-4"> Spent time</span>
      </div>

      <span>{{ formatMinutesToTime(taskDetail?.spent_time) }}</span>
    </div>

    <!-- Remaining Time -->
    <div class="flex items-center p-3">
      <div class="w-50 space-x-2 flex items-center">
        <el-icon>
          <Clock />
        </el-icon>
        <span class="mr-4">Remaining time</span>
      </div>

      <span>{{ formatMinutesToTime(taskDetail?.remaining_time) }}</span>
    </div>
  </div>

  <el-dialog
    title="Add Spent Time"
    width="500"
    center
    :close-on-click-modal="false"
    v-model="showLogTime"
  >
    <div>
      <div>
        <el-form label-width="100px">
          <el-form-item label="Date">
            <el-date-picker
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              v-model="formLogwork.log_date"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="Spent Time">
            <div class="input-spent flex gap-4">
              <el-input-number
                max="10"
                :controls="false"
                v-model="formLogwork.logged_time"
              ></el-input-number
              >Day
              <el-input-number
                max="24"
                :controls="false"
                v-model="formLogwork.logged_time"
              ></el-input-number
              >Hours
              <el-input-number
                max="60"
                :controls="false"
                v-model="formLogwork.logged_time"
              ></el-input-number
              >Minute
            </div>
          </el-form-item>
        </el-form>

        <el-button @click="logWork"> Save</el-button>
        <el-button @click="() => (showLogTime = false)"> Cancel</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue'
import { taskRequest } from '@/request'
import { useRoute } from 'vue-router'
import router from '@/router'
import { formatMinutesToTime } from '@/utils/time'
import {
  CircleCheck,
  Refresh,
  ChatLineRound,
  Upload,
  Warning,
  Close,
  Check
} from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'

const showLogTime = ref(false)
const props = defineProps<{
  taskDetail: {}
}>()

const formLogwork = reactive<{
  task_id: number
  user_id: number
  log_date: string
  logged_time: number
}>({})
const appStore = useAppStore()
const workLogDay = ref()
const workLogHour = ref()
const workLogMinutes = ref()

const logWork = async () => {
  formLogwork.task_id = +props.taskDetail.id
  formLogwork.user_id = appStore.userData.id
  await taskRequest.logWork(formLogwork)
}
const loading = ref(false)
onBeforeMount(async () => {
  if (props.id) {
    loading.value = true
    await getDetailTask()
    loading.value = false
  } else {
    // router.back()
  }
})
const styleStatus = {
  open: { class: 'bg-gray-500', icon: Refresh }, // Open: Gray background with a refresh icon
  inprogress: { class: 'bg-blue-500', icon: ChatLineRound }, // In Progress: Blue background with a chat icon
  resolve: { class: 'bg-green-500', icon: Check }, // Resolved: Green background with a check icon
  deploy: { class: 'bg-purple-500', icon: Upload }, // Deployed: Purple background with an upload icon
  feedback: { class: 'bg-yellow-500', icon: Warning }, // Feedback: Yellow background with a warning icon
  reopen: { class: 'bg-red-500', icon: Close }, // Reopened: Red background with a close icon
  done: { class: 'bg-green-500', icon: CircleCheck } // Done: Teal background with a circle check icon
}

const stylePriority = {
  low: 'bg-green-500', // Low: Gray background with white text
  medium: 'bg-yellow-500', // Medium: Yellow background with white text
  high: 'bg-red-500' // High: Red background with white text
}

function formatTime(value) {
  const minutes = parseInt(value, 10)

  if (!minutes || isNaN(minutes)) {
    return ''
  }

  const days = Math.floor(minutes / 1440) // 1 day = 1440 minutes
  const remainingMinutesAfterDays = minutes % 1440

  const hours = Math.floor(remainingMinutesAfterDays / 60) // 1 hour = 60 minutes
  const remainingMinutes = remainingMinutesAfterDays % 60

  let result = ''

  if (days > 0) result += `${days} day${days > 1 ? 's' : ''} `
  if (hours > 0) result += `${hours} hour${hours > 1 ? 's' : ''} `
  if (remainingMinutes > 0) result += `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`

  return result.trim()
}

// Chuyển đổi giá trị hiển thị ngược về phút
function parseMinutes(value) {
  const regex = /(\d+)\s*day[s]?\s*(\d+)?\s*hour[s]?\s*(\d+)?\s*minute[s]?/i
  const match = value.match(regex)

  if (match) {
    const days = parseInt(match[1] || 0, 10)
    const hours = parseInt(match[2] || 0, 10)
    const minutes = parseInt(match[3] || 0, 10)

    return days * 1440 + hours * 60 + minutes
  }

  // Nếu không match, trả lại số phút hoặc giá trị cũ
  return parseInt(value, 10) || 0
}
</script>

<style scoped>
:deep(.el-input) {
  width: 300px;
}

:deep(.input-spent) {
  .el-input-number {
    width: 50px;
  }
}
</style>
