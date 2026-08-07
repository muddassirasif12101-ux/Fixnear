import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth.jsx';

function LoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/api/auth/login', data);
      login(response.data.data);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16 sm:px-8">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-3 text-slate-600">Login to your FixNear account to manage bookings and services.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-accent focus:outline-none"
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-brand-accent focus:outline-none"
            />
            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-brand-accent px-4 py-3 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          New to FixNear? <Link to="/register" className="font-semibold text-brand-accent hover:text-blue-300">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
