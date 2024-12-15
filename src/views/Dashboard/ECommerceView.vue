<template>
  <DefaultLayout>
    <div v-if="appStore.isAdmin()" id="dashboard-admin">
      <el-row class="gap-3 justify-around items-center ">
        <el-col class=" text-center p-6 bg-lime-100 rounded-xl text-black font-bold " :span="5">
          <el-icon size="20" color="black">
            <Suitcase/>
          </el-icon>
          <span class="ml-2 mr-2 text-xl">PROJECTS</span>
          <div class=" mx-auto mt-2 p-3 rounded-full leading-4 bg-lime-300 w-10 h-10">{{ totalProjects }}</div>
        </el-col>
        <el-col class="text-center p-6 bg-green-100 rounded-xl text-black font-bold" :span="5">
          <el-icon size="20" color="black">
            <Avatar/>
          </el-icon>
          <span class="ml-2 mr-2 text-xl">USERS</span>
          <div class="mx-auto mt-2 p-3 rounded-full leading-4 bg-green-300 w-10 h-10">{{ totalUsers }}</div>

        </el-col>
        <el-col class="text-center p-6 bg-purple-100 rounded-xl text-black font-bold" :span="5">
          <el-icon size="20" color="black">
            <Memo/>
          </el-icon>
          <span class="ml-2 mr-2 text-xl">TASKS</span>
          <div class="mx-auto mt-2 p-3 rounded-full leading-4 bg-purple-300 w-10 h-10">{{ totalTasks }}</div>

        </el-col>
      </el-row>
      <div class="chart-container flex mt-5 gap-10">
        <div class="flex-1 flex flex-col bg-cyan-950 shadow-lg rounded-xl  p-2 justify-center ">
          <p class="text-center font-bold text-xl">Project Overview</p>
          <Pie style="max-height: 300px;width: auto;" id="chart-project" :options="chartOptions"
               :data="chartDataProject"/>
        </div>
        <div class="flex-1 flex flex-col bg-cyan-950 shadow-lg rounded-xl  p-2 justify-center ">
          <p class="text-center font-bold text-xl">Task overview</p>
          <Pie style="max-height:300px" id="chart-task" :options="chartOptions" :data="chartDataTask"/>
        </div>
      </div>
    </div>

    <div v-if="appStore?.userData?.department?.name !=='admin'" id="dashboard-pm">
      <el-row class="gap-3 justify-around items-center ">
        <el-col class=" text-center p-6 bg-lime-100 rounded-xl text-black font-bold " :span="5">
          <el-icon size="20" color="black">
            <Suitcase/>
          </el-icon>
          <span class="ml-2 mr-2 text-xl">PROJECTS</span>
          <div class=" mx-auto mt-2 p-3 rounded-full leading-4 bg-lime-300 w-10 h-10">{{ totalProjects }}</div>
        </el-col>
        <el-col class="text-center p-6 bg-green-100 rounded-xl text-black font-bold" :span="5">
          <el-icon size="20" color="black">
            <Avatar/>
          </el-icon>
          <span class="ml-2 mr-2 text-xl">USERS</span>
          <div class="mx-auto mt-2 p-3 rounded-full leading-4 bg-green-300 w-10 h-10">{{ totalUsers }}</div>

        </el-col>
        <el-col class="text-center p-6 bg-purple-100 rounded-xl text-black font-bold" :span="5">
          <el-icon size="20" color="black">
            <Memo/>
          </el-icon>
          <span class="ml-2 mr-2 text-xl">TASKS</span>
          <div class="mx-auto mt-2 p-3 rounded-full leading-4 bg-purple-300 w-10 h-10">{{ totalTasks }}</div>

        </el-col>
      </el-row>
      <div class="bg-cyan-950 h-100 mt-10 p-4 rounded-xl flex flex-col">
        <Bar style="max-height: 400px" id="chart-task-pm" :options="chartOptions" :data="chartDataTask"/>
      </div>

      <div class="mt-5 relative bg-cyan-950 p-4 rounded-xl flex flex-col">
        <div class="absolute    left-1/2 transform -translate-x-1/2  text-xl font-bold italic " style="color: #436dc1">Detail Task for member</div>
        <div   class="text-end mb-3 h-10">
          <span v-if="appStore.userData.department=='pm'" class="mr-2" >PROJECT:</span>

          <el-select v-if="appStore.userData.department=='pm'"  class="w-20" v-model="selectedProject" @change="getTaskByMember">
            <el-option v-for="project in listProject" :key="project.id" :value="project.id"
                       :label="project.title"></el-option>
          </el-select>
        </div>


        <el-table border head lazy :data="dataTable" stripe style="max-height: 400px">
          <el-table-column v-if="appStore.userData.department!=='pm'" align="center" label="Member Name">
            <template #default="scope">{{
              scope.row.project[scope.$index].project.title}}</template>
          </el-table-column>
          <el-table-column align="center" prop="member_name" label="Member Name"/>


          <el-table-column align="center" prop="total_tasks" label="Total Tasks"/>
          <el-table-column align="center" prop="open" label="Open"/>
          <el-table-column align="center" prop="in_progress" label="In Progress"/>
          <el-table-column align="center" prop="pending" label="Pending"/>
          <el-table-column align="center" prop="done" label="Done"/>
          <el-table-column align="center" prop="overdue_tasks" label="Overdue Tasks">
            <template #default="{ row }">
              <el-tag type="danger" v-if="row.overdue_tasks > 0">{{ row.overdue_tasks }}</el-tag>
              <el-tag type="success" v-else>0</el-tag>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </div>

  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import {useWaitAppBooted} from '@/composable/useBooted'
