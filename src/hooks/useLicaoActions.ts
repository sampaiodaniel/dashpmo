
export function useLicaoActions(onLicaoClick: (licaoId: number) => void) {
  const handleVisualizar = (e: React.MouseEvent, licaoId: number) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Visualizando lição:', licaoId);
    onLicaoClick(licaoId);
  };

  const handleEditar = (e: React.MouseEvent, licaoId: number) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Editando lição:', licaoId);
    onLicaoClick(licaoId);
  };

  const handleCardClick = (licaoId: number) => {
    console.log('Clicando no card da lição:', licaoId);
    onLicaoClick(licaoId);
  };

  return {
    handleVisualizar,
    handleEditar,
    handleCardClick
  };
}
