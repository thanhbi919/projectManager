import { BaseApi } from '@/request/base.api'

class TypeRequest extends BaseApi {
  constructor() {
    super('api/roles')
  }
}

const request = new TypeRequest()
export default request
