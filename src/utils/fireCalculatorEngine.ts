import { CalcParams, YearData, ComplexYearData } from '../types/fire';

export const calculateSimple = (params: CalcParams) => {
  const { general, fixedCash, targetFixedCash, savings, preTaxRate, postRetirementRate, target, currentYear, remainingMonths } = params;
  const netRate = preTaxRate * (1 - 0.154);
  const postNetRate = postRetirementRate * (1 - 0.154);
  const requiredFireCash = (target / (postNetRate / 100)) + target;
  
  let currentInvested = general;
  let currentFixed = fixedCash;
  const projection: YearData[] = [];
  let foundFireYear: number | null = null;

  for (let i = 0; i < 60; i++) {
    const year = currentYear + i;
    const startInvestedCash = currentInvested;
    
    if (foundFireYear === null && (currentInvested + currentFixed) >= (requiredFireCash + targetFixedCash)) {
      foundFireYear = year;
      currentInvested = (currentInvested + currentFixed) - targetFixedCash;
      currentFixed = targetFixedCash;
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
    
    const currentRate = isRetired ? postNetRate : netRate;
    const interestEarned = currentInvested * (currentRate / 100);
    
    projection.push({
      year,
      startInvestedCash,
      savingsAdded,
      livingExpenseWithdrawal,
      endInvestedCash: currentInvested,
      interestEarned,
      isFire: isRetired,
      totalNetWorth: currentInvested + interestEarned + currentFixed
    });
    
    currentInvested += interestEarned;
  }

  return { fireYear: foundFireYear, projection };
};

export const calculateIsaModel = (params: CalcParams, mode: 'complex' | 'legacy', legacyParams?: { duration: number; target: number }) => {
  const { general, fixedCash, targetFixedCash, initialIsaPrincipal, savings, preTaxRate, postRetirementRate, target, currentYear, remainingMonths } = params;
  const netRate = preTaxRate * (1 - 0.154);
  const postNetRate = postRetirementRate * (1 - 0.154);
  const requiredFireCash = (target / (postNetRate / 100)) + target;

  let currentGeneral = general;
  let currentFixed = fixedCash;
  let currentIsaPrincipal = initialIsaPrincipal;
  let currentIsaInterest = 0;

  const checkFirePossible = (simGen: number, simIsaP: number, simIsaI: number, simFixed: number): boolean => {
    let sg = simGen, sp = simIsaP, si = simIsaI;
    
    const housingDiff = targetFixedCash - simFixed;
    sg -= housingDiff;
    if (sg < 0) {
      sg += (sp + si - si * 0.099);
      sp = 0; si = 0;
    }
    if (sg < 0) return false;

    if (mode === 'legacy' && legacyParams) {
      for (let j = 0; j < legacyParams.duration; j++) {
        sg -= target;
        if (sg < 0) {
          sg += (sp + si - si * 0.099);
          sp = 0; si = 0;
          if (sg < 0) return false;
        }
        sg += sg * (postNetRate / 100);
        si += (sp + si) * (postRetirementRate / 100);
      }
      return (sg + sp + si - si * 0.099) >= legacyParams.target;
    } else {
      return (sg + sp + si - si * 0.099) >= requiredFireCash;
    }
  };

  const projection: ComplexYearData[] = [];
  let foundFireYear: number | null = null;

  for (let i = 0; i < 60; i++) {
    const year = currentYear + i;
    const startGeneralCash = currentGeneral;
    const startIsaTotal = currentIsaPrincipal + currentIsaInterest;
    const potentialTotalCash = currentGeneral + currentIsaPrincipal + currentIsaInterest - (currentIsaInterest * 0.099);
    
    if (foundFireYear === null && checkFirePossible(currentGeneral, currentIsaPrincipal, currentIsaInterest, currentFixed)) {
      foundFireYear = year;
      const housingDiff = targetFixedCash - currentFixed;
      currentGeneral -= housingDiff;
      currentFixed = targetFixedCash;
      if (currentGeneral < 0) {
        currentGeneral += (currentIsaPrincipal + currentIsaInterest - currentIsaInterest * 0.099);
        currentIsaPrincipal = 0;
        currentIsaInterest = 0;
      }
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

    const currentGeneralRate = isRetired ? postNetRate : netRate;
    const currentIsaRate = isRetired ? postRetirementRate : preTaxRate;

    const generalInterestEarned = currentGeneral * (currentGeneralRate / 100);
    const isaInterestEarned = (currentIsaPrincipal + currentIsaInterest) * (currentIsaRate / 100);

    projection.push({
      year, startGeneralCash, startIsaTotal, savingsAdded, livingExpenseWithdrawal,
      isaCancelledThisYear, endGeneralCash: currentGeneral, endIsaTotal: currentIsaPrincipal + currentIsaInterest,
      generalInterestEarned, isaInterestEarned, potentialTotalCash, isFire: isRetired,
      totalNetWorth: currentGeneral + generalInterestEarned + currentIsaPrincipal + currentIsaInterest + isaInterestEarned + currentFixed
    });

    currentGeneral += generalInterestEarned;
    currentIsaInterest += isaInterestEarned;
  }

  return { fireYear: foundFireYear, projection };
};

export const calculateReverse = (params: CalcParams, targetRetirementYears: number, retirementDuration: number, legacyTarget: number) => {
  const { general, fixedCash, targetFixedCash, initialIsaPrincipal, savings, preTaxRate, postRetirementRate, currentYear, remainingMonths } = params;
  const netRate = preTaxRate * (1 - 0.154);
  const postNetRate = postRetirementRate * (1 - 0.154);
  
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
  const netTotalCash = accumulatedGeneral + accumulatedIsaTotal - isaCancelTax + fixedCash;
  const investableCashAtRetirement = Math.max(0, netTotalCash - targetFixedCash);

  const maxInfiniteWithdrawal = investableCashAtRetirement * (postNetRate / 100);

  const checkSustain = (withdrawal: number) => {
    let t_sg = sg, t_sp = sp, t_si = si;
    
    const housingDiff = targetFixedCash - fixedCash;
    t_sg -= housingDiff;
    if (t_sg < 0) {
      t_sg += (t_sp + t_si - t_si * 0.099);
      t_sp = 0; t_si = 0;
      if (t_sg < 0) return false;
    }

    for (let j = 0; j < retirementDuration; j++) {
      t_sg -= withdrawal;
      if (t_sg < 0) {
        t_sg += (t_sp + t_si - t_si * 0.099);
        t_sp = 0; t_si = 0;
        if (t_sg < 0) return false;
      }
      t_sg += t_sg * (postNetRate / 100);
      t_si += (t_sp + t_si) * (postRetirementRate / 100);
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
