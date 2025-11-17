"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBookingStore } from "@/stores/bookingStore";
import { ArrowLeft, Clock, Calendar, TrendingUp, Flame } from "lucide-react";

export default function PeakTimesReportPage() {
  const router = useRouter();
  const { bookings } = useBookingStore();

  const handleBack = () => {
    router.push("/admin/reports");
  };

  // Analyze bookings by day of week
  const dayOfWeekStats = useMemo(() => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const stats = days.map((day, index) => ({
      day,
      dayIndex: index,
      count: 0,
    }));

    bookings.forEach((booking) => {
      if (booking.status !== "Cancelled") {
        const date = new Date(booking.date);
        const dayIndex = date.getDay();
        stats[dayIndex].count++;
      }
    });

    return stats.sort((a, b) => b.count - a.count);
  }, [bookings]);

  // Analyze bookings by time slot (based on time string)
  const timeSlotStats = useMemo(() => {
    const slots: Record<string, number> = {
      "Morning (6:00-9:00)": 0,
      "Mid-Morning (9:00-12:00)": 0,
      "Afternoon (12:00-15:00)": 0,
      "Late Afternoon (15:00-18:00)": 0,
      "Evening (18:00-21:00)": 0,
      "Night (21:00-24:00)": 0,
    };

    bookings.forEach((booking) => {
      if (booking.status !== "Cancelled" && booking.time) {
        // Extract hour from time string (e.g., "10:00 - 12:00" -> 10)
        const timeMatch = booking.time.match(/^(\d{1,2}):/);
        if (timeMatch) {
          const hour = parseInt(timeMatch[1]);

          if (hour >= 6 && hour < 9) slots["Morning (6:00-9:00)"]++;
          else if (hour >= 9 && hour < 12) slots["Mid-Morning (9:00-12:00)"]++;
          else if (hour >= 12 && hour < 15) slots["Afternoon (12:00-15:00)"]++;
          else if (hour >= 15 && hour < 18)
            slots["Late Afternoon (15:00-18:00)"]++;
          else if (hour >= 18 && hour < 21) slots["Evening (18:00-21:00)"]++;
          else if (hour >= 21 || hour < 6) slots["Night (21:00-24:00)"]++;
        }
      }
    });

    return Object.entries(slots)
      .map(([slot, count]) => ({ slot, count }))
      .sort((a, b) => b.count - a.count);
  }, [bookings]);

  // Analyze bookings by hour (more detailed)
  const hourlyStats = useMemo(() => {
    const hours: Record<number, number> = {};
    for (let i = 0; i < 24; i++) {
      hours[i] = 0;
    }

    bookings.forEach((booking) => {
      if (booking.status !== "Cancelled" && booking.time) {
        const timeMatch = booking.time.match(/^(\d{1,2}):/);
        if (timeMatch) {
          const hour = parseInt(timeMatch[1]);
          if (hour >= 0 && hour < 24) {
            hours[hour]++;
          }
        }
      }
    });

    return Object.entries(hours)
      .map(([hour, count]) => {
        const hourNum = parseInt(hour);
        return {
          hour: hourNum,
          time: `${hourNum.toString().padStart(2, "0")}:00`,
          count,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [bookings]);

  // Analyze bookings by date (recent bookings)
  const dateStats = useMemo(() => {
    const dates: Record<string, number> = {};

    bookings.forEach((booking) => {
      if (booking.status !== "Cancelled") {
        dates[booking.date] = (dates[booking.date] || 0) + 1;
      }
    });

    return Object.entries(dates)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => {
        // Sort by count first, then by date
        if (b.count !== a.count) return b.count - a.count;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, 10); // Top 10 busiest dates
  }, [bookings]);

  const totalBookings = bookings.filter((b) => b.status !== "Cancelled").length;
  const peakDay = dayOfWeekStats[0];
  const peakTimeSlot = timeSlotStats[0];
  const peakHour = hourlyStats[0];

  // Calculate intensity for heat map visualization
  const getIntensityColor = (count: number, maxCount: number) => {
    if (maxCount === 0) return "bg-gray-100";
    const intensity = count / maxCount;
    if (intensity >= 0.8) return "bg-red-500";
    if (intensity >= 0.6) return "bg-orange-500";
    if (intensity >= 0.4) return "bg-yellow-500";
    if (intensity >= 0.2) return "bg-green-500";
    if (intensity > 0) return "bg-blue-400";
    return "bg-gray-500 dark:bg-transparent";
  };

  const maxDayCount = Math.max(...dayOfWeekStats.map((d) => d.count));
  const maxTimeCount = Math.max(...timeSlotStats.map((t) => t.count));

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBack} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Peak Times Analysis</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Flame className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Peak Day</p>
                  <p className="text-xl font-bold">{peakDay?.day || "N/A"}</p>
                  <p className="text-xs text-gray-500">
                    {peakDay?.count || 0} bookings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Peak Time Slot</p>
                  <p className="text-sm font-bold">
                    {peakTimeSlot?.slot || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {peakTimeSlot?.count || 0} bookings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Peak Hour</p>
                  <p className="text-xl font-bold">{peakHour?.time || "N/A"}</p>
                  <p className="text-xs text-gray-500">
                    {peakHour?.count || 0} bookings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Day of Week Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Bookings by Day of Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dayOfWeekStats.map((stat) => (
                <div key={stat.day} className="flex items-center space-x-4">
                  <div className="w-32 font-medium">{stat.day}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 rounded-full h-8 relative overflow-hidden">
                        <div
                          className={`h-8 rounded-full transition-all ${getIntensityColor(
                            stat.count,
                            maxDayCount
                          )}`}
                          style={{
                            width: `${
                              maxDayCount > 0
                                ? (stat.count / maxDayCount) * 100
                                : 0
                            }%`,
                          }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                          {stat.count} bookings
                        </span>
                      </div>
                      {stat.count === maxDayCount && maxDayCount > 0 && (
                        <Flame className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Slot Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Bookings by Time Slot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timeSlotStats.map((stat) => (
                <div key={stat.slot} className="flex items-center space-x-4">
                  <div className="w-48 font-medium text-sm">{stat.slot}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 rounded-full h-8 relative overflow-hidden">
                        <div
                          className={`h-8 rounded-full transition-all ${getIntensityColor(
                            stat.count,
                            maxTimeCount
                          )}`}
                          style={{
                            width: `${
                              maxTimeCount > 0
                                ? (stat.count / maxTimeCount) * 100
                                : 0
                            }%`,
                          }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-sm  font-semibold">
                          {stat.count} bookings
                        </span>
                      </div>
                      {stat.count === maxTimeCount && maxTimeCount > 0 && (
                        <Flame className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hourly Heat Map */}
        <Card>
          <CardHeader>
            <CardTitle>24-Hour Heat Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
              {hourlyStats.slice(0, 24).map((stat) => {
                const maxCount = Math.max(...hourlyStats.map((h) => h.count));
                return (
                  <div
                    key={stat.hour}
                    className={`p-3 rounded-lg text-center transition-all hover:scale-105 cursor-pointer ${getIntensityColor(
                      stat.count,
                      maxCount
                    )}`}
                    title={`${stat.time}: ${stat.count} bookings`}
                  >
                    <div className="text-xs font-semibold text-white">
                      {stat.hour}:00
                    </div>
                    <div className="text-sm font-bold text-white">
                      {stat.count}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-500 dark:bg-transparent rounded" />
                <span>No bookings</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-400 rounded" />
                <span>Low</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded" />
                <span>Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-600 rounded" />
                <span>High</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top 10 Busiest Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Busiest Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Day of Week</TableHead>
                    <TableHead>Bookings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dateStats.map((stat, index) => {
                    const date = new Date(stat.date);
                    const dayName = [
                      "Sunday",
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                    ][date.getDay()];
                    return (
                      <TableRow key={stat.date}>
                        <TableCell className="font-medium">
                          #{index + 1}
                        </TableCell>
                        <TableCell>{stat.date}</TableCell>
                        <TableCell>{dayName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-semibold">
                            {stat.count} bookings
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg">
                <p className="text-sm">
                  <strong>Busiest Day:</strong> {peakDay?.day || "N/A"} with{" "}
                  {peakDay?.count || 0} bookings (
                  {peakDay && totalBookings > 0
                    ? Math.round((peakDay.count / totalBookings) * 100)
                    : 0}
                  % of total)
                </p>
              </div>
              <div className="p-3 rounded-lg">
                <p className="text-sm">
                  <strong>Peak Time:</strong> {peakTimeSlot?.slot || "N/A"} with{" "}
                  {peakTimeSlot?.count || 0} bookings
                </p>
              </div>
              <div className="p-3 rounded-lg">
                <p className="text-sm">
                  <strong>Recommendation:</strong> Consider adding more
                  resources during peak hours ({peakHour?.time || "N/A"}) on{" "}
                  {peakDay?.day || "busy days"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
