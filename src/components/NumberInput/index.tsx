import { FC } from 'react';
import { Typography } from '@imspdr/ui';
import { InputGroup, InputWrapper, StyledInput, UnitText } from './styles';

export const NumberInput: FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  unit: string;
  placeholder?: string;
}> = ({ label, value, onChange, unit, placeholder }) => {
  return (
    <InputGroup>
      <Typography variant="body" level={2} bold>
        {label}
      </Typography>
      <InputWrapper>
        <StyledInput
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <UnitText>{unit}</UnitText>
      </InputWrapper>
    </InputGroup>
  );
};
