import { Link, useLocation, useNavigate } from "react-router-dom";
import learnyticsLogo from "@/assets/learnytics-logo.png";

interface NavItem {
  title: string;
  path?: string;
  scrollTo?: string;
}

const navItems: NavItem[] = [
  { title: "Dashboard", scrollTo: "dashboard" },
  { title: "User List", scrollTo: "user-list" },
];

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (item: NavItem) => {
    if (item.scrollTo) {
      // Jika di halaman utama, scroll langsung
      if (location.pathname === "/") {
        const element = document.getElementById(item.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Jika di halaman lain, navigasi ke home dulu lalu scroll
        navigate("/");
        setTimeout(() => {
          const element = document.getElementById(item.scrollTo!);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    }
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo and Brand */}
          <div className="flex items-center gap-3">
            <img
              src={learnyticsLogo}
              alt="Learnytics Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="font-bold text-lg text-foreground">Learnytics</span>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              item.path ? (
                <Link
                  key={item.title}
                  to={item.path}
                  className={`text-foreground hover:text-primary transition-colors font-medium ${location.pathname === item.path ? "text-primary font-semibold" : ""
                    }`}
                >
                  {item.title}
                </Link>
              ) : (
                <button
                  key={item.title}
                  onClick={() => handleNavClick(item)}
                  className="text-foreground hover:text-primary transition-colors font-medium cursor-pointer"
                >
                  {item.title}
                </button>
              )
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
