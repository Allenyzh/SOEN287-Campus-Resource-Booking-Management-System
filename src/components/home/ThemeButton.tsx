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
  return (
    <ToggleGroup
      type="single"
      size="lg"
      aria-label="Theme Switcher"
      tabIndex={-1}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="light"
            aria-label="Light mode switcher"
            onClick={() => setTheme("light")}
            className="hidden dark:block !rounded-none"
          >
            <Sun className="w-4 h-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Light Mode</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="light"
            aria-label="Light mode switcher"
            onClick={() => setTheme("dark")}
            className="dark:hidden !rounded-none"
          >
            <Moon className="w-4 h-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Dark Mode</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="light"
            aria-label="Light mode switcher"
            onClick={() => setTheme("system")}
            className="!rounded-none"
          >
            <MonitorCog className="w-4 h-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>System</TooltipContent>
      </Tooltip>
    </ToggleGroup>
  );
}
