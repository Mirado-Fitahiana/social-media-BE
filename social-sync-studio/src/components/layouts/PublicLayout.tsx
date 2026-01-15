import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl">SocialHub</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-smooth">
                Fonctionnalités
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-smooth">
                Tarifs
              </a>
              <Link to="/login">
                <Button variant="ghost">Connexion</Button>
              </Link>
              <Link to="/register">
                <Button>Commencer</Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 space-y-4">
              <a href="#features" className="block text-muted-foreground hover:text-foreground transition-smooth">
                Fonctionnalités
              </a>
              <a href="#pricing" className="block text-muted-foreground hover:text-foreground transition-smooth">
                Tarifs
              </a>
              <Link to="/login" className="block">
                <Button variant="ghost" className="w-full">Connexion</Button>
              </Link>
              <Link to="/register" className="block">
                <Button className="w-full">Commencer</Button>
              </Link>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">S</span>
                </div>
                <span className="font-bold text-xl">SocialHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                La plateforme de community management pour centraliser vos publications.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-smooth">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-smooth">Tarifs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">Mentions légales</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">CGV</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">contact@socialhub.fr</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 SocialHub. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
