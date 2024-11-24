<template>
  <div v-loading="loading" class="w-full h-full px-5">
    <div class="flex mb-10 justify-between">
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
    width="400"
    center
    :close-on-click-modal="false"
    v-model="showLogTime"
  >
    <div>
      <div>
        <el-form>
          <el-form-item title="Date">
            <el-date-picker
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              v-model="formLogwork.log_date"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item title="Spent Time">
            <el-input v-model="formLogwork.logged_time"></el-input>
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

const logWork = async () => {
  formLogwork.task_id = +props.taskDetail.id
  formLogwork.user_id = appStore.userId
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
</script>

<style scoped></style>
