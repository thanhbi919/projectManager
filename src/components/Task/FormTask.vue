<template>
  <div class="flex flex-col gap-9">
    <!-- Contact Form Start -->
    <DefaultCard :cardTitle="cardTitle">
      <el-form
        label-position="top"
        :model="formData"
        label-width="120px"
        ref="formRef"
        :rules="rules"
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
              :label="project.title"
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
            <el-form-item label="Assign To" prop="assign_to">
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

          <!-- Estimate Time -->
          <el-col :span="5">
            <el-form-item :error="errorMessage" label="Estimate Time" prop="estimated_time">
              <el-input @change="handleChange" v-model="loggedTime"></el-input>
            </el-form-item>
          </el-col>

          <!-- Start Date -->
          <el-col :span="5">
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
          <el-col :span="5">
            <el-form-item label="Due Date" prop="due_date">
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
          <el-button v-if="route.params.id" plain type="danger" @click="deleteTask">
            Delete
          </el-button>
          <el-button plain type="success" @click="submitForm(formRef)">
            {{ route.params.id ? 'Update' : 'Create' }}
          </el-button>
        </div>
      </el-form>
    </DefaultCard>
    <!-- Contact Form End -->
  </div>
</template>

<style scoped>
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
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, vLoading } from 'element-plus'
import { calculateMinutes } from '@/utils/time'
const errorMessage = ref()

const route = useRoute()
const router = useRouter()
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
const loggedTime = ref()

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
  estimated_time: number
}>({})

const rules = {
  title: [
    { required: true, message: 'Title is required', trigger: 'blur' },
    { max: 100, message: 'Title cannot exceed 100 characters', trigger: 'blur' }
  ],
  description: [{ max: 255, message: 'Description cannot exceed 255 characters', trigger: 'blur' }],
  start_date: [{ type: 'date', message: 'Start date must be a valid date', trigger: 'blur' }],
  due_date: [{ type: 'date', message: 'Due date must be a valid date', trigger: 'blur' }],
  project_id: [
    { required: true, message: 'Project is required', trigger: 'change' },
    { type: 'number', message: 'Project must be a valid ID', trigger: 'change' }
  ],
  assign_to: [
    { required: true, message: 'Assigned user is required', trigger: 'blur' },
    { type: 'number', message: 'Assigned user must be a valid ID', trigger: 'change' }
  ],
  priority_id: [
    { required: true, message: 'Priority is required', trigger: 'change' },
    { type: 'number', message: 'Priority must be a valid ID', trigger: 'change' }
  ],
  type_id: [
    { required: true, message: 'Type is required', trigger: 'change' },
    { type: 'number', message: 'Type must be a valid ID', trigger: 'change' }
  ],
  status_id: [
    { required: true, message: 'Status is required', trigger: 'change' },
    { type: 'number', message: 'Status must be a valid ID', trigger: 'change' }
  ]
}
const handleChange = (e) => {
  if (!e) {
    errorMessage.value = 'Estimate is required'
    return
  }

  try {
    formData.value.estimated_time = calculateMinutes(e)
    errorMessage.value = ''
  } catch (e) {
    errorMessage.value = e
  }
}

const getListProjectMember = async (project_id: number) => {
  listProjectMember.value = (await projectRequest.getListProjectMembers(project_id)).data
}

const handleChangeProject = async (project_id) => {
  //TODO get list member of project by id
  formData.value.assign_to = undefined

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
  try {
    const task = (await taskRequest.show(route.params.id)).data
    formData.value.project_id = task.project_id
    formData.value.assign_to = task.assign_to.id
    formData.value.title = task.title
    formData.value.type_id = task.type_id
    formData.value.due_date = task.due_date
    formData.value.start_date = task.start_date
    formData.value.description = task.description
    formData.value.status_id = task.status_id
    formData.value.priority_id = task.priority_id
    loggedTime.value = task.estimated_time
  } catch (e) {
    ElMessage({
      type: 'error',
      message: e
    })
    router.push({
      name: 'taskList'
    })
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  handleChange(loggedTime.value)

  await formEl.validate(async (isValid, invalidFields) => {
    if (isValid) {
      console.log('Submit Form')
      try {
        if (route.params.id) {
          formData.value.name = '123'

          await taskRequest.update(formData.value, route.params.id)
          ElMessage({
            type: 'success',
            message: `Update project ${route.params.id} success`
          })
        } else {
          const appStore = useAppStore()
          await taskRequest.create({ ...formData.value, created_by: appStore.userData.id })
          ElMessage({
            type: 'success',
            message: 'Create project success'
          })
          formEl.resetFields()
          router.push({ name: 'taskList' })
        }
      } catch (e) {
        ElMessage({
          type: 'error',
          message: e
        })
      }
    } else {
      console.error(invalidFields)
    }
  })
}

const deleteTask = async () => {
  try {
    ElMessageBox.confirm('Are you sure?', '', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    })
      .then(async () => {
        try {
          await taskRequest.delete(route.params.id)
          router.push({
            name: 'taskList'
          })
          ElMessage({
            type: 'success',
            message: 'Delete task success'
          })
        } catch (e) {
          ElMessage({
            type: 'error',
            message: e
          })
        }
      })
      .catch(() => {})
  } catch (e) {
    ElMessage({
      type: 'error',
      message: e
    })
  }
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
      await getListProjectMember(formData.value.project_id)
    } else {
      cardTitle.value = 'Task'
    }
  } catch (e) {
    console.log(e)
  }
})
</script>
