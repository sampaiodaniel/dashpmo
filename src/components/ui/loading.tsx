
export function Loading() {
  return (
    <div className="min-h-screen bg-pmo-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <img src="/lovable-uploads/4edf43e8-5e62-424c-9464-7188816ca0f8.png" alt="Loading" className="w-8 h-8" />
        </div>
        <div className="text-pmo-gray">Carregando...</div>
      </div>
    </div>
  );
}
