import { BaseApi } from '@/request/base.api'

class ImageRequest extends BaseApi {
  constructor() {
    super('upload-image')
  }
}

const request = new ImageRequest()
export default request
