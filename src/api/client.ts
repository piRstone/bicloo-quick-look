import axios from "axios"
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios"

class ApiClient {
  private axiosInstance: AxiosInstance

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL
    })

    // Add interceptor to set API key at the end of all request paths
    this.axiosInstance.interceptors.request.use
    this.axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      config.url += `?contract=nantes&apiKey=${process.env.JCDECAUX_API_KEY}`
      return config
    })
  }

  public async get<T>(url: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(url)
      return response.data
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`)
    }
  }
}

const apiClient = new ApiClient("https://api.jcdecaux.com/vls/v3")
export default apiClient
