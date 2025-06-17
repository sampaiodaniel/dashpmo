
export function Loading() {
  return (
    <div className="min-h-screen bg-pmo-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <img src="/lovable-uploads/3f82f403-4bd2-4235-ac70-c11237ab57e3.png" alt="Loading" className="w-8 h-8" />
        </div>
        <div className="text-pmo-gray">Carregando...</div>
      </div>
    </div>
  );
}
