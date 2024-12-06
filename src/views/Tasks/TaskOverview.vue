<template>
  <div class="flex flex-col gap-10" style="max-height: calc(100vh - 250px)">
    <el-row :gutter="20">
      <el-col v-for="status in statuses" :key="status.id" :span="8">
        <el-card>
          <template #header>
            <h3>{{ status.name }}</h3>
          </template>
          <draggable
            v-model="tasksByStatus[status.id]"
            group="tasks"
            @end="onDragEnd"
            item-key="id"
          >
            <template #item="{ element }">
              <el-card class="task-card" shadow="hover">
                <div>{{ element.title }}</div>
                <div class="task-meta">
                  <el-tag>{{ element.assignee }}</el-tag>
                  <el-tag type="info">{{ element.priority }}</el-tag>
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
import { ref, watch, computed } from 'vue'
import draggable from 'vuedraggable'
import { taskRequest } from '@/request'

const props = defineProps({
  tasks: Array,
  statuses: Array
})

const tasksByStatus = ref({})

// Nhóm task theo trạng thái
const groupTasksByStatus = () => {
  tasksByStatus.value = props.statuses.reduce((acc, status) => {
    acc[status.id] = props.tasks.filter((task) => task.status_id === status.id)
    return acc
  }, {})
}

// Cập nhật lại tasksByStatus khi props.tasks thay đổi
watch(() => props.tasks, groupTasksByStatus, { immediate: true })

const onDragEnd = async (event) => {
  const { item } = event
  const newStatusId = parseInt(event.to.dataset.id, 10) // ID của trạng thái mới

  // Cập nhật trạng thái của task
  item.status_id = newStatusId

  // Gửi yêu cầu cập nhật lên server
  await taskRequest.updateTask(item.id, { status_id: newStatusId })
  emit('task-updated') // Emit sự kiện để thông báo rằng task đã được cập nhật
}
</script>

<style scoped>
.task-card {
  margin-bottom: 15px;
}
</style>
