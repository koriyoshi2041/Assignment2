import { makeAutoObservable } from 'mobx';
import axios from 'axios';

class AuthStore {
  token = null;
  nickName = null;
  isAuthenticated = false;
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
    // Check for existing token in localStorage
    this.initializeAuth();
  }

  initializeAuth() {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      this.token = savedToken;
      this.isAuthenticated = true;
      // Verify token and get user info
      this.fetchUserInfo();
    }
  }

  async login(username, password) {
    this.setLoading(true);
    this.setError(null);
    
    try {
      const response = await axios.post('http://localhost:8080/user/login', {
        username,
        password
      });
      
      const { token } = response.data;
      this.setToken(token);
      await this.fetchUserInfo();
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      this.setError(errorMessage);
      return false;
    } finally {
      this.setLoading(false);
    }
  }

  async fetchUserInfo() {
    if (!this.token) return;
    
    try {
      const response = await axios.get('http://localhost:8080/user/info', {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });
      
      this.setNickName(response.data.nick_name);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // If token is invalid, clear auth state
      if (error.response?.status === 401) {
        this.logout();
      }
    }
  }

  logout() {
    this.token = null;
    this.nickName = null;
    this.isAuthenticated = false;
    this.error = null;
    localStorage.removeItem('token');
  }

  setToken(token) {
    this.token = token;
    this.isAuthenticated = true;
    localStorage.setItem('token', token);
  }

  setNickName(nickName) {
    this.nickName = nickName;
  }

  setLoading(loading) {
    this.isLoading = loading;
  }

  setError(error) {
    this.error = error;
  }
}

export const authStore = new AuthStore();