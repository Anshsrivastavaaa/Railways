import { SidebarTrigger } from "@/components/ui/sidebar";
import { TrainFront } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger />
        <TrainFront className="w-6 h-6 text-primary" />
        <span className="font-bold font-headline">RailFlow</span>
      </div>
      <div className="flex w-full items-center justify-end gap-4">
        {/* Placeholder for potential header content like search or notifications */}
      </div>
    </header>
  );
}
