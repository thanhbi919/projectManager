<template>
  <div class="flex flex-col gap-10" style="max-height: calc(100vh - 250px)">
    <el-row :gutter="20">
      <el-col v-for="status in statuses" :key="status.id" :span="6">
        <el-card>
          <template #header>
            <!--            <h3>{{ status.name }}</h3>-->
            <div class="flex justify-center">
              <el-tag class="w-20 font-bold text-xs" :type="status.type">{{ status.name }}</el-tag>
            </div>
          </template>
          <draggable
            v-model="tasksByStatus[status.id]"
            group="tasks"
            @end="onDragEnd"
            @change="onChange"
            item-key="id"
            class="drageer"
            @start="onDragStart"
            :data-status-id="status.id"
          >
            <template #item="{ element }">
              <el-card
                @click="openDetail(element)"
                :data-task-id="element.id"
                class="task-card"
                shadow="hover"
              >
                <div class="mb-4 text-xl">{{ element.title }}</div>
                <div class="flex flex-wrap justify-between items-center text-gray-500">
                  <span class="mr-3"><el-avatar :src="element.assign_to?.image"></el-avatar></span>
                  <span class="mr-3">{{ element.type.name }}</span>
                  <span>{{ formatMinutesToTime(element.spent_time) }}</span>
                </div>
              </el-card>
            </template>
          </draggable>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { taskRequest } from '@/request'
import { formatMinutesToTime } from '../../utils/time'

// Nhận props từ component cha
const props = defineProps({
  tasks: Array,
  statuses: Array
})
const taskUpdate = ref<{
  task_id: number
  status_id: number
}>({})

const emits = defineEmits(['openDetail', 'taskUpdated'])

const tasksByStatus = ref()

// Sắp xếp trạng thái theo ID

// Hàm để nhóm task theo trạng thái
const groupTasksByStatus = () => {
  console.log()
  tasksByStatus.value = props.statuses.reduce((acc, status) => {
    console.log(status.name)
    acc[status.id] = props.tasks.filter((task) => task.status_id === status.id)
    return acc
  }, {})
}

// Cập nhật lại tasksByStatus khi props.tasks thay đổi
watch(() => props.tasks, groupTasksByStatus, { immediate: true })

const onDragEnd = async (event) => {
  console.log(1111)
  const { to, from, item } = event
  console.log('to', to.dataset)
  console.log('from', from.dataset)

  taskUpdate.value.status_id = +to.dataset.statusId
  console.log(taskUpdate.value)
  // Gửi yêu cầu cập nhật lên server
  await taskRequest.updateStatus(taskUpdate.value.task_id, {
    status_id: taskUpdate.value.status_id
  })
  emits('taskUpdated')
}

const onDragStart = (event) => {
  console.log(event.item)
  taskUpdate.value.task_id = +event.item.dataset.taskId
}

const openDetail = (task) => {
  emits('openDetail', task)
}
</script>

<style scoped>
.task-card {
  margin-bottom: 15px;
}

.el-row {
  flex-wrap: nowrap;
  overflow-x: auto;
}

.el-row .el-col {
  height: calc(100vh - 270px);
}
</style>