import {dashboardRequest, projectRequest} from '@/request'
import {ref, nextTick} from 'vue'
import {Pie} from 'vue-chartjs'
import {Bar} from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js'
import {useAppStore} from "@/stores/app";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, ChartDataLabels)

const dataDashboard = ref(null)
const totalTasks = ref(0)
const totalProjects = ref(0)
const totalUsers = ref(0)
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  datalabels: {
    formatter: (value, context) => {
      if (value === 0) {
        return null; // Không hiển thị nếu giá trị bằng 0
      }
      console.log(11111, context)
      const label = context.chart.data.labels[context.dataIndex]; // Lấy tên label

      const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
      const percentage = ((value / total) * 100).toFixed(2);
      return `${label} :${percentage}%`; // Hiển thị phần trăm
    },
    color: '#fff',
    font: {
      size: 14,
      weight: 'bold',
    },
  },
  plugins: {
    title: {
      display: true, // Hiển thị tiêu đề
      // text: 'Task Distribution by Status', // Nội dung tiêu đề
      font: {
        size: 20, // Kích thước chữ
        weight: 'bold', // Đậm
      },
      color: '#333', // Màu sắc tiêu đề
      padding: {
        top: 10,
        bottom: 10,
      },
    },
    legend: {
      display: true, // Hiển thị chú thích
      position: 'right', // Vị trí chú thích
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.label || '';
          const value = context.raw || 0;
          return `${label}: ${value}%`;
        },
      },
    },
  },
})
const chartDataProject = ref({
  labels: [],
  datasets: [{data: []}]
})

