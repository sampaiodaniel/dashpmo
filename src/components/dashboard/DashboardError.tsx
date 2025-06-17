
export function DashboardError() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="text-pmo-danger mb-2">Erro ao carregar dashboard</div>
        <div className="text-pmo-gray text-sm">Tente recarregar a página</div>
      </div>
    </div>
  );
}
