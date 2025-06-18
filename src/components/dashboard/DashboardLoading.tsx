
export function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <img 
            src="/lovable-uploads/6e48c2c5-9581-4a4e-8e6c-f3610c1742bd.png" 
            alt="DashPMO" 
            className="w-8 h-8" 
          />
        </div>
        <div className="text-pmo-gray">Carregando dashboard...</div>
      </div>
    </div>
  );
}
