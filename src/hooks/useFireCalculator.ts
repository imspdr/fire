import { useState } from 'react';
import { useFireInputs } from './useFireInputs';
import { calculateSimple, calculateIsaModel, calculateReverse } from '../utils/fireCalculatorEngine';
import { CalcParams, YearData, ComplexYearData, ReverseResult } from '../types/fire';

export const useFireCalculator = () => {
  const inputs = useFireInputs();
  
  const [simpleResult, setSimpleResult] = useState<{ fireYear: number | null; yearsLeft: number | null; projection: YearData[] } | null>(null);
  const [complexResult, setComplexResult] = useState<{ fireYear: number | null; yearsLeft: number | null; projection: ComplexYearData[] } | null>(null);
  const [reverseResult, setReverseResult] = useState<ReverseResult | null>(null);

  const calculate = () => {
    const general = Number(inputs.investedCash) || 0;
    const fixedCash = Number(inputs.fixedCash) || 0;
    const initialIsaPrincipal = Number(inputs.isaPrincipal) || 0;
    const savings = Number(inputs.annualSavings) || 0;
    const preTaxRate = Number(inputs.annualReturnRate) || 0;
    const target = Number(inputs.targetExpenses) || 0;
    const targetFixedCash = inputs.mode === 'reverse' ? (Number(inputs.fixedCash) || 0) : (Number(inputs.targetFixedCash) || 0);

    if (preTaxRate <= 0) {
      alert('연 수익률은 0보다 커야 합니다.');
      return;
    }

    if (inputs.mode !== 'reverse' && target <= 0) {
      alert('목표 연 생활비는 0보다 커야 합니다.');
      return;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const remainingMonths = 12 - (currentDate.getMonth() + 1) + 1;

    const baseParams: CalcParams = { general, fixedCash, targetFixedCash, initialIsaPrincipal, savings, preTaxRate, target, currentYear, remainingMonths };

    if (inputs.mode === 'reverse') {
      const targetYears = Number(inputs.targetRetirementYears) || 10;
      const duration = Number(inputs.retirementDuration) || 40;
      const legacyTarget = Number(inputs.targetLegacy) || 0;
      const result = calculateReverse(baseParams, targetYears, duration, legacyTarget);
      setReverseResult(result);
      setSimpleResult(null);
      setComplexResult(null);
    } else if (inputs.mode === 'simple') {
      const { fireYear, projection } = calculateSimple(baseParams);
      setSimpleResult({ fireYear, yearsLeft: fireYear !== null ? fireYear - currentYear : null, projection });
      setComplexResult(null);
      setReverseResult(null);
    } else {
      const legacyParams = inputs.mode === 'legacy' ? { duration: Number(inputs.retirementDuration) || 40, target: Number(inputs.targetLegacy) || 0 } : undefined;
      const { fireYear, projection } = calculateIsaModel(baseParams, inputs.mode, legacyParams);
      setComplexResult({ fireYear, yearsLeft: fireYear !== null ? fireYear - currentYear : null, projection });
      setSimpleResult(null);
      setReverseResult(null);
    }
  };

  return {
    ...inputs,
    simpleResult,
    complexResult,
    reverseResult,
    calculate,
  };
};
