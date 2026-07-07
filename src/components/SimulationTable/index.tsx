import { FC } from 'react';
import { TableContainer, StyledTable } from './styles';
import { YearData, ComplexYearData, CalculatorMode } from '../../types/fire';

interface Props {
  mode: CalculatorMode;
  simpleResult?: { projection: YearData[] } | null;
  complexResult?: { projection: ComplexYearData[] } | null;
}

export const SimulationTable: FC<Props> = ({ mode, simpleResult, complexResult }) => {
  const formatNumber = (num: number) => Math.round(num).toLocaleString('ko-KR');

  if (mode === 'simple' && simpleResult) {
    return (
      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <th>연도</th>
              <th>현금</th>
              <th>저축액</th>
              <th>생활비</th>
              <th>이자</th>
            </tr>
          </thead>
          <tbody>
            {simpleResult.projection.map((row) => (
              <tr key={row.year} className={row.isFire ? 'fire-row' : ''}>
                <td>{row.year}년</td>
                <td>{formatNumber(row.startInvestedCash)}</td>
                <td>{formatNumber(row.savingsAdded)}</td>
                <td style={{ color: row.livingExpenseWithdrawal > 0 ? 'var(--danger-1)' : 'inherit' }}>
                  {row.livingExpenseWithdrawal > 0 ? `-${formatNumber(row.livingExpenseWithdrawal)}` : 0}
                </td>
                <td style={{ color: 'var(--success-1)' }}>+{formatNumber(row.interestEarned)}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>
    );
  }

  if (complexResult && mode !== 'reverse') {
    return (
      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <th>연도</th>
              <th>현금</th>
              <th>ISA</th>
              <th>저축액</th>
              <th>생활비</th>
              <th>이자</th>
            </tr>
          </thead>
          <tbody>
            {complexResult.projection.map((row) => (
              <tr 
                key={row.year} 
                className={`${row.isFire ? 'fire-row' : ''} ${row.isaCancelledThisYear ? 'isa-cancel-row' : ''}`.trim()}
              >
                <td>{row.year}년</td>
                <td>{formatNumber(row.startGeneralCash)}</td>
                <td>{formatNumber(row.startIsaTotal)}</td>
                <td>{formatNumber(row.savingsAdded)}</td>
                <td style={{ color: row.livingExpenseWithdrawal > 0 ? 'var(--danger-1)' : 'inherit' }}>
                  {row.livingExpenseWithdrawal > 0 ? `-${formatNumber(row.livingExpenseWithdrawal)}` : 0}
                </td>
                <td style={{ color: 'var(--success-1)' }}>+{formatNumber(row.generalInterestEarned + row.isaInterestEarned)}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>
    );
  }

  return null;
};
