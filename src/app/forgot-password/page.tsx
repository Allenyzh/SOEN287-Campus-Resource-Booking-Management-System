"use client";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground mt-2">
          Enter your email to reset your password.
        </p>
      </div>

      <ForgotPasswordForm />
    </div>
  );
} 