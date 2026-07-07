import { CalcParams, YearData, ComplexYearData } from '../types/fire';

export const calculateSimple = (params: CalcParams) => {
  const { general, savings, preTaxRate, target, currentYear, remainingMonths } = params;
  const netRate = preTaxRate * (1 - 0.154);
  const requiredFireCash = (target / (netRate / 100)) + target;
  
  let currentInvested = general;
  const projection: YearData[] = [];
  let foundFireYear: number | null = null;

  for (let i = 0; i < 60; i++) {
    const year = currentYear + i;
    const startInvestedCash = currentInvested;
    
    if (foundFireYear === null && currentInvested >= requiredFireCash) {
      foundFireYear = year;
    }
    
    const isRetired = foundFireYear !== null && year >= foundFireYear;

    let savingsAdded = 0;
    let livingExpenseWithdrawal = 0;

    if (!isRetired) {
      savingsAdded = i === 0 ? savings * (remainingMonths / 12) : savings;
      currentInvested += savingsAdded;
    } else {
      livingExpenseWithdrawal = target;
      currentInvested -= livingExpenseWithdrawal;
    }
    
    const interestEarned = currentInvested * (netRate / 100);
    
    projection.push({
      year,
      startInvestedCash,
      savingsAdded,
      livingExpenseWithdrawal,
      endInvestedCash: currentInvested,
      interestEarned,
      isFire: isRetired
    });
    
    currentInvested += interestEarned;
  }

  return { fireYear: foundFireYear, projection };
};

export const calculateIsaModel = (params: CalcParams, mode: 'complex' | 'legacy', legacyParams?: { duration: number; target: number }) => {
  const { general, initialIsaPrincipal, savings, preTaxRate, target, currentYear, remainingMonths } = params;
  const netRate = preTaxRate * (1 - 0.154);
  const requiredFireCash = (target / (netRate / 100)) + target;

  let currentGeneral = general;
  let currentIsaPrincipal = initialIsaPrincipal;
  let currentIsaInterest = 0;

  const checkFirePossible = (simGen: number, simIsaP: number, simIsaI: number): boolean => {
    let sg = simGen, sp = simIsaP, si = simIsaI;

    if (mode === 'legacy' && legacyParams) {
      for (let j = 0; j < legacyParams.duration; j++) {
        sg -= target;
        if (sg < 0) {
          sg += (sp + si - si * 0.099);
          sp = 0; si = 0;
          if (sg < 0) return false;
        }
        sg += sg * (netRate / 100);
        si += (sp + si) * (preTaxRate / 100);
      }
      return (sg + sp + si - si * 0.099) >= legacyParams.target;
    } else {
      for (let j = 0; j < 60; j++) {
        if ((sg + sp + si - si * 0.099) >= requiredFireCash) return true;
        sg -= target;
        if (sg < 0) return false;
        sg += sg * (netRate / 100);
        si += (sp + si) * (preTaxRate / 100);
      }
      return false;
    }
  };

  const projection: ComplexYearData[] = [];
  let foundFireYear: number | null = null;

  for (let i = 0; i < 60; i++) {
    const year = currentYear + i;
    const startGeneralCash = currentGeneral;
    const startIsaTotal = currentIsaPrincipal + currentIsaInterest;
    const potentialTotalCash = currentGeneral + currentIsaPrincipal + currentIsaInterest - (currentIsaInterest * 0.099);
    
    if (foundFireYear === null && checkFirePossible(currentGeneral, currentIsaPrincipal, currentIsaInterest)) {
      foundFireYear = year;
    }

    const isRetired = foundFireYear !== null && year >= foundFireYear;
    let savingsAdded = 0, livingExpenseWithdrawal = 0, isaCancelledThisYear = false;

    if (!isRetired) {
      savingsAdded = i === 0 ? savings * (remainingMonths / 12) : savings;
      const savingsToIsa = Math.min(savingsAdded, Math.max(0, Math.min(10000 - currentIsaPrincipal, 2000)));
      currentIsaPrincipal += savingsToIsa;
      currentGeneral += (savingsAdded - savingsToIsa);
    } else {
      livingExpenseWithdrawal = target;
      
      let needToCancelIsa = false;
      if (mode === 'legacy') {
        needToCancelIsa = currentGeneral < livingExpenseWithdrawal;
      } else {
        needToCancelIsa = 
          (currentGeneral < livingExpenseWithdrawal) || 
          (currentGeneral < requiredFireCash && potentialTotalCash >= requiredFireCash);
      }

      if (needToCancelIsa && (currentIsaPrincipal > 0 || currentIsaInterest > 0)) {
        isaCancelledThisYear = true;
        currentGeneral += (currentIsaPrincipal + currentIsaInterest - currentIsaInterest * 0.099);
        currentIsaPrincipal = 0;
        currentIsaInterest = 0;
      }
      currentGeneral -= livingExpenseWithdrawal;
    }

    const generalInterestEarned = currentGeneral * (netRate / 100);
    const isaInterestEarned = (currentIsaPrincipal + currentIsaInterest) * (preTaxRate / 100);

    projection.push({
      year, startGeneralCash, startIsaTotal, savingsAdded, livingExpenseWithdrawal,
      isaCancelledThisYear, endGeneralCash: currentGeneral, endIsaTotal: currentIsaPrincipal + currentIsaInterest,
      generalInterestEarned, isaInterestEarned, potentialTotalCash, isFire: isRetired
    });

    currentGeneral += generalInterestEarned;
    currentIsaInterest += isaInterestEarned;
  }

  return { fireYear: foundFireYear, projection };
};

