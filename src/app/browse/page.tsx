"use client";

export default function page() {
  const resources = [
    { id: 1, name: "Resource 1", description: "Description of Resource 1" },
    { id: 2, name: "Resource 2", description: "Description of Resource 2" },
    { id: 3, name: "Resource 3", description: "Description of Resource 3" },
    { id: 4, name: "Resource 4", description: "Description of Resource 4" },
    { id: 5, name: "Resource 5", description: "Description of Resource 5" },
    { id: 6, name: "Resource 6", description: "Description of Resource 6" },
  ];

  return (
    <div className="flex-1 container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Browse Resources</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="border border-gray-300 rounded p-4 hover:shadow-lg dark:hover:shadow-gray-400/40 transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{resource.name}</h2>
            <p>{resource.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
