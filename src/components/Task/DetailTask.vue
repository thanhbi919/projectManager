<template>
  <div v-loading="loading" class="w-full h-full px-5 overflow-auto max-h-125">
    <div class="flex mb-10 justify-between items-center">
      <span class="font-semibold text-title-xl">{{ taskDetail?.title }}</span>
      <div>
        <el-button @click="() => (showLogTime = true)" round type="warning"> Log time </el-button>
      </div>
    </div>

    <!-- Priority -->
    <div class="flex items-center p-3">
      <div class="w-50 space-x-2 flex items-center font-bold text-lg">
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
      <div class="w-50 space-x-2 flex items-center font-bold text-lg">
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
    <!-- Description Section -->
    <div class="flex items-center p-3">
      <div class="w-50 space-x-2 flex items-center font-bold text-lg">
        <el-icon>
          <!-- Dùng Document icon cho Description -->
          <Document />
        </el-icon>
        <span class="mr-4">Description</span>
      </div>

      <!-- Hiển thị nội dung mô tả (taskDetail.description) -->
      <span class="p-1 w-100">{{ taskDetail?.description }}</span>
    </div>

    <!-- Assigned To -->
    <div class="flex items-center p-3">
      <div class="w-50 space-x-2 flex items-center font-bold text-lg">
        <el-icon>
          <User />
        </el-icon>
        <span class="mr-4"> Assign to</span>
      </div>

      <span>{{ taskDetail?.assign_to?.name }}</span>
    </div>

    <!-- Due Date -->
    <div class="flex items-center p-3">
      <div class="w-50 space-x-2 flex items-center font-bold text-lg">
        <el-icon>
          <Calendar />
        </el-icon>
        <span class="mr-4">Due date</span>
      </div>
      <span>{{ taskDetail?.due_date }}</span>
    </div>

    <!-- Spent Time -->
    <div class="flex items-center p-3">
      <div class="w-50 space-x-2 flex items-center font-bold text-lg">
        <el-icon>
          <Timer />
        </el-icon>
        <span class="mr-4"> Spent time</span>
      </div>

      <span>{{ formatMinutesToTime(taskDetail?.spent_time) }}</span>
    </div>

    <!-- Remaining Time -->
    <div class="flex items-center p-3">
      <div class="w-50 space-x-2 flex items-center font-bold text-lg">
        <el-icon>
          <Clock />
        </el-icon>
        <span class="mr-4">Remaining time</span>
      </div>

      <span>{{ formatMinutesToTime(taskDetail?.remaining_time) }}</span>
    </div>
    <!-- Work log history -->
    <div class="p-3">
      <div class="w-50 space-x-2 flex items-center font-bold text-lg">
        <el-icon><AlarmClock /></el-icon>
        <span class="mr-4">Work log history</span>
      </div>
      <div>
        <el-table :data="taskDetail.logs" style="width: 100%">
          <el-table-column label="User" prop="user.name">
            <template v-slot="scope">
              <span>{{ scope.row.user?.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Time Spent" prop="logged_time">
            <template v-slot="scope">
              <span>{{ formatMinutesToTime(scope.row.logged_time) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Log Date" prop="log_date">
            <template v-slot="scope">
              <span>{{ scope.row.log_date }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
        <el-form ref="formRef" :model="formLogwork" :rules="rules" label-width="100px">
          <el-form-item label="Date" prop="log_date">
            <el-date-picker
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              v-model="formLogwork.log_date"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item :error="errorMessage" label="Spent Time">
            <div class="input-spent flex gap-4">
              <el-input @change="handleChange" v-model="loggedTime"></el-input>
            </div>
            <span class="ml-3">Ex: 1w 1h 1m</span>
          </el-form-item>
        </el-form>
        <div class="flex justify-end">
          <el-button type="success" @click="logWork"> Save</el-button>
          <el-button type="danger" @click="() => (showLogTime = false)"> Cancel</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { onBeforeMount, reactive, ref, watch } from 'vue'
import { taskRequest } from '@/request'
import { calculateMinutes, formatMinutesToTime } from '@/utils/time'
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
import { ElMessage } from 'element-plus'

const formRef = ref()
const showLogTime = ref(false)
const props = defineProps<{
  taskDetail: {}
}>()

const rules = {
  log_date: [{ required: true, message: 'Date is required', trigger: 'change' }]
}

const formLogwork = reactive<{
  task_id: number
  user_id: number
  log_date: string
  logged_time: number
}>({})
const appStore = useAppStore()
const loggedTime = ref()
const errorMessage = ref()
const emits = defineEmits(['taskUpdated'])
const handleChange = (e) => {
  if (!e) {
    errorMessage.value = 'Time spent is required'
    return
  }

  try {
    formLogwork.logged_time = calculateMinutes(e)
    errorMessage.value = ''
  } catch (e) {
    errorMessage.value = e
  }
}

watch(
  () => showLogTime.value,
  (ok) => {
    if (!ok) {
      formLogwork.logged_time = undefined
      formLogwork.log_date = undefined
      formLogwork.user_id = undefined
      formLogwork.task_id = undefined
      loggedTime.value = undefined
    }
  }
)

const logWork = async () => {
  handleChange(loggedTime.value)

  formRef.value.validate(async (valid) => {
    console.log(valid)
    if (valid) {
      formLogwork.task_id = +props.taskDetail.id
      formLogwork.user_id = appStore.userData?.id
      try {
        await taskRequest.logWork(formLogwork)
        ElMessage({
          type: 'success',
          message: 'Logwork success'
        })
        emits('taskUpdated')
        showLogTime.value = false
      } catch (e) {
        ElMessage({
          type: 'error',
          message: e
        })
      }
    }
  })
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
  done: { class: 'bg-green-500', icon: Upload }, // Deployed: Purple background with an upload icon
  pending: { class: 'bg-yellow-500', icon: Warning } // Feedback: Yellow background with a warning icon
}

const stylePriority = {
  low: 'bg-green-500', // Low: Gray background with white text
  medium: 'bg-yellow-500', // Medium: Yellow background with white text
  high: 'bg-red-500' // High: Red background with white text
}
</script>

<style scoped>
:deep(.el-input) {
  width: 250px;
}

:deep(.input-spent.el-input-number) {
  width: 50px;
}
</style>
