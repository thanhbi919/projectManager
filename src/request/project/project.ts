import { BaseApi } from '@/request/base.api'

class TypeRequest extends BaseApi {
  constructor() {
    super('api/projects')
  }
}

const request = new TypeRequest()
export default request
