// src/services/api.ts
import axios from 'axios';
import type { User } from '../types/models';

// 1) Create a shared Axios instance.  
//    Point baseURL at your backend; adjust as needed.
export const api = axios.create({
  baseURL: 'http://192.168.1.3:8000/api',
  headers: { 'Content-Type': 'application/json' },
});


// 2) Define the shape of auth responses
export interface AuthResponse {
  token: string;
  user: User;
}

// 3) registerApi: calls your backend’s “register” endpoint,
//    and returns { token, user } on success
export async function registerApi(
  email: string,
  password: string
): Promise<AuthResponse> {
  console.log('[registerApi] start', { email, password: '••••••' });
  try {
    const { data } = await api.post<AuthResponse>('/register', {
      email,
      password,
    });
  console.log('[registerApi] success', data);
    return data;
  } catch (err: any) {
    console.error('[registerApi] failed', err.response?.data ?? err.message);
    // you can inspect err.response.data for more details
    const message =
      err.response?.data?.message || 'Registration failed';
    throw new Error(message);
  }
}

// (You likely already have something like this:)
export async function loginApi(
  email: string,
  password: string
): Promise<AuthResponse> {

  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);

  const { data } = await api.post<AuthResponse>('/login', 
    form.toString(),
    {
      headers: {
        // override the default JSON header
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );
  return data;
}

export async function logoutApi(
  token: string
): Promise<void> {
  // if your backend supports a logout endpoint:
  await api.post(
    '/logout',
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function fetchProfile(
  token: string
): Promise<User> {
  const { data } = await api.get<User>('/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}


api.interceptors.request.use(req => {
  const fullUrl = `${req.baseURL ?? ''}${req.url}`;
  console.log(
    '[API request]',
    req.method?.toUpperCase(),
    fullUrl,
    '→',
    req.data
  );
  return req;
});

api.interceptors.response.use(
  res => {
    console.log('[API response]', res.status, res.data);
    return res;
  },
  err => {
    console.error(
      '[API error]',
      err.response?.status,
      err.response?.data ?? err.message
    );
    return Promise.reject(err);
  }
);