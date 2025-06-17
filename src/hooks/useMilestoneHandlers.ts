
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
      // Salvar a data exatamente como selecionada
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      setFormData(prev => ({ ...prev, data_marco1: dateString }));
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
      const year = dataMarco1.getFullYear();
      const month = String(dataMarco1.getMonth() + 1).padStart(2, '0');
      const day = String(dataMarco1.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      setFormData(prev => ({ ...prev, data_marco1: dateString }));
    }
  };

  const handleMarco2DateChange = (date: Date | null) => {
    setDataMarco2(date);
    if (!marco2TBD && date) {
      // Salvar a data exatamente como selecionada
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      setFormData(prev => ({ ...prev, data_marco2: dateString }));
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
      const year = dataMarco2.getFullYear();
      const month = String(dataMarco2.getMonth() + 1).padStart(2, '0');
      const day = String(dataMarco2.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      setFormData(prev => ({ ...prev, data_marco2: dateString }));
    }
  };

  const handleMarco3DateChange = (date: Date | null) => {
    setDataMarco3(date);
    if (!marco3TBD && date) {
      // Salvar a data exatamente como selecionada
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      setFormData(prev => ({ ...prev, data_marco3: dateString }));
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
      const year = dataMarco3.getFullYear();
      const month = String(dataMarco3.getMonth() + 1).padStart(2, '0');
      const day = String(dataMarco3.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      setFormData(prev => ({ ...prev, data_marco3: dateString }));
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
