import { BaseApi } from '@/request/base.api'

class UserRequest extends BaseApi {
  constructor() {
    super('api/users')
  }
}

const request = new UserRequest()
export default request
