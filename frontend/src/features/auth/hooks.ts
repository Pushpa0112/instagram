import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axiosInstance from '@/lib/api/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { LoginFormData, RegisterFormData } from './schemas';
import { User } from '@/types/api';

interface LoginResponse {
  message: string;
  success: boolean;
  user: User;
}

interface RegisterResponse {
  message: string;
  success: boolean;
}

export const useLogin = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await axiosInstance.post<LoginResponse>('/user/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      toast.success(data.message || 'Logged in successfully');
      // Invalidate queries that might depend on auth
      queryClient.invalidateQueries();
      router.push('/');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to login');
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      // Backend only expects username, email, and password
      const { confirmPassword, ...registerData } = data;
      const response = await axiosInstance.post<RegisterResponse>('/user/register', registerData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Account created successfully');
      router.push('/login');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to register');
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.get('/user/logout');
      return response.data;
    },
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push('/login');
    },
    onError: (error: any) => {
      // Even if API fails, clear local state
      clearUser();
      queryClient.clear();
      toast.error(error.message || 'Something went wrong during logout');
      router.push('/login');
    },
  });
};
