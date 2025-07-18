import { makeAutoObservable } from 'mobx';
import { AuthenticationApi, UserInformationApi, Configuration } from '../api';
import type { LoginUserRequest, LoginUser200Response, GetUserInfo200Response } from '../api';

class AuthStore {
  token: string | null = null;
  nickName: string | null = null;
  isAuthenticated: boolean = false;
  isLoading: boolean = false;
  error: string | null = null;

  private authApi: AuthenticationApi;
  private userApi: UserInformationApi;

  constructor() {
    makeAutoObservable(this);
    
    // Initialize API clients
    const config = new Configuration({
      basePath: process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://api.example.com',
      accessToken: () => this.token || ''
    });
    
    this.authApi = new AuthenticationApi(config);
    this.userApi = new UserInformationApi(config);
    
    // Check for existing token in localStorage
    this.initializeAuth();
    
    // 在开发环境打印当前API配置
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 AuthStore initialized with TypeScript API client');
    }
  }

  initializeAuth(): void {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      this.token = savedToken;
      this.isAuthenticated = true;
      // Verify token and get user info
      this.fetchUserInfo();
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const loginRequest: LoginUserRequest = {
        username,
        password
      };
      
      const response: LoginUser200Response = await this.authApi.loginUser({
        loginUserRequest: loginRequest
      });
      
      if (response.token) {
        this.setToken(response.token);
        await this.fetchUserInfo();
        return true;
      } else {
        throw new Error('No token received from server');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      this.setError(errorMessage);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async fetchUserInfo(): Promise<void> {
    if (!this.token) return;
    
    try {
      // Update the configuration with the current token
      const config = new Configuration({
        basePath: process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://api.example.com',
        accessToken: () => this.token || ''
      });
      this.userApi = new UserInformationApi(config);
      
      const response: GetUserInfo200Response = await this.userApi.getUserInfo();
      
      if (response.nickName) {
        this.setNickName(response.nickName);
      }
    } catch (error: any) {
      console.error('Failed to fetch user info:', error);
      // If token is invalid, clear auth state
      if (error.status === 401) {
        this.logout();
      }
    }
  }

  logout(): void {
    this.token = null;
    this.nickName = null;
    this.isAuthenticated = false;
    this.error = null;
    localStorage.removeItem('token');
  }

  setToken(token: string): void {
    this.token = token;
    this.isAuthenticated = true;
    localStorage.setItem('token', token);
  }

  setNickName(nickName: string): void {
    this.nickName = nickName;
  }

  setLoading(loading: boolean): void {
    this.isLoading = loading;
  }

  setError(error: string | null): void {
    this.error = error;
  }
}

export const authStore = new AuthStore();