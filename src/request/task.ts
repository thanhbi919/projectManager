import { BaseApi } from '@/request/base.api'

class TaskRequest extends BaseApi {
  constructor() {
    super('api/task')
  }

  async getListTaskType() {
    return await this.client.get('/types')
  }

  async getListTaskPriority() {
    return await this.client.get('/priorities')
  }

  async getListTaskStatus() {
    return await this.client.get('/statuses')
  }
}

const request = new TaskRequest()
export default request
