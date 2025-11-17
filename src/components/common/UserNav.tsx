"use client";

import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function UserNav() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push("/sign-in")}>
          Sign In
        </Button>
        <Button onClick={() => router.push("/create-account")}>Register</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm">
        Welcome, <strong>{user.name}</strong>
      </span>
      <Button variant="outline" onClick={() => router.push("/dashboard")}>
        Dashboard
      </Button>
      <Button variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