export const calculateReverse = (params: CalcParams, targetRetirementYears: number, retirementDuration: number, legacyTarget: number) => {
  const { general, initialIsaPrincipal, savings, preTaxRate, currentYear, remainingMonths } = params;
  const netRate = preTaxRate * (1 - 0.154);
  
  let sg = general;
  let sp = initialIsaPrincipal;
  let si = 0;

  for (let i = 0; i < targetRetirementYears; i++) {
    const savingsAdded = i === 0 ? savings * (remainingMonths / 12) : savings;
    const savingsToIsa = Math.min(savingsAdded, Math.max(0, Math.min(10000 - sp, 2000)));
    sp += savingsToIsa;
    sg += (savingsAdded - savingsToIsa);

    sg += sg * (netRate / 100);
    si += (sp + si) * (preTaxRate / 100);
  }

  const accumulatedGeneral = sg;
  const accumulatedIsaTotal = sp + si;
  const isaCancelTax = si * 0.099;
  const netTotalCash = accumulatedGeneral + accumulatedIsaTotal - isaCancelTax;

  const maxInfiniteWithdrawal = netTotalCash * (netRate / 100);

  const checkSustain = (withdrawal: number) => {
    let t_sg = sg, t_sp = sp, t_si = si;
    for (let j = 0; j < retirementDuration; j++) {
      t_sg -= withdrawal;
      if (t_sg < 0) {
        t_sg += (t_sp + t_si - t_si * 0.099);
        t_sp = 0; t_si = 0;
        if (t_sg < 0) return false;
      }
      t_sg += t_sg * (netRate / 100);
      t_si += (t_sp + t_si) * (preTaxRate / 100);
    }
    return (t_sg + t_sp + t_si - t_si * 0.099) >= legacyTarget;
  };

  let maxDepletionWithdrawal = 0;
  
  if (checkSustain(0)) {
    let low = 0;
    let high = netTotalCash * 2;
    for (let i = 0; i < 50; i++) {
      const mid = (low + high) / 2;
      if (checkSustain(mid)) {
        maxDepletionWithdrawal = mid;
        low = mid;
      } else {
        high = mid;
      }
    }
  }

  return {
    targetYear: currentYear + targetRetirementYears,
    accumulatedGeneral,
    accumulatedIsaTotal,
    netTotalCash,
    maxInfiniteWithdrawal,
    maxDepletionWithdrawal
  };
};
