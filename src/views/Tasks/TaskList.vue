<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="'Tasks'" />
    <!-- Breadcrumb End -->
    <div v-if="appStore.booted && appStore.isTester()">
      <el-button @click="$router.push('tasks/create')" class="mb-5" type="primary">
        Create Task
      </el-button>
    </div>

    <!-- Tabs for task views -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="List" name="list"></el-tab-pane>
      <el-tab-pane label="Overview" name="overview"></el-tab-pane>
    </el-tabs>

    <div
      v-if="activeTab === 'list'"
      class="flex flex-col gap-10"
      style="max-height: calc(100vh - 250px)"
    >
      <div
        class="flex flex-col gap-3.5 p-3 h-30 rounded-xl w-full shadow-4 dark:shadow-gray border border-blue-500 dark:border-blue-50"
        v-for="task in listTask"
        :key="task.id"
      >
        <el-row class="h-full" :align="'middle'" :gutter="20">
          <el-col :span="1.5"
            ><el-icon size="30"><List /></el-icon
          ></el-col>
          <el-col class="flex" :span="14">
            <div class="flex gap-3.5 items-center h-full mb-3">
              <div
                @click="
                  () => {
                    taskSelected = task
                    showDetail = true
                  }
                "
                class="font-semibold text-gray-400 text-title-xsm hover:underline cursor-pointer"
              >
                {{ task.title }}
              </div>
              <el-tag
                v-if="task.status"
                :type="statuses.filter((item) => item.id === task.status?.id)[0].type"
                >{{ task.status?.name }}</el-tag
              >
            </div>
            <div>Last updated: {{ task.updated_at }}</div>
          </el-col>
          <el-col :span="8">
            <div class="flex items-center gap-2 justify-end">
              <div class="flex items-center gap-2 bg-green-200 text-green-700 p-2 rounded-2xl">
                <el-icon><Clock /></el-icon>
                {{ task.remaining_time ? formatMinutesToTime(task.remaining_time) : '0m' }}
              </div>
              <div class="w-20 text-nowrap overflow-hidden text-ellipsis text-right">
                <el-avatar :src="task?.assign_to?.image"></el-avatar>
              </div>

              <div
                @click="
                  () =>
                    $router.push({
                      name: 'taskDetail',
                      params: {
                        id: task.id
                      }
                    })
                "
                class="ml-4 cursor-pointer hover:shadow-amber-800"
                v-if="appStore.isPm() || appStore.userData?.id === task.created_by"
              >
                <el-icon size="30">
                  <Edit></Edit>
                </el-icon>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div v-if="activeTab === 'overview'">
      <OverviewTask1
        @open-detail="openDetail"
        :tasks="listTask"
        :statuses="statuses"
        @task-updated="getListTasks"
      />
    </div>

    <el-dialog center :close-on-click-modal="false" v-model="showDetail" width="800">
      <DetailTask
        v-if="showDetail"
        @task-updated="taskUpdated"
        :task-detail="taskSelected"
      ></DetailTask>
    </el-dialog>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { taskRequest } from '@/request'
import { formatMinutesToTime } from '@/utils/time'
import DetailTask from '@/components/Task/DetailTask.vue'
import { useAppStore } from '@/stores/app'
import OverviewTask1 from '@/components/Task/OverviewTask1.vue'

const taskSelected = ref()
const showDetail = ref(false)
const route = useRoute()
const filterParams = ref()
const listTask = ref([])
const appStore = useAppStore()
const activeTab = ref('list')
const statuses = [
  { id: 1, name: 'Open', type: 'info' },
  { id: 2, name: 'Inprogess', type: 'primary' },
  { id: 3, name: 'Pending', type: 'warning' },
  { id: 4, name: 'Done', type: 'success' }
]

const getListTasks = async (params) => {
  listTask.value = (await taskRequest.list(params)).data.data
  console.log(listTask.value)
}

const handleTabClick = (tab) => {
  if (tab.name === 'overview') {
    getListTasks(filterParams.value)
  }
}
const taskUpdated = async () => {
  await getListTasks()
  taskSelected.value = listTask.value.find((item) => item.id === taskSelected.value.id)
}

onBeforeMount(async () => {
  filterParams.value = route.query
  await getListTasks(filterParams.value)
})

const openDetail = (task) => {
  console.log('eeeee')
  taskSelected.value = task
  showDetail.value = true
}
</script>

<style scoped></style>
