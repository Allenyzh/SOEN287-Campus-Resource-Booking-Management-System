"use client";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 pb-8 px-4">
      <div className="container mx-auto">
        <div className="mt-4 pt-4 text-sm text-muted-foreground flex justify-center md:gap-1 gap-1 md:flex-row flex-col items-center">
          <p>&copy; 2025 Concordia University. All rights reserved.</p>
          <p>SOEN 287 Web Programming Project</p>
        </div>
      </div>
    </footer>
  );
}
