export type CalculatorMode = 'simple' | 'complex' | 'legacy' | 'reverse';

export interface YearData {
  year: number;
  startInvestedCash: number;
  savingsAdded: number;
  livingExpenseWithdrawal: number;
  endInvestedCash: number;
  interestEarned: number;
  isFire: boolean;
  totalNetWorth: number;
}

export interface ComplexYearData {
  year: number;
  startGeneralCash: number;
  startIsaTotal: number;
  savingsAdded: number;
  livingExpenseWithdrawal: number;
  isaCancelledThisYear: boolean;
  endGeneralCash: number;
  endIsaTotal: number;
  generalInterestEarned: number;
  isaInterestEarned: number;
  potentialTotalCash: number;
  isFire: boolean;
  totalNetWorth: number;
}

export interface CalcParams {
  general: number;
  fixedCash: number;
  targetFixedCash: number;
  initialIsaPrincipal: number;
  savings: number;
  preTaxRate: number;
  target: number;
  currentYear: number;
  remainingMonths: number;
}

export interface ReverseResult {
  targetYear: number;
  accumulatedGeneral: number;
  accumulatedIsaTotal: number;
  netTotalCash: number;
  maxInfiniteWithdrawal: number;
  maxDepletionWithdrawal: number;
}
