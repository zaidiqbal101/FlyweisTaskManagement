// resources/js/Pages/Auth/Register.jsx
import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';

const Register = () => {
    const { errors } = usePage().props; // Access errors from Inertia page props
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'Developer',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('register.post'), form, {
            onError: (errors) => {
                // Optional: Handle errors client-side if needed
                console.log('Submission errors:', errors);
            },
            onSuccess: () => {
                // Optional: Handle success (e.g., clear form or show message)
                setForm({
                    name: '',
                    email: '',
                    password: '',
                    password_confirmation: '',
                    role: 'Developer',
                });
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    Create an Account 🚀
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Enter your name"
                            required
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

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

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={form.password_confirmation}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    password_confirmation: e.target.value,
                                })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Re-enter your password"
                            required
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Role
                        </label>
                        <select
                            value={form.role}
                            onChange={(e) =>
                                setForm({ ...form, role: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                        >
                            <option value="Manager">Manager</option>
                            <option value="Client">Client</option>
                            <option value="Developer">Developer</option>
                            <option value="Tester">Tester</option>
                        </select>
                        {errors.role && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.role}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-5">
                    Already have an account?{' '}
                    <a
                        href={route('login')}
                        className="text-blue-600 hover:underline"
                    >
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;