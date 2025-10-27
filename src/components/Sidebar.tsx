import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  Truck, 
  Package, 
  BarChart3, 
  ShoppingCart, 
  ArrowRightLeft, 
  FileText 
} from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sites', label: 'Sites', icon: MapPin },
    { id: 'workers', label: 'Workers', icon: Users },
    { id: 'machines', label: 'Machines', icon: Truck },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'progress', label: 'Progress Reports', icon: BarChart3 },
    { id: 'supply', label: 'Supply Reports', icon: ShoppingCart },
    { id: 'requests', label: 'Material Requests', icon: FileText },
    { id: 'transfers', label: 'Transfers', icon: ArrowRightLeft },
  ];

  return (
    <div className="w-64 bg-card border-r border-border">
      <div className="p-6">
        <h1 className="text-xl font-semibold text-foreground">ConstructPro</h1>
        <p className="text-sm text-muted-foreground">Construction Management</p>
      </div>
      
      <nav className="px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3"
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
}