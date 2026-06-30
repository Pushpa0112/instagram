import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axiosInstance from '@/lib/api/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { LoginFormData, RegisterFormData } from './schemas';
import { User } from '@/types/api';

// TODO: Verify exact response shapes from the backend
interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
}

export const useLogin = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await axiosInstance.post<AuthResponse>('/user/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Assuming data.user contains the user object
      setUser(data.user);
      toast.success(data.message || 'Logged in successfully');
      router.push('/'); // Redirect to feed
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Login failed');
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      // Backend might not expect confirmPassword, so we can omit it if necessary.
      // Assuming frontend validation is enough and we just send it.
      const response = await axiosInstance.post<AuthResponse>('/user/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Backend might not auto-login on register. Check if user is returned.
      // If it doesn't return user, we redirect to login instead.
      // TODO: Verify backend behavior. For now, assuming auto-login.
      if (data.user) {
        setUser(data.user);
        router.push('/');
      } else {
        router.push('/login');
      }
      toast.success(data.message || 'Account created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Registration failed');
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);

  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.get('/user/logout');
      return response.data;
    },
    onSuccess: () => {
      clearUser();
      toast.success('Logged out successfully');
      router.push('/login');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Logout failed');
    },
  });
};
