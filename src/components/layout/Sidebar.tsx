
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FolderOpen, 
  ClipboardCheck, 
  GitBranch, 
  GraduationCap, 
  AlertTriangle,
  BarChart3,
  Settings
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { 
    title: "Dashboard", 
    icon: LayoutDashboard, 
    href: "/" 
  },
  { 
    title: "Projetos", 
    icon: FolderOpen, 
    href: "/projetos" 
  },
  { 
    title: "Status", 
    icon: ClipboardCheck, 
    href: "/status" 
  },
  { 
    title: "Replanejamentos / CRs", 
    icon: GitBranch, 
    href: "/mudancas" 
  },
  { 
    title: "Lições", 
    icon: GraduationCap, 
    href: "/licoes" 
  },
  { 
    title: "Incidentes", 
    icon: AlertTriangle, 
    href: "/incidentes" 
  },
  { 
    title: "Relatórios", 
    icon: BarChart3, 
    href: "/relatorios" 
  },
  { 
    title: "Administração", 
    icon: Settings, 
    href: "/admin" 
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 px-4 py-6">
      <div className="flex items-center justify-center mb-8 px-4">
        <img 
          src="/lovable-uploads/48bf655c-460e-490c-9118-e222b43f0c9d.png" 
          alt="DashPMO" 
          className="h-16 w-auto max-w-full"
        />
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || 
            (item.href === '/status' && location.pathname.startsWith('/status'));
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-pmo-primary text-white" 
                  : "text-pmo-gray hover:bg-gray-100 hover:text-pmo-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
