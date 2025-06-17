
export function useMilestoneHandlers(
  setFormData: React.Dispatch<React.SetStateAction<any>>,
  setDataMarco1: React.Dispatch<React.SetStateAction<Date | null>>,
  setDataMarco2: React.Dispatch<React.SetStateAction<Date | null>>,
  setDataMarco3: React.Dispatch<React.SetStateAction<Date | null>>,
  setMarco1TBD: React.Dispatch<React.SetStateAction<boolean>>,
  setMarco2TBD: React.Dispatch<React.SetStateAction<boolean>>,
  setMarco3TBD: React.Dispatch<React.SetStateAction<boolean>>,
  dataMarco1: Date | null,
  dataMarco2: Date | null,
  dataMarco3: Date | null,
  marco1TBD: boolean,
  marco2TBD: boolean,
  marco3TBD: boolean
) {
  const handleMarco1DateChange = (date: Date | null) => {
    setDataMarco1(date);
    if (!marco1TBD && date) {
      // Adicionar 1 dia na hora de salvar para corrigir timezone
      const adjustedDate = new Date(date);
      adjustedDate.setDate(adjustedDate.getDate() + 1);
      setFormData(prev => ({ ...prev, data_marco1: adjustedDate.toISOString().split('T')[0] }));
    } else if (!marco1TBD) {
      setFormData(prev => ({ ...prev, data_marco1: '' }));
    }
  };

  const handleMarco1TBDChange = (isTBD: boolean) => {
    setMarco1TBD(isTBD);
    if (isTBD) {
      setFormData(prev => ({ ...prev, data_marco1: 'TBD' }));
      setDataMarco1(null);
    } else if (dataMarco1) {
      const adjustedDate = new Date(dataMarco1);
      adjustedDate.setDate(adjustedDate.getDate() + 1);
      setFormData(prev => ({ ...prev, data_marco1: adjustedDate.toISOString().split('T')[0] }));
    }
  };

  const handleMarco2DateChange = (date: Date | null) => {
    setDataMarco2(date);
    if (!marco2TBD && date) {
      // Adicionar 1 dia na hora de salvar para corrigir timezone
      const adjustedDate = new Date(date);
      adjustedDate.setDate(adjustedDate.getDate() + 1);
      setFormData(prev => ({ ...prev, data_marco2: adjustedDate.toISOString().split('T')[0] }));
    } else if (!marco2TBD) {
      setFormData(prev => ({ ...prev, data_marco2: '' }));
    }
  };

  const handleMarco2TBDChange = (isTBD: boolean) => {
    setMarco2TBD(isTBD);
    if (isTBD) {
      setFormData(prev => ({ ...prev, data_marco2: 'TBD' }));
      setDataMarco2(null);
    } else if (dataMarco2) {
      const adjustedDate = new Date(dataMarco2);
      adjustedDate.setDate(adjustedDate.getDate() + 1);
      setFormData(prev => ({ ...prev, data_marco2: adjustedDate.toISOString().split('T')[0] }));
    }
  };

  const handleMarco3DateChange = (date: Date | null) => {
    setDataMarco3(date);
    if (!marco3TBD && date) {
      // Adicionar 1 dia na hora de salvar para corrigir timezone
      const adjustedDate = new Date(date);
      adjustedDate.setDate(adjustedDate.getDate() + 1);
      setFormData(prev => ({ ...prev, data_marco3: adjustedDate.toISOString().split('T')[0] }));
    } else if (!marco3TBD) {
      setFormData(prev => ({ ...prev, data_marco3: '' }));
    }
  };

  const handleMarco3TBDChange = (isTBD: boolean) => {
    setMarco3TBD(isTBD);
    if (isTBD) {
      setFormData(prev => ({ ...prev, data_marco3: 'TBD' }));
      setDataMarco3(null);
    } else if (dataMarco3) {
      const adjustedDate = new Date(dataMarco3);
      adjustedDate.setDate(adjustedDate.getDate() + 1);
      setFormData(prev => ({ ...prev, data_marco3: adjustedDate.toISOString().split('T')[0] }));
    }
  };

  return {
    handleMarco1DateChange,
    handleMarco1TBDChange,
    handleMarco2DateChange,
    handleMarco2TBDChange,
    handleMarco3DateChange,
    handleMarco3TBDChange
  };
}
