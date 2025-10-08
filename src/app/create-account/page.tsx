"use client";

import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="text-muted-foreground mt-2">
          Sign up to book study rooms, labs, equipment, and more.
        </p>
      </div>

      <RegisterForm
        onSubmit={async (data) => {
          // TODO: Replace with real API call
          console.log("Register submit:", data);
        }}
      />
    </div>
  );
}
