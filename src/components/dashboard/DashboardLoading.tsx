export function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
          <img 
            src="/lovable-uploads/DashPMO_Icon_recortado.png" 
            alt="DashPMO" 
            className="w-12 h-12" 
          />
        </div>
        <div className="text-pmo-gray">Carregando dashboard...</div>
      </div>
    </div>
  );
}
