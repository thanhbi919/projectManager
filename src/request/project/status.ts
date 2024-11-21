import { BaseApi } from '@/request/base.api'

class ProjectStatusRequest extends BaseApi {
  constructor() {
    super('api/project-status')
  }
}

const request = new ProjectStatusRequest()
export default request
