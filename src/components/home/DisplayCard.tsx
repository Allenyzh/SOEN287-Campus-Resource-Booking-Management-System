"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface DisplayCardProps {
  type: "features" | "resources";
  title: string;
  description: string;
  Icon: LucideIcon;
}

export default function DisplayCard({
  type,
  title,
  description,
  Icon,
}: DisplayCardProps) {
  const iconWrapperBaseClass =
    type === "features" ? "w-12 h-12 rounded-lg" : "w-16 h-16 rounded-full";

  const iconBaseClass = type === "features" ? "w-6 h-6" : "w-8 h-8";

  switch (type) {
    case "features":
      return (
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div
              className={`${iconWrapperBaseClass} bg-primary/10 flex items-center justify-center mb-4`}
            >
              <Icon className={`${iconBaseClass} text-primary`} />
            </div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
        </Card>
      );
    case "resources":
      return (
        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-8 pb-6">
            <div
              className={`${iconWrapperBaseClass} bg-primary/10 flex items-center justify-center mx-auto mb-4`}
            >
              <Icon className={`${iconBaseClass} text-primary`} />
            </div>
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      );
    default:
      return null;
  }
}
