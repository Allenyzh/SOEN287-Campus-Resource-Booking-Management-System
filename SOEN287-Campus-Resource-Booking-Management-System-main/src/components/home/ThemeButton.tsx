"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sun, Moon, MonitorCog } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeButton() {
  const { setTheme } = useTheme();
  const config = [
    {
      label: "Light Mode",
      icon: Sun,
      value: "light",
      className: "hidden dark:block !rounded-none",
    },
    {
      label: "Dark Mode",
      icon: Moon,
      value: "dark",
      className: "dark:hidden !rounded-none",
    },
    {
      label: "System Mode",
      icon: MonitorCog,
      value: "system",
      className: "!rounded-none",
    },
  ];
  return (
    <ToggleGroup
      type="single"
      size="lg"
      aria-label="Theme Switcher"
      tabIndex={-1}
    >
      {config.map((option, idx) => (
        <Tooltip key={idx}>
          <TooltipTrigger asChild>
            <ToggleGroupItem
              value={option.value}
              aria-label={option.label + " switcher"}
              onClick={() => setTheme(option.value)}
              className={option.className}
            >
              <option.icon className="w-4 h-4" />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>{option.label}</TooltipContent>
        </Tooltip>
      ))}
    </ToggleGroup>
  );
}
