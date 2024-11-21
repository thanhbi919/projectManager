import { BaseApi } from '@/request/base.api'

class ProjectRequest extends BaseApi {
  constructor() {
    super('api/projects')
  }
  async getListProjectStatus() {
    return await this.client.get('/status')
  }
}

const request = new ProjectRequest()
export default request
