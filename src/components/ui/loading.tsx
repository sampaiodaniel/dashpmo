export function Loading() {
  return (
    <div className="min-h-screen bg-pmo-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
          <img 
            src="/lovable-uploads/e42353b2-fcfd-4457-bbd8-066545973f48.png" 
            alt="DashPMO" 
            className="w-12 h-12" 
          />
        </div>
        <div className="text-pmo-gray">Carregando...</div>
      </div>
    </div>
  );
}
