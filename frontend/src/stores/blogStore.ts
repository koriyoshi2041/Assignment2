import { makeAutoObservable } from 'mobx';
import { PostsApi, AuthenticationApi, Configuration } from '../api';
import type { PostResponse, CreatePostRequest } from '../api';
import { authStore } from './authStore';

class BlogStore {
  posts: PostResponse[] = [];
  newPostContent: string = '';
  isLoading: boolean = false;
  isCreatingPost: boolean = false;
  error: string | null = null;

  private postsApi: PostsApi;
  private authApi: AuthenticationApi;

  constructor() {
    makeAutoObservable(this);
    
    // Initialize API clients
    this.initializeApis();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 BlogStore initialized');
    }
  }

  private initializeApis(): void {
    const config = new Configuration({
      basePath: process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://api.example.com',
      accessToken: () => authStore.token || ''
    });
    
    this.postsApi = new PostsApi(config);
    this.authApi = new AuthenticationApi(config);
  }

  async fetchPosts(): Promise<void> {
    this.setLoading(true);
    this.setError(null);
    
    try {
      this.initializeApis(); // Refresh API config in case token changed
      const posts = await this.postsApi.listPosts();
      this.setPosts(posts);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch posts';
      this.setError(errorMessage);
      console.error('Failed to fetch posts:', error);
    } finally {
      this.setLoading(false);
    }
  }

  async createPost(): Promise<boolean> {
    if (!this.newPostContent.trim()) {
      this.setError('Post content cannot be empty');
      return false;
    }

    if (!authStore.isAuthenticated) {
      this.setError('You must be logged in to create a post');
      return false;
    }

    this.setCreatingPost(true);
    this.setError(null);
    
    try {
      this.initializeApis(); // Refresh API config
      
      const createRequest: CreatePostRequest = {
        content: this.newPostContent.trim()
      };
      
      const newPost = await this.postsApi.createPost({
        createPostRequest: createRequest
      });
      
      // Add the new post to the beginning of the list
      this.posts.unshift(newPost);
      
      // Clear the form
      this.setNewPostContent('');
      
      console.log('✅ Post created successfully');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create post';
      this.setError(errorMessage);
      console.error('Failed to create post:', error);
      return false;
    } finally {
      this.setCreatingPost(false);
    }
  }

  async logout(): Promise<void> {
    if (!authStore.isAuthenticated) return;
    
    try {
      this.initializeApis(); // Refresh API config
      await this.authApi.logoutUser();
      console.log('✅ Logout API called successfully');
    } catch (error: any) {
      console.error('Logout API call failed:', error);
      // Continue with logout even if API call fails
    }
    
    // Clear local state regardless of API call result
    authStore.logout();
    this.clearPosts();
    this.setNewPostContent('');
    this.setError(null);
  }

  // Setters
  setPosts(posts: PostResponse[]): void {
    this.posts = posts;
  }

  clearPosts(): void {
    this.posts = [];
  }

  setNewPostContent(content: string): void {
    this.newPostContent = content;
  }

  setLoading(loading: boolean): void {
    this.isLoading = loading;
  }

  setCreatingPost(creating: boolean): void {
    this.isCreatingPost = creating;
  }

  setError(error: string | null): void {
    this.error = error;
  }

  // Computed values
  get isEmpty(): boolean {
    return this.posts.length === 0;
  }

  get canCreatePost(): boolean {
    return authStore.isAuthenticated && this.newPostContent.trim().length > 0 && !this.isCreatingPost;
  }
}

export const blogStore = new BlogStore();