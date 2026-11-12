import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Receipt, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  FileCheck, 
  Building2,
  Bell,
  Search,
  Building,
  Lock
} from "lucide-react";
import logoSvg from '@/assets/Logo2.svg';

const menuItems = [
  { 
    label: "Facturación", 
    description: "Crear y gestionar facturas electrónicas",
    icon: FileText, 
    route: "/portal" 
  },
  { 
    label: "Clientes", 
    description: "Administrar información de clientes",
    icon: Users, 
    route: "/terceros" 
  },
  { 
    label: "Notas de Crédito", 
    description: "Crear y gestionar notas de crédito electrónicas",
    icon: CreditCard, 
    route: "/credit-notes" 
  },
  { 
    label: "Productos", 
    description: "Catálogo de productos y servicios",
    icon: Receipt, 
    route: "/items" 
  },
  { 
    label: "Reportes", 
    description: "Análisis y estadísticas de ventas",
    icon: BarChart3, 
    route: "/reports" 
  },
  { 
    label: "Configuración", 
    description: "Ajustes del sistema y empresa",
    icon: Settings, 
    route: "/settings" 
  }
];

const quickStats = [
  { label: "Facturas Hoy", value: "24", trend: "+12%", icon: FileText },
  { label: "Ingresos del Mes", value: "$2.4M", trend: "+8%", icon: BarChart3 },
  { label: "Pendientes DIAN", value: "3", trend: "-2", icon: Bell }
];

export default function MainMenu() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-black p-4 rounded-xl">
              <img src={logoSvg} alt="AstilPro Logo" className="h-16 w-16" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1F2937]">Astil</h1>
              <p className="text-sm text-gray-600">Portal de Facturación Electrónica</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="relative border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-orange-500 border-0">0</Badge>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">AD</span>
              </div>
              <span className="text-sm font-medium text-[#1F2937]">Administrador</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-[#1F2937] mb-2">¡Bienvenido de vuelta!</h2>
          <p className="text-gray-600 text-lg">Gestione su facturación electrónica de manera eficiente</p>
        </div>

        {/* Quick Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="bg-white border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-xl flex items-center justify-center border border-orange-500/20">
                        <IconComponent className="h-6 w-6 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-[#1F2937]">{stat.value}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-orange-500">
                      {stat.trend}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div> */}

        {/* Main Menu Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-[#1F2937]">Módulos Principales</h3>
            <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">
              <Building2 className="h-3 w-3 mr-1" />
              Portal Empresarial
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Card
                  key={item.label}
                  onClick={() => navigate(item.route)}
                  className="group cursor-pointer transition-all duration-300 bg-white border-gray-200 hover:border-orange-500/50 hover:shadow-xl relative overflow-hidden"
                  tabIndex={0}
                  role="button"
                  aria-label={`Ir a ${item.label}`}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                      navigate(item.route);
                    }
                  }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-orange-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 min-w-[48px] bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-xl flex items-center justify-center border border-orange-500/20 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-orange-600 group-hover:border-orange-500 group-hover:scale-110 group-hover:shadow-lg">
                        <IconComponent className="h-6 w-6 text-orange-500 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-[#1F2937] mb-2 group-hover:text-orange-500 transition-colors">
                          {item.label}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Hover Arrow */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                        <span className="text-white text-xs">→</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white border-gray-200 shadow-md">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-[#1F2937] mb-4">Acciones Rápidas</h4>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => navigate('/invoices/new')}
                className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FileText className="h-4 w-4 mr-2" />
                Nueva Factura
              </Button>
              <Button 
                onClick={() => navigate('/invoices')}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <FileCheck className="h-4 w-4 mr-2" />
                Ver Facturas
              </Button>
              <Button 
                onClick={() => navigate('/clients/new')}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Users className="h-4 w-4 mr-2" />
                Nuevo Cliente
              </Button>
              <Button 
                onClick={() => navigate('/reports/daily')}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Reporte Diario
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}