
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-pickle-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">PN</span>
              </div>
              <span className="font-bold text-xl">Pickle Ninja</span>
            </div>
            <p className="text-muted-foreground max-w-xs">
              Connect, compete, and play pickleball for free. Commission is only charged on paid events and tournaments.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
            <p className="text-muted-foreground mb-4">
              Stay updated with Pickle Ninja news and features.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Twitter
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Facebook
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>© {currentYear} Pickle Ninja. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
