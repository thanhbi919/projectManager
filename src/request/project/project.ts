import { BaseApi } from '@/request/base.api'

class ProjectRequest extends BaseApi {
  constructor() {
    super('api/projects')
  }
  async getListProjectStatus() {
    return await this.client.get('/status')
  }

  async getListProjectMembers(id: number) {
    return await this.client.get(`/${id}/members`)
  }
}

const request = new ProjectRequest()
export default request
