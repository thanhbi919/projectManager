import { BaseApi } from '@/request/base.api'

class TaskRequest extends BaseApi {
  constructor() {
    super('api/tasks')
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

  async logWork(payload) {
    return await this.client.post('/log-work', payload)
  }
}

const request = new TaskRequest()
export default request
