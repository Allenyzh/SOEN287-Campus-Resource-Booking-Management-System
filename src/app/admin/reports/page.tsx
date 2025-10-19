"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, Clock, TrendingUp, FileText } from "lucide-react";

export default function ReportsPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/admin");
  };

  const reports = [
    {
      title: "Resource Usage Report",
      description: "View popular resources, usage statistics, and category analytics",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      path: "/admin/reports/resources",
      features: ["Popular resources ranking", "Usage rate analysis", "Category statistics", "Under-utilized resources"],
    },
    {
      title: "Peak Times Analysis",
      description: "Analyze booking patterns, peak hours, and busy periods",
      icon: <Clock className="w-8 h-8" />,
      color: "bg-orange-100",
      iconColor: "text-orange-600",
      path: "/admin/reports/peak-times",
      features: ["Day of week analysis", "Time slot patterns", "24-hour heat map", "Busiest dates"],
    },
  ];

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBack} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              Statistical Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              View comprehensive reports and analytics about resource usage, booking patterns, and system performance.
            </p>
          </CardContent>
        </Card>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <Card
              key={report.path}
              className="hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => router.push(report.path)}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Icon and Title */}
                  <div className="flex items-start space-x-4">
                    <div className={`p-4 ${report.color} rounded-lg group-hover:scale-110 transition-transform`}>
                      <div className={report.iconColor}>
                        {report.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                        {report.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {report.description}
                      </p>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="pl-20">
                    <ul className="space-y-1 text-sm text-gray-600">
                      {report.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <TrendingUp className="w-3 h-3 mr-2 text-green-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* View Report Button */}
                  <div className="pl-20 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="group-hover:bg-blue-600 group-hover:text-white transition-colors"
                    >
                      View Report →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">🚀 Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-1">User Analytics</h4>
                <p className="text-sm text-gray-600">Track user behavior and booking patterns</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-1">Revenue Reports</h4>
                <p className="text-sm text-gray-600">Financial analytics and revenue tracking</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-1">Export to PDF/Excel</h4>
                <p className="text-sm text-gray-600">Download reports for offline analysis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
