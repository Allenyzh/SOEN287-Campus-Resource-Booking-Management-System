"use client";

import {
  Calendar,
  MapPin,
  Shield,
  Clock,
  BarChart3,
  Users,
} from "lucide-react";
import DisplayCard from "./DisplayCard";

export default function Features() {
  const features = [
    {
      title: "Real-Time Booking",
      description:
        "See live availability and book resources instantly with our intuitive calendar interface",
      Icon: Calendar,
    },
    {
      title: "Campus-Wide Access",
      description:
        "Book study rooms, labs, equipment, and facilities across all Concordia campuses",
      Icon: MapPin,
    },
    {
      title: "Secure & Reliable",
      description:
        "Role-based access control with secure authentication for students, faculty, and staff",
      Icon: Shield,
    },
    {
      title: "Smart Scheduling",
      description:
        "Conflict prevention, automated reminders, and flexible booking modifications",
      Icon: Clock,
    },
    {
      title: "Usage Analytics",
      description:
        "Comprehensive reporting and insights for administrators to optimize resource allocation",
      Icon: BarChart3,
    },
    {
      title: "Multi-Role Support",
      description:
        "Tailored experiences for students, faculty, and resource managers with appropriate permissions",
      Icon: Users,
    },
  ];

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive resource management for students, faculty, and
            administrators
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ title, description, Icon }) => (
            <DisplayCard
              key={title}
              type="features"
              title={title}
              description={description}
              Icon={Icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
