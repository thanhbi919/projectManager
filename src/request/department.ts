import { BaseApi } from '@/request/base.api'

class DepartmentRequest extends BaseApi {
  constructor() {
    super('api/departments')
  }
}

const request = new DepartmentRequest()
export default request
