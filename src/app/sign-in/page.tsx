"use client";

import LoginForm from "@/components/auth/LoginForm";

export default function SignInPage() {
  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold">Sign In</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Sign in to manage your bookings.
        </p>
      </div>

      <LoginForm
        onSubmit={async (data: { email: string; password: string }) => {
          // TODO: Replace with real API call
          console.log("Login submit:", data);
        }}
      />
    </div>
  );
}
