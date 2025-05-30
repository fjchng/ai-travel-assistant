import { MapIcon } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <MapIcon className="h-5 w-5 mr-2 text-primary" />
            <span className="font-bold text-lg">Voyageur</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-6 md:mb-0">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>
          
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Voyageur. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}