const chartDataTask = ref({
  labels: [],
  datasets: [{
    data: []
  }]
})
const listProject = ref([])
const dataTable = ref([])
const selectedProject = ref()
const getListProject = async () => {
  console.log('222')
  listProject.value = (await projectRequest.list()).data.data
}
const getTaskByMember = async (projectId: number) => {
 if(appStore.userData.department.name === 'pm'){
   dataTable.value = (await dashboardRequest.taskByMember(projectId)).data

 }else{
   console.log(appStore.userData.department.name)
   dataTable.value = (await dashboardRequest.myTask(projectId)).data
 }
  console.log(dataTable.value)
}
const appStore = useAppStore()
useWaitAppBooted(async () => {
  await nextTick() // Đảm bảo DOM đã render
  await getListProject()
  selectedProject.value = listProject.value[0].id
  if (appStore.isAdmin()) {
    // Lấy dữ liệu dashboard
    dataDashboard.value = (await dashboardRequest.overviewAdmin()).data.data
    totalTasks.value = dataDashboard.value?.total_tasks || 0
    totalProjects.value = dataDashboard.value?.total_projects || 0
    totalUsers.value = dataDashboard.value?.total_users || 0
    // Lấy dữ liệu biểu đồ
    const data = (await dashboardRequest.projectDistribution()).data.data

    const statusLabels = data.map((item) => item.status)
    const totalCount = data.reduce((sum, item) => sum + item.count, 0) // Tính tổng số count
    const projectCounts = data.map((item) => ((item.count / totalCount) * 100).toFixed(2)) // Tính phần trăm và làm tròn
    chartDataProject.value = {
      labels: statusLabels,
      datasets: [
        {
          label: '%',
          backgroundColor: ['#909285', '#2e95ff', '#e09a37', '#67c234'],
          data: projectCounts
        }
      ]
    }
    const dataTask = (await dashboardRequest.taskDistribution()).data.data
    const statusLabelsTask = dataTask.map((item) => item.status)
    const totalCountTask = dataTask.reduce((sum, item) => sum + item.count, 0) // Tính tổng số count
    const taskCounts = dataTask.map((item) => ((item.count / totalCountTask) * 100).toFixed(2))
    chartDataTask.value = {
      labels: statusLabelsTask,
      datasets: [
        {
          label: '%',
          backgroundColor: ['#1eaa35', '#4980ec', '#d3cbcb', '#cfb324'],
          data: taskCounts
        }
      ]
    }


  }

  if (appStore.userData.department.name !== 'admin') {
    // Lấy dữ liệu dashboard
    dataDashboard.value = (await dashboardRequest.overviewPm()).data.data
    totalTasks.value = dataDashboard.value?.total_tasks || 0
    totalProjects.value = dataDashboard.value?.total_projects || 0
    totalUsers.value = dataDashboard.value?.total_members || 0
    const allStatuses = ['open', 'inprogress', 'pending', 'done'];

    const data = (await dashboardRequest.taskProgress()).data.data
    const labels = data?.map(item => item.project_name)
    const countTaskInprogress = data?.map(item => item.tasks.inprogress)
    const countTaskDone = data?.map(item => item.tasks.done)
    const countTaskPending = data?.map(item => item.tasks.pending)
    const countTaskOpen = data?.map(item => item.tasks.open)
    console.log(labels)
    chartDataTask.value = {
      labels: labels, // Tên các dự án
      datasets: [
        {
          label: 'Open',
          data: countTaskOpen,
          backgroundColor: '#ccc4c3', // Màu đỏ
        },
        {
          label: 'In Progress',
          data: countTaskInprogress,
          backgroundColor: '#3b64bf',
        },
        {
          label: 'Done',
          data: countTaskDone,
          backgroundColor: '#4caf50',
        },
        {
          label: 'Pending',
          data: countTaskPending,
          backgroundColor: '#ba9725',
        },
      ],
    };
    console.log(chartDataTask.value)
    let delayed;
    chartOptions.value = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default' && !delayed) {
            delay = context.dataIndex * 300 + context.datasetIndex * 100;
          }
          return delay;
        },
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Tasks status for project',
          color: "#436dc1",
          font: {
            size: 25,
            style: 'italic'
          }
        },
      },
      scales: {
        x: {
          type: 'category',
          stacked: true,
          title: {
            display: true,
            text: 'Projects Name',
            color: "#436dc1",
            font: {
              size: 16
            },
            showLabelBackdrop: true
          },
        },
        y: {
          type: 'linear',
          stacked: true,
          title: {
            display: true,
            text: 'Number of Tasks',
            color: "#436dc1",
            font: {
              size: 16
            },
          },
          ticks: {
            stepSize: 1, // Khoảng cách giữa các giá trị trên trục Y
            beginAtZero: true, // Bắt đầu từ 0
            precision: 0, // Hiển thị số nguyên
          },
        },
      },
    }
  }
  await getTaskByMember(selectedProject.value)
  // dataTable.value =data
})


</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}

.el-statistic {

  font-size: 20px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #330606;

  .el-statistic__head {
    --el-statistic-title-color: "#330606";

    font-size: 10px;
    color: red !important;
  }

  .el-statistic__content {
    color: red !important;
  }
}

.el-statistic__head {
  font-size: 20px;
}

canvas {
  //width: 500px;
}

:deep(.el-select) {
  width: 200px;
}


</style>
