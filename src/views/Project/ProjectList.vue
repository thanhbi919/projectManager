<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="'Projects'" />
    <!-- Breadcrumb End -->

    <div v-if="appStore.isAdmin()">
      <el-button @click="router.push('projects/create')" class="mb-5" type="primary"
        >Create Project</el-button
      >
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-black">
      <div
        v-for="project in listProject"
        :key="project.id"
        class="dark:bg-blue-200 bg-gray-100 rounded shadow-xl dark:shadow-gray-600 dark:hover:bg-blue-300 hover:bg-gray-200 transition-all duration-500 p-4 min-w-80 h-80 md:min-w-60 grid grid-cols-1 grid-rows-[1fr_5fr_repeat(2,_1fr)] gap-0"
      >
        <div
          class="row-span-1 col-span-1 flex gap-1 justify-between items-center border-b-2 border-black-2 dark:border-blue-500 p-2"
        >
          <div
            @click="
              () => {
                if (appStore.isPm()) $router.push(`/projects/${project.id}`)
              }
            "
            class="text-xl font-extrabold text-nowrap text-ellipsis overflow-hidden hover:underline hover:opacity-80 cursor-pointer"
          >
            {{ project.title }}
          </div>
          <el-tag
            :type="
              getProjectStatus(project) === 'close'
                ? 'info'
                : getProjectStatus(project)
                  ? 'primary'
                  : 'success'
            "
          >
            {{ getProjectStatus(project) }}
          </el-tag>
        </div>
        <div class="row-span-5 col-span-1px-2 py-8">
          {{ project.description }}
        </div>
        <div class="row-span-1 col-span-1 mt-3 text-red-500 font-semibold">
          Deadline : {{ project.end_date }}
        </div>
        <div class="row-span-1 col-span-1 mt-5 max-h-60 flex justify-between">
          <div class="overflow-hidden text-nowrap text-ellipsis max-w-40">
            <span
              :style="{ 'margin-left': index ? '-20px' : '' }"
              v-for="(member, index) in project.users"
              :key="member.id"
            >
              <el-avatar
                class="cursor-pointer hover:scale-105"
                @click="
                  $router.push({
                    name: 'userDetail',
                    params: {
                      id: member.id
                    }
                  })
                "
                fit="cover"
                :src="member.image"
              >
              </el-avatar>
            </span>
          </div>
          <div
            @click="
              () =>
                $router.push({
                  name: 'taskList',
                  query: {
                    project_id: project.id
                  }
                })
            "
            class="hover:underline cursor-pointer text-gray-400 flex items-center gap-1 text-nowrap"
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.3329 9.44159V14.3203C18.3329 17.5728 17.504 18.3859 14.1883 18.3859H5.89901C2.58332 18.3859 1.75439 17.5728 1.75439 14.3203V6.18912C1.75439 2.93665 2.58332 2.12354 5.89901 2.12354H7.1424C8.38579 2.12354 8.65933 2.48131 9.13182 3.09928L10.3752 4.72551C10.6902 5.13207 10.8726 5.376 11.7015 5.376H14.1883C17.504 5.376 18.3329 6.18912 18.3329 9.44159Z"
                stroke="#5C5967"
                stroke-miterlimit="10"
              />
              <path
                d="M7.14221 2.12354H14.6025C16.2604 2.12354 17.0893 2.93665 17.0893 4.56289V5.68499"
                stroke="#5C5967"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.1158 12.6938H7.97119"
                stroke="#5C5967"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {{ project.tasks_count }} {{ project.tasks_count > 1 ? 'ISSUES' : 'ISSUE' }}
          </div>
        </div>
      </div>
      <div class="text-white" v-if="!listProject.length">No data</div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import { projectRequest, projectStatusRequest } from '@/request'
import { onMounted, ref } from 'vue'
import { useWaitAppBooted } from '@/composable/useBooted'
import router from '@/router'
import { useAppStore } from '@/stores/app'
const listProject = ref([])
const projectStatusData = ref([])
const appStore = useAppStore()
const showDetail = ref(true)
const getListProject = async () => {
  console.log('222')
  listProject.value = (await projectRequest.list()).data.data
}

const getProjectStatus = (project) => {
  return projectStatusData.value.find((item) => item.id === project.status_id)?.name
}

const getListProjectStatus = async () => {
  console.log('111')
  projectStatusData.value = (await projectStatusRequest.list()).data
}

useWaitAppBooted(async () => {
  await Promise.all([getListProject(), getListProjectStatus()])
})
</script>

<style scoped></style>
