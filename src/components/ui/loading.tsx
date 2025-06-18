
export function Loading() {
  return (
    <div className="min-h-screen bg-pmo-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <img 
            src="/lovable-uploads/6c358334-3676-4b13-819e-8d121a26b6eb.png" 
            alt="DashPMO" 
            className="w-8 h-8" 
          />
        </div>
        <div className="text-pmo-gray">Carregando...</div>
      </div>
    </div>
  );
}
