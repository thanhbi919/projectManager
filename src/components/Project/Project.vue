<template>
  <div class="flex flex-col gap-9">
    <!-- Contact Form Start -->
    <DefaultCard cardTitle="Project ">
      <form action="#">
        <div class="p-6.5">
          <div class="mb-6 flex gap-3.5">
            <div class="flex-1">
              <label class="mb-2.5 block text-black dark:text-white"> Project Title </label>
              <el-input v-model="formData.title"></el-input>
            </div>
            <div class="flex-1">
              <label class="mb-2.5 block text-black dark:text-white"> Project Type </label>
              <el-select v-model="formData.type_id">
                <el-option
                  v-for="type in typeData"
                  :key="type.id"
                  :value="type.id"
                  :label="type.name"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="mb-6">
            <label class="mb-2.5 block text-black dark:text-white"> Project Description </label>
            <textarea
              v-model="formData.description"
              rows="6"
              placeholder="Project Description"
              class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            ></textarea>
          </div>

          <div>
            <div class="mb-6">
              <label class="mb-2.5 block text-black dark:text-white"> Project member </label>

              <div
                class="mb-2.5 flex w-full gap-3.5"
                v-for="(member, index) in formData.members"
                :key="index"
              >
                <div class="flex flex-1 gap-3.5 items-center">
                  <div>
                    <label>Name</label>
                    <span class="ml-0.5 text-meta-1">*</span>
                  </div>

                  <el-select filterable v-model="member.user_id">
                    <el-option
                      v-for="member in memberData"
                      :key="member.id"
                      :value="member.id"
                      :label="member.name"
                      :disabled="
                        formData.members.filter((item) => item.user_id === member.id).length
                      "
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="flex flex-1 gap-3.5 items-center">
                  <div>
                    <label>Role</label>
                    <span class="ml-0.5 text-meta-1">*</span>
                  </div>

                  <el-select v-model="member.role_id">
                    <el-option
                      v-for="role in roleData"
                      :key="role.id"
                      :value="role.id"
                      :label="role.name"
                    >
                    </el-option>
                  </el-select>
                </div>
                <button
                  v-if="formData.members.length > 1"
                  @click="deleteMember(index)"
                  type="button"
                  class="text-white h-8 bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-2.5 text-center me-2 mb-2"
                >
                  Delete
                </button>
              </div>
              <div class="text-right">
                <button
                  v-if="memberData.length > listMember.length"
                  @click.prevent="addMember"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Add member
                </button>
              </div>
            </div>
          </div>
          <div class="flex justify-between">
            <el-button @click="login">login</el-button>
            <el-button @click="logout">logout</el-button>
            <button
              v-if="memberData.length > listMember.length"
              @click.prevent="submitForm"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              {{ route.params.id ? 'Update' : 'Create' }}
            </button>
          </div>
        </div>
      </form>
    </DefaultCard>
    <!-- Contact Form End -->
  </div>
</template>
<script setup lang="ts">
import DefaultCard from '@/components/Forms/DefaultCard.vue'
import { onBeforeMount, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import {
  authRequest,
  projectRequest,
  projectStatusRequest,
  roleRequest,
  typeRequest,
  userRequest
} from '@/request'
import { useRoute } from 'vue-router'

const route = useRoute()

const pageTitle = ref('Form Layout')

const listMember = ref([{}])

const memberData = ref([])

const roleData = ref([])

const typeData = ref([])

const projectStatusData = ref([])

const formData = ref({
  name: '123123',
  title: '',
  type_id: 1,
  description: '',
  members: [{}]
})

const addMember = () => {
  formData.value.members.push({})
}

const deleteMember = (index: number) => {
  formData.value.members.splice(index, 1)
}

const { login } = useAppStore()

const logout = () => {
  const b = authRequest.logout()
}

const getListType = async () => {
  typeData.value = (await typeRequest.list()).data
}

const getListUser = async () => {
  memberData.value = (await userRequest.list()).data
}

const getListRole = async () => {
  roleData.value = (await roleRequest.list()).data
}

const getDetailProject = async () => {
  formData.value = (await projectRequest.show(+route.params.id)).data.data
}

const getListProjectStatus = async () => {
  projectStatusData.value = (await projectStatusRequest.list()).data
}

const submitForm = async () => {
  if (route.params.id) {
    formData.value.name = '123'
    await projectRequest.update(formData.value, route.params.id)
  } else {
    await projectRequest.create(formData.value)
  }
}

onBeforeMount(async () => {
  // await login()
  try {
    await Promise.all([getListRole(), getListUser(), getListType(), getListProjectStatus()])

    if (route.params.id) {
      //
      await getDetailProject()
    }
  } catch (e) {
    console.log(e)
  }
})
</script>
