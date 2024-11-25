import axios from 'axios'

export class BaseApi {
  constructor(subUrl) {
    const baseURL = import.meta.env.VITE_APP_BASE_URL

    // Kết hợp baseURL với subUrl
    this.client = axios.create({
      baseURL: `${baseURL}/${subUrl}`, // Nối baseURL với subUrl
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'

        // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      withCredentials: true
    })

    // Interceptors nếu cần
    this.client.interceptors.request.use(
      (config) => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') // Hoặc sessionStorage

        if (isLoggedIn === 'true') {
          // config.headers['Authorization'] = `Bearer ${token}`
        } else {
          console.log('User is not authenticated')
        }

        return config
      },
      (error) => {
        console.log(1111, error)

        // Nếu có lỗi trong request, trả về Promise.reject để xử lý lỗi bên ngoài
        return Promise.reject(error)
      }
    )

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.status === 401) {
          localStorage.setItem('isLoggedIn', false)
        }
        // Xử lý lỗi toàn cục nếu cần
        return Promise.reject(error)
      }
    )
  }

  show(id: number) {
    return this.client.get(`/${id}`)
  }

  list(params = {}) {
    return this.client.get('', { params })
  }

  create(data, isMultipart = false) {
    const headers = isMultipart
      ? { 'Content-Type': 'multipart/form-data' } // For file uploads
      : { 'Content-Type': 'application/json' } // For JSON data
    return this.client.post('', data, { headers })
  }

  update(data, id: number, isMultipart = false) {
    const headers = isMultipart
      ? { 'Content-Type': 'multipart/form-data' } // For file uploads
      : { 'Content-Type': 'application/json' } // For JSON data
    if (isMultipart) {
      return this.client.post(`/${id}`, data, { headers })
    } else return this.client.put(`/${id}`, data, { headers })
  }

  delete() {
    return this.client.delete('')
  }
}

// Tạo instance của BaseApi với subUrl là "api"
// const subUrl = 'api' // Subdomain hoặc phần endpoint mà bạn muốn thêm vào
// const apiService = new BaseApi(subUrl)

// Export instance để sử dụng
