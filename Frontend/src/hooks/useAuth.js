import { useMutation } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { useAuth as useAuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export function useLogin() {
  const { login } = useAuthContext();
  
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data.error) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      login(data.token, data.user);
      toast.success('Login successful!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
    },
  });
}

export function useRegister() {
  const { login } = useAuthContext();
  
  return useMutation({
    mutationFn: async ({ name, email, password, role }) => {
      const response = await apiClient.post('/auth/register', {
        name,
        email,
        password,
        role: role || 'staff',
      });
      if (response.data.error) {
        throw new Error(response.data.message);
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      login(data.token, data.user);
      toast.success('Registration successful!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(message);
    },
  });
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: async ({ email }) => {
      const response = await apiClient.post('/auth/request-reset', { email });
      if (response.data.error) {
        throw new Error(response.data.message);
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success('If this email exists, an OTP has been generated. Check server console.');
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.message || 'Request failed';
      toast.error(message);
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async ({ email, otp, newPassword }) => {
      const response = await apiClient.post('/auth/reset-password', {
        email,
        otp,
        newPassword,
      });
      if (response.data.error) {
        throw new Error(response.data.message);
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password reset successful! You can now login.');
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.message || 'Password reset failed';
      toast.error(message);
    },
  });
}

