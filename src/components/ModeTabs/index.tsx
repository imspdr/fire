import { FC } from 'react';
import { TabContainer, TabButton } from './styles';
import { CalculatorMode } from '../../types/fire';

export const ModeTabs: FC<{
  mode: CalculatorMode;
  setMode: (mode: CalculatorMode) => void;
}> = ({ mode, setMode }) => {
  return (
    <TabContainer>
      <TabButton active={mode === 'simple'} onClick={() => setMode('simple')}>
        일반 (세후)
      </TabButton>
      <TabButton active={mode === 'complex'} onClick={() => setMode('complex')}>
        ISA (영구)
      </TabButton>
      <TabButton active={mode === 'legacy'} onClick={() => setMode('legacy')}>
        ISA (소진)
      </TabButton>
      <TabButton active={mode === 'reverse'} onClick={() => setMode('reverse')}>
        목표 역산
      </TabButton>
    </TabContainer>
  );
};
