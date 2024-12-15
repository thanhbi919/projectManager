import { BaseApi } from '@/request/base.api'

class DashboardRequest extends BaseApi {
  constructor() {
    super('api/dashboard')
  }

  async overviewAdmin() {
    return await this.client.get('/admin/overview')
  }
  async projectDistribution() {
    return await this.client.get('/admin/project-distribution')
  }
  async taskDistribution() {
    return await this.client.get('/admin/task-distribution')
  }

  async overviewPm(){
    return await this.client.get('/pm/overview')
  }

  async taskProgress(){
    return await this.client.get('/pm/task-progress')
  }

  async taskByMember(projectId){
    const a = await this.client.get(`/pm/task-by-member?project_id=${projectId}`)
    console.log(a)
    return a.data
  }
  async myTask(projectId){
    const a = await this.client.get(`/pm/my-task?project_id=${projectId}`)
    console.log(a)
    return a.data
  }
}

const request = new DashboardRequest()
export default request
