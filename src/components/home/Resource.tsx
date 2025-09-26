"use client";

import { BookOpen, Laptop, FlaskConical, Dumbbell } from "lucide-react";
import DisplayCard from "./DisplayCard";

export default function Resource() {
  const resources = [
    {
      title: "Study Rooms",
      description: "Quiet spaces for individual and group study sessions",
      Icon: BookOpen,
    },
    {
      title: "Laboratory Spaces",
      description:
        "Specialized labs for engineering and computer science projects",
      Icon: FlaskConical,
    },
    {
      title: "Equipment",
      description: "Laptops, projectors, cameras, and specialized tools",
      Icon: Laptop,
    },
    {
      title: "Sports Facilities",
      description:
        "Gyms, courts, and recreational spaces for fitness activities",
      Icon: Dumbbell,
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Available Resources</h2>
          <p className="text-muted-foreground text-lg">
            Book from our comprehensive collection of campus facilities
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map(({ title, description, Icon }) => (
            <DisplayCard
              key={title}
              type="resources"
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
