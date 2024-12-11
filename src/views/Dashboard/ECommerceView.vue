<template>
  <DefaultLayout>
    <el-row class="border p-10 border-blue-50 bg-blue-800">
      <el-col class="text-center" :span="8">
        <el-statistic title=" Total Projects" :value="totalProjects"/>
      </el-col>
      <el-col class="text-center" :span="8">
        <el-statistic title="Total Users" :value="totalUsers"/>
      </el-col>
      <el-col class="text-center" :span="8">
        <el-statistic title="Total Tasks" :value="totalTasks"/>
      </el-col>
    </el-row>
    <div class="chart-container flex justify-evenly mt-5" style="width: 100%; height: 400px">
      <div>
        <p class="text-center font-bold text-xl">Project Overview</p>
        <Pie  id="chart-project" :options="chartOptions" :data="chartDataProject"/>
      </div>
      <div>
        <p class="text-center font-bold text-xl">Task overview</p>
        <Pie id="chart-task" :options="chartOptions" :data="chartDataTask"/>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import {useWaitAppBooted} from '@/composable/useBooted'
import {dashboardRequest} from '@/request'
import {ref, nextTick} from 'vue'
import {Pie} from 'vue-chartjs'
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

ChartJS.register(ArcElement, Tooltip, Legend)

const dataDashboard = ref(null)
const totalTasks = ref(0)
const totalProjects = ref(0)
const totalUsers = ref(0)
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true, // Hiển thị tiêu đề
      text: 'Task Distribution by Status', // Nội dung tiêu đề
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
      position: 'bottom', // Vị trí chú thích
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

useWaitAppBooted(async () => {
  await nextTick() // Đảm bảo DOM đã render

  // Lấy dữ liệu dashboard
  dataDashboard.value = (await dashboardRequest.overviewAdmin()).data.data

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
        backgroundColor: ['#909285', '#2e95ff', '#e09a37','#67c234'],
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
        backgroundColor: ['#1eaa35', '#4980ec', '#d3cbcb','#cfb324'],
        data: taskCounts
      }
    ]
  }

  totalTasks.value = dataDashboard.value?.total_tasks || 0
  totalProjects.value = dataDashboard.value?.total_projects || 0
  totalUsers.value = dataDashboard.value?.total_users || 0
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
}

.el-statistic__head {
  font-size: 20px;
}

canvas{
  //width: 500px;
}
</style>
