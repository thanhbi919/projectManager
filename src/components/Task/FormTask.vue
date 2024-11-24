<template>
  <div class="flex flex-col gap-9">
    <!-- Contact Form Start -->
    <DefaultCard :cardTitle="cardTitle">
      <el-form
        label-position="top"
        :model="formData"
        label-width="120px"
        ref="formRef"
        :rules="formRules"
        class="p-6.5"
      >
        <!--          Project-->
        <el-form-item label="Project" prop="project_id">
          <el-select
            clearable
            filterable
            v-model="formData.project_id"
            placeholder="Select Project"
            @change="handleChangeProject"
          >
            <el-option
              v-for="project in listProject"
              :key="project.id"
              :value="project.id"
              :label="project.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Task Title" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <!-- Task Title -->

          <!-- Task Type -->
          <el-col :span="8">
            <el-form-item label="Task Type" prop="type_id">
              <el-select v-model="formData.type_id" placeholder="Select Type">
                <el-option
                  v-for="type in typeData"
                  :key="type.id"
                  :value="type.id"
                  :label="type.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Task Priority -->
          <el-col :span="8">
            <el-form-item label="Priority">
              <el-select v-model="formData.priority_id" placeholder="Select Status">
                <el-option
                  v-for="status in listTaskPriorityData"
                  :key="status.id"
                  :value="status.id"
                  :label="status.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- Task Status -->
          <el-col :span="8">
            <el-form-item label="Task Status" prop="status_id">
              <el-select v-model="formData.status_id" placeholder="Select Status">
                <el-option
                  v-for="status in taskStatusData"
                  :key="status.id"
                  :value="status.id"
                  :label="status.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Task Description -->
        <el-form-item label="Task Description" prop="description">
          <el-input
            type="textarea"
            v-model="formData.description"
            rows="4"
            placeholder="Task Description"
          ></el-input>
        </el-form-item>

        <!-- Assign To -->

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Assign To">
              <el-select
                filterable
                :disabled="!formData.project_id"
                default-first-option
                v-model="formData.assign_to"
                placeholder=""
              >
                <el-option
                  v-for="member in listProjectMember"
                  :key="member.user_id"
                  :value="member.user_id"
                  :label="member.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- Start Date -->
          <el-col :span="4">
            <el-form-item label="Start Date" prop="start_date">
              <el-date-picker
                type="date"
                placeholder="Pick a date"
                v-model="formData.start_date"
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
                class="w-full"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <!-- Due Date -->
          <el-col :span="4">
            <el-form-item label="End Date" prop="end_date">
              <el-date-picker
                type="date"
                placeholder="Pick a date"
                v-model="formData.due_date"
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
                class="w-full"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Buttons -->
        <div class="flex justify-end gap-4">
          <el-button plain type="success" @click="submitForm(formRef)">
            {{ route.params.id ? 'Update' : 'Create' }}
          </el-button>
        </div>
      </el-form>
    </DefaultCard>
    <!-- Contact Form End -->
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-input.el-date-editor) {
  width: 100%;
}

:deep(.el-form-item__label) {
  font-weight: 700;
}
</style>

<script setup lang="ts">
import DefaultCard from '@/components/Forms/DefaultCard.vue'
import { onBeforeMount, reactive, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import {
  authRequest,
  projectRequest,
  projectStatusRequest,
  roleRequest,
  taskRequest,
  typeRequest,
  userRequest
} from '@/request'
import { useRoute } from 'vue-router'
import { ElMessage, type FormInstance, vLoading } from 'element-plus'

const route = useRoute()
const cardTitle = ref()

const formRef = ref<FormInstance>()
const pageTitle = ref('Form Layout')

const listMember = ref([{}])

const memberData = ref([])

const roleData = ref([])

const typeData = ref([])

const taskStatusData = ref([])
const listTaskPriorityData = ref([])
const listProjectMember = ref([])

const formData = ref<{
  title: string
  description: string
  assign_to: number
  project_id: number
  status_id: number
  priority_id: number
  type_id: number
  start_date: string
  due_date: string
}>({})

const formRules = reactive({})

const getListProjectMember = async (project_id: number) => {
  listProjectMember.value = (await projectRequest.getListProjectMembers(project_id)).data
}

const handleChangeProject = async (project_id) => {
  //TODO get list member of project by id

  await getListProjectMember(project_id)
}

const listProject = ref()

const getListType = async () => {
  typeData.value = (await taskRequest.getListTaskType()).data
}

const getListTaskStatus = async () => {
  taskStatusData.value = (await taskRequest.getListTaskStatus()).data
}

const getListTaskPriority = async () => {
  listTaskPriorityData.value = (await taskRequest.getListTaskPriority()).data
}

const getListUser = async () => {
  memberData.value = (await userRequest.list()).data
}

const getListRole = async () => {
  roleData.value = (await roleRequest.list()).data
}

const getListProject = async () => {
  listProject.value = (await projectRequest.list()).data.data
}

const getDetailTask = async () => {
  formData.value = (await taskRequest.show(route.params.id)).data
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (isValid, invalidFields) => {
    if (isValid) {
      console.log('Submit Form')
      try {
        if (route.params.id) {
          formData.value.name = '123'
          await projectRequest.update(formData.value, route.params.id)
          ElMessage({
            type: 'success',
            message: `Update project ${route.params.id} success`
          })
        } else {
          await projectRequest.create(formData.value)
          ElMessage({
            type: 'success',
            message: 'Create project success'
          })
        }

        formEl.resetFields()
      } catch (e) {
        console.error(error)
        ElMessage({
          type: 'success',
          message: error
        })
      }
    } else {
      console.error(invalidFields)
    }
  })
}

onBeforeMount(async () => {
  // await login()
  try {
    await Promise.all([
      getListRole(),
      getListUser(),
      getListType(),
      getListTaskStatus(),
      getListProject(),
      getListTaskPriority()
    ])

    if (route.params.id) {
      //
      await getDetailTask()
      cardTitle.value = formData.value.title
    } else {
      cardTitle.value = 'Task'
    }
  } catch (e) {
    console.log(e)
  }
})
</script>
