"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for zustand persist to load from localStorage
    const timer = setTimeout(() => {
      if (!user) {
        // Not logged in - redirect to sign in
        router.push("/sign-in");
      } else if (user.role !== "admin") {
        // Logged in but not admin - redirect to user dashboard
        router.push("/dashboard");
      } else {
        // Admin user - allow access
        setIsChecking(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [user, router]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
