
export function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-16 h-16 bg-pmo-primary rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">Dash</span>
        </div>
        <div className="text-pmo-gray">Carregando dashboard...</div>
      </div>
    </div>
  );
}
