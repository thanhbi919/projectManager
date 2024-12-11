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
}

const request = new DashboardRequest()
export default request
