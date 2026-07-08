import { FC } from 'react';
import { Typography } from '@imspdr/ui';
import { ResultCard } from './styles';
import { CalculatorMode, ReverseResult, YearData, ComplexYearData } from '../../types/fire';

interface Props {
  mode: CalculatorMode;
  simpleResult: { fireYear: number | null; yearsLeft: number | null; projection: YearData[] } | null;
  complexResult: { fireYear: number | null; yearsLeft: number | null; projection: ComplexYearData[] } | null;
  reverseResult: ReverseResult | null;
  targetRetirementYears: string;
  retirementDuration: string;
  targetLegacy: string;
}

export const ResultSummary: FC<Props> = ({ mode, simpleResult, complexResult, reverseResult, targetRetirementYears, retirementDuration, targetLegacy }) => {
  const formatNumber = (num: number) => Math.round(num).toLocaleString('ko-KR');
  const result = mode === 'simple' ? simpleResult : mode === 'reverse' ? reverseResult : complexResult;

  if (!result) return null;

  if (mode === 'reverse' && reverseResult) {
    return (
      <ResultCard isSuccess={true}>
        <Typography variant="title" level={2} color="success.1" bold>
          {targetRetirementYears}년 뒤 ({reverseResult.targetYear}년) 예상 총 자산
        </Typography>
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography variant="body" level={1}>
            은퇴 시점 총 순자산 (고정자산 포함): <b>{formatNumber(reverseResult.netTotalCash)}</b>만원
          </Typography>
          <div style={{ marginTop: '8px', padding: '12px', background: 'var(--imspdr-background-2)', borderRadius: '8px' }}>
            <Typography variant="caption" level={1} color="foreground.2" style={{ marginBottom: '8px', display: 'block' }}>
              참고: 고정 자산을 제외한 투자 자산만으로 창출 가능한 연 생활비
            </Typography>
            <Typography variant="body" level={1} color="info.1">
              영구 인컴 (원금 보존): <b>연 {formatNumber(reverseResult.maxInfiniteWithdrawal)}</b>만원
            </Typography>
            <Typography variant="body" level={1} color="primary.1" style={{ marginTop: '4px' }}>
              소진 인컴 ({retirementDuration}년 후 {targetLegacy}만원 남김): <b>연 {formatNumber(reverseResult.maxDepletionWithdrawal)}</b>만원
            </Typography>
          </div>
        </div>
      </ResultCard>
    );
  }

  const fireResult = result as { fireYear: number | null; yearsLeft: number | null };
  return (
    <ResultCard isSuccess={fireResult.fireYear !== null}>
      {fireResult.fireYear !== null ? (
        <Typography variant="title" level={2} color="success.1" bold>
          {fireResult.yearsLeft === 0
            ? '현재 은퇴 가능!'
            : `${fireResult.yearsLeft}년 후 은퇴 가능! (${fireResult.fireYear}년)`}
        </Typography>
      ) : (
        <Typography variant="title" level={2} color="warning.1" bold>
          조금 더 모아야 해요!
        </Typography>
      )}
    </ResultCard>
  );
};
