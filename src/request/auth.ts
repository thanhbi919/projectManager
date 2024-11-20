import { BaseApi } from '@/request/base.api'

class AuthRequest extends BaseApi {
  constructor() {
    super('api/auth')
  }

  async login(credentials) {
    return await this.client.post('/login', JSON.stringify(credentials))
  }

  async logout() {
    return await this.client.post('/logout')
  }

  async register(userData) {
    return await this.client.post('/register', userData)
  }
}
const request = new AuthRequest()
export default request
