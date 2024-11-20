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
        console.log('1111234')
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
        console.log('12312312312312312312', error.status)
        if (error.status === 401) {
          console.log('1111')
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

  create(data) {
    return this.client.post('', data)
  }

  update(data, id: number) {
    return this.client.put(`/${id}`, data)
  }

  delete() {
    return this.client.delete('')
  }
}

// Tạo instance của BaseApi với subUrl là "api"
// const subUrl = 'api' // Subdomain hoặc phần endpoint mà bạn muốn thêm vào
// const apiService = new BaseApi(subUrl)

// Export instance để sử dụng
