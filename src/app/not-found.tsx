import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-6 min-h-72">
      <h2 className="text-3xl">Ops! Page Not Found</h2>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
