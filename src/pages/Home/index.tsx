import { FC } from 'react';
import { Button } from '@imspdr/ui';
import { PageContainer, Section, InputGrid } from './styles';
import { useFireCalculator } from '../../hooks/useFireCalculator';
import { NumberInput } from '../../components/NumberInput';
import { ModeTabs } from '../../components/ModeTabs';
import { SimulationTable } from '../../components/SimulationTable';
import { ResultSummary } from '../../components/ResultSummary';

const HomePage: FC = () => {
  const {
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
    simpleResult,
    complexResult,
    reverseResult,
    calculate,
  } = useFireCalculator();

  const hasResult = (mode === 'simple' && simpleResult) || 
                    (mode === 'reverse' && reverseResult) || 
                    (mode !== 'simple' && mode !== 'reverse' && complexResult);

  return (
    <PageContainer>
      <ModeTabs mode={mode} setMode={setMode} />

      <Section>
        <InputGrid>
          <NumberInput
            label={mode === 'simple' ? "보유현금 (이자 발생)" : "일반 계좌 보유현금"}
            value={investedCash}
            onChange={setInvestedCash}
            unit="만원"
            placeholder="10000"
          />
          <NumberInput
            label="고정 자산 (전세금 등, 이자 없음)"
            value={fixedCash}
            onChange={setFixedCash}
            unit="만원"
            placeholder="예: 20000"
          />
          {mode !== 'simple' && (
            <NumberInput
              label="현재 ISA 계좌 원금 (최대 1억)"
              value={isaPrincipal}
              onChange={setIsaPrincipal}
              unit="만원"
              placeholder="예: 2000"
            />
          )}
          <NumberInput
            label="연 저축액"
            value={annualSavings}
            onChange={setAnnualSavings}
            unit="만원"
            placeholder="3000"
          />
          {mode !== 'reverse' && (
            <>
              <NumberInput
                label="목표 연 생활비"
                value={targetExpenses}
                onChange={setTargetExpenses}
                unit="만원"
                placeholder="4000"
              />
              <NumberInput
                label="목표 거주/고정 자산"
                value={targetFixedCash}
                onChange={setTargetFixedCash}
                unit="만원"
                placeholder="예: 30000"
              />
            </>
          )}
          {mode === 'reverse' && (
            <NumberInput
              label="목표 은퇴 시점"
              value={targetRetirementYears}
              onChange={setTargetRetirementYears}
              unit="년 뒤"
              placeholder="10"
            />
          )}
          <NumberInput
            label="예상 연 수익률 (세전)"
            value={annualReturnRate}
            onChange={setAnnualReturnRate}
            unit="%"
            placeholder="5"
          />
          { (mode === 'legacy' || mode === 'reverse') && (
            <>
              <NumberInput
                label="은퇴 후 생존 기간"
                value={retirementDuration}
                onChange={setRetirementDuration}
                unit="년"
                placeholder="예: 40"
              />
              <NumberInput
                label="목표 잔여 자산"
                value={targetLegacy}
                onChange={setTargetLegacy}
                unit="만원"
                placeholder="예: 5000"
              />
            </>
          )}
        </InputGrid>

        <Button
          variant="contained"
          color="primary.1"
          size="lg"
          fullWidth
          onClick={calculate}
          style={{ marginTop: '8px' }}
        >
          은퇴 가능 여부 계산하기
        </Button>
      </Section>

      {hasResult && (
        <Section>
          <ResultSummary 
            mode={mode}
            simpleResult={simpleResult}
            complexResult={complexResult}
            reverseResult={reverseResult}
            targetRetirementYears={targetRetirementYears}
            retirementDuration={retirementDuration}
            targetLegacy={targetLegacy}
          />
          <SimulationTable 
            mode={mode}
            simpleResult={simpleResult}
            complexResult={complexResult}
          />
        </Section>
      )}
    </PageContainer>
  );
};

export default HomePage;
