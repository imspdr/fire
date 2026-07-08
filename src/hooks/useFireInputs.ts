import { useState, useEffect } from 'react';
import { CalculatorMode } from '../types/fire';

const getSavedValue = (key: string, defaultValue: string) => {
  if (typeof window === 'undefined') return defaultValue;
  const saved = localStorage.getItem(key);
  return saved !== null ? saved : defaultValue;
};

export const useFireInputs = () => {
  const [mode, setMode] = useState<CalculatorMode>(() => getSavedValue('fire_mode', 'simple') as CalculatorMode);
  const [investedCash, setInvestedCash] = useState(() => getSavedValue('fire_investedCash', ''));
  const [fixedCash, setFixedCash] = useState(() => getSavedValue('fire_fixedCash', '0'));
  const [isaPrincipal, setIsaPrincipal] = useState(() => getSavedValue('fire_isaPrincipal', ''));
  const [annualSavings, setAnnualSavings] = useState(() => getSavedValue('fire_annualSavings', ''));
  const [annualReturnRate, setAnnualReturnRate] = useState(() => getSavedValue('fire_annualReturnRate', '5'));
  const [targetExpenses, setTargetExpenses] = useState(() => getSavedValue('fire_targetExpenses', ''));
  const [targetFixedCash, setTargetFixedCash] = useState(() => getSavedValue('fire_targetFixedCash', '0'));
  const [retirementDuration, setRetirementDuration] = useState(() => getSavedValue('fire_retirementDuration', '40'));
  const [targetLegacy, setTargetLegacy] = useState(() => getSavedValue('fire_targetLegacy', '5000'));
  const [targetRetirementYears, setTargetRetirementYears] = useState(() => getSavedValue('fire_targetRetirementYears', '10'));

  useEffect(() => {
    localStorage.setItem('fire_mode', mode);
    localStorage.setItem('fire_investedCash', investedCash);
    localStorage.setItem('fire_fixedCash', fixedCash);
    localStorage.setItem('fire_isaPrincipal', isaPrincipal);
    localStorage.setItem('fire_annualSavings', annualSavings);
    localStorage.setItem('fire_annualReturnRate', annualReturnRate);
    localStorage.setItem('fire_targetExpenses', targetExpenses);
    localStorage.setItem('fire_targetFixedCash', targetFixedCash);
    localStorage.setItem('fire_retirementDuration', retirementDuration);
    localStorage.setItem('fire_targetLegacy', targetLegacy);
    localStorage.setItem('fire_targetRetirementYears', targetRetirementYears);
  }, [mode, investedCash, fixedCash, isaPrincipal, annualSavings, annualReturnRate, targetExpenses, targetFixedCash, retirementDuration, targetLegacy, targetRetirementYears]);

  return {
    mode, setMode,
    investedCash, setInvestedCash,
    fixedCash, setFixedCash,
    isaPrincipal, setIsaPrincipal,
    annualSavings, setAnnualSavings,
    annualReturnRate, setAnnualReturnRate,
    targetExpenses, setTargetExpenses,
    targetFixedCash, setTargetFixedCash,
    retirementDuration, setRetirementDuration,
    targetLegacy, setTargetLegacy,
    targetRetirementYears, setTargetRetirementYears,
  };
};
