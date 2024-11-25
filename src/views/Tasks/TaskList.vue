<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="'Tasks'" />
    <!-- Breadcrumb End -->

    <div class="flex flex-col gap-10" style="max-height: calc(100vh - 250px)">
      <div
        class="flex flex-col gap-3.5 p-3 h-30 rounded-xl w-full shadow-4 dark:shadow-gray border border-blue-500 dark:border-blue-50"
        v-for="task in listTask"
        :key="task.id"
      >
        <el-row class="h-full" :align="'middle'" :gutter="20">
          <el-col class="" :span="1.5"
            ><el-icon size="30"><List /></el-icon>
          </el-col>
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

              <el-tag v-if="task.status" type="success">{{ task.status?.name }}</el-tag>
            </div>
            <div>Last updated: {{ task.updated_at }}</div>
          </el-col>
          <el-col class="" :span="8">
            <div class="flex items-center gap-2 justify-end">
              <div v-if="task.remaining_time" class="bg-green-200 text-green-700 p-2 rounded-2xl">
                <el-icon><Clock /></el-icon>
                {{ task.remaining_time ? formatMinutesToTime(task.remaining_time) : '' }}
              </div>

              <div class="w-20 text-nowrap overflow-hidden text-ellipsis text-right">
                {{ task.assign_to.name }}
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-dialog center :close-on-click-modal="false" v-model="showDetail" width="800">
        <DetailTask v-if="showDetail" :task-detail="taskSelected"></DetailTask>
      </el-dialog>
      <el-pagination layout="prev, pager, next" :total="1000" />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import TableTwo from '@/components/Tables/TableTwo.vue'
import TableThree from '@/components/Tables/TableThree.vue'
import TableOne from '@/components/Tables/TableOne.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { taskRequest } from '@/request'
import task from '../../request/task'
import { formatMinutesToTime } from '@/utils/time'
import DetailTask from '@/components/Task/DetailTask.vue'
import project from '@/request/project/project'

const taskSelected = ref()
const showDetail = ref(false)
const route = useRoute()
const filterParams = ref()
const listTask = ref([])
const getListTasks = async (params) => {
  listTask.value = (await taskRequest.list(params)).data.data
}
onBeforeMount(async () => {
  filterParams.value = route.query
  await getListTasks(filterParams.value)
})
</script>

<style scoped></style>
