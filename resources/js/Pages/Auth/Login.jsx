import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';

const Login = () => {
    const { errors } = usePage().props;
    const [form, setForm] = useState({ email: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('login.post'), form, {
            onError: (errors) => {
                console.log('Login errors:', errors);
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    Welcome Back 👋
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter your email"
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter your password"
                            required
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-5">
                    Don’t have an account?{' '}
                    <a
                        href={route('register')}
                        className="text-blue-600 hover:underline"
                    >
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
