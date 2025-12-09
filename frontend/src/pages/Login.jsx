import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { authService } from "../services/authService";
import Container from "../components/layout/Container";



function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false
  });



  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');


  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/booking";



  const errors = {
    email: '',
    password: ''
  };


const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;


  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(form.email.trim())) {
    errors.email = "Enter a valid email";
  }


  if (!form.password.trim()) {
    errors.password = 'Password is required';
  } else if (form.password.trim().length < 8) {
    errors.password = "The password must contain at least 8 characters";
  }

  const isValid = !errors.email && !errors.password;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      email: true,
      password: true
    });

    setServerError('');

    if (!isValid) return;

    try {
      setSubmitting(true);

      await authService.login(
        form.email.trim(),
        form.password.trim()
      );

      navigate(from, { replace: true });
    } catch (error) {
      setServerError(
        error?.message || 'Failed to log in. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <main className="py-16">
      <Container>
        <div className="max-w-md mx-auto animate-fade-up">
          <header className="mb-6 text-center">
            <h1 className="h-title">Log in</h1>
            <p className="text-sm text-gray-600">
              Log in to access your reservations.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-2xl shadow border border-restaurant-cream/70 space-y-4"
          >
            <div>
              <label className="text-sm font-medium block mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 text-sm border rounded-lg"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.email && errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-3 py-2 text-sm border rounded-lg"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.password && errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {serverError && (
              <p className="text-xs text-red-500 text-center">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={!isValid || submitting}
              className="btn-primary w-full py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Logging in...' : 'Continue'}
            </button>
          </form>

          <div className="text-center text-xs text-gray-500 mt-3">
            <span>Don't have an account yet? </span>
            <Link to="/register" className="underline">
              Sign up
            </Link>
          </div>

          <div className="text-center text-xs text-gray-500 mt-3">
            <Link to="/" className="underline">
              Back to Home
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}


export default Login;
