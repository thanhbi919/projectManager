<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-black">
      <div
        v-for="project in listProject"
        :key="project.id"
        class="relative bg-blue-200 p-4 min-w-80 h-80"
      >
        <div class="flex justify-between items-center border-b-2 border-blue-500 p-2">
          <div
            @click="() => $router.push(`/projects/${project.id}`)"
            class="text-xl font-extrabold text-nowrap text-ellipsis overflow-hidden hover:underline hover:opacity-80 cursor-pointer"
          >
            {{ project.title }}
          </div>
          <div class="bg-green-200 px-2 py-1 text-green-800 text-sm rounded">status</div>
        </div>
        <div class="">
          <div class="px-2 py-8">
            {{ project.description }}
          </div>

          <div class="mt-3 text-red-500 font-semibold">Deadline : 05 APRIL 2023</div>
          <div class="absolute bottom-4 left-4 mt-5 max-h-60 flex justify-between w-72">
            <div class="overflow-hidden text-nowrap text-ellipsis max-w-40">
              <span v-for="(member, index) in project.users" :key="member.id">
                {{ member.name }}<span v-if="index < project.users.length - 1">, </span>
              </span>
            </div>
            <div class="text-gray-400 flex items-center gap-1.5">
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
              14 issue
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import { projectRequest } from '@/request'
import { onMounted, ref } from 'vue'
import project from '../../request/project/project'
const listProject = ref()
const getListProject = async () => {
  listProject.value = (await projectRequest.list()).data.data
}

onMounted(async () => {
  await getListProject()
})
</script>

<style scoped></style>
