
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Account created successfully! Please log in.');
        // Optionally, redirect to login after a delay
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
            id="name" type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="email-signup">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
            id="email-signup" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="password-signup">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
            id="password-signup" type="password" placeholder="******************" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </div>
      </form>
      <p className="text-center text-gray-500 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-purple-600 hover:text-purple-800">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
