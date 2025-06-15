
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FolderOpen, 
  ClipboardCheck, 
  GitBranch, 
  GraduationCap, 
  AlertTriangle,
  BarChart3,
  Settings,
  User
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
    title: "Mudanças", 
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
    title: "Aprovações", 
    icon: User, 
    href: "/aprovacoes" 
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
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-pmo-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">PMO</span>
        </div>
        <h1 className="text-xl font-bold text-pmo-primary">Sistema PMO</h1>
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
