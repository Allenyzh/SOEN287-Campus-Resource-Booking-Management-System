"use client";
import { useState } from "react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (pw: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(pw);
  };

  const handleSendCode = () => {
    if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format." }));
      return;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    console.log("Sending verification code to:", email);
    // TODO: actual API call
  };

  const handleResetPassword = () => {
    const newErrors = { email: "", newPassword: "", confirmPassword: "" };

    if (!validateEmail(email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!validatePassword(newPassword)) {
      newErrors.newPassword =
        "Password must be at least 8 characters, include a number, a lowercase and an uppercase letter.";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    // If no errors, proceed with password reset
    if (
      !newErrors.email &&
      !newErrors.newPassword &&
      !newErrors.confirmPassword
    ) {
      console.log("Resetting password with:", {
        email,
        code,
        newPassword,
        confirmPassword,
      });
      // TODO: API call
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-xl border  p-8 shadow">
      <h2 className="text-xl font-semibold">Reset your password</h2>
      <p className="text-muted-foreground mb-6 text-sm">
        Enter your email to receive a verification code.
      </p>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="name@university.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border px-4 py-2 text-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <button
        onClick={handleSendCode}
        className="mb-6 w-full rounded-md dark:bg-white dark:text-black bg-black px-4 py-2 text-white"
      >
        Send code
      </button>

      {/* Verification Code */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Verification Code</label>
        <input
          type="text"
          placeholder="Enter the code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="mt-1 w-full rounded-md border px-4 py-2 text-sm"
        />
      </div>

      {/* New Password */}
      <div className="mb-4">
        <label className="block text-sm font-medium">New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-1 w-full rounded-md border px-4 py-2 text-sm"
        />
        {errors.newPassword && (
          <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="mb-6">
        <label className="block text-sm font-medium">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 w-full rounded-md border px-4 py-2 text-sm"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        onClick={handleResetPassword}
        className="w-full rounded-md dark:bg-white dark:text-black bg-black px-4 py-2 text-white"
      >
        Reset Password
      </button>
    </div>
  );
}
