import { useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(schema) });

  const demoEmails = useMemo(() => state.users.map((u) => u.email).join(' | '), [state.users]);

  const onSubmit = (values: LoginFormData) => {
    const user = state.users.find((u) => u.email === values.email && u.status === 'active');
    if (!user) return;
    dispatch({
      type: 'LOGIN',
      payload: { userId: user.id, role: user.role, token: crypto.randomUUID() },
    });
    dispatch({
      type: 'ADD_ACTIVITY',
      payload: {
        id: crypto.randomUUID(),
        userId: user.id,
        action: 'Logged in',
        module: 'auth',
        timestamp: new Date().toISOString(),
        status: 'success',
      },
    });
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 dark:bg-slate-950">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow dark:bg-slate-900"
      >
        <h1 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-100">Login</h1>
        <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">Demo emails: {demoEmails}</p>
        <div className="mb-4">
          <label className="mb-1 block text-sm text-slate-700 dark:text-slate-200">Email</label>
          <input className="w-full rounded border px-3 py-2" {...register('email')} />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-sm text-slate-700 dark:text-slate-200">Password</label>
          <input type="password" className="w-full rounded border px-3 py-2" {...register('password')} />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>
        <button className="w-full rounded bg-indigo-600 px-3 py-2 text-white">Sign In</button>
      </form>
    </div>
  );
}
