import styled from '@emotion/styled';

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border-radius: 6px;
  border: 1px solid transparent;
  background-color: var(--background-1);
  transition: all 0.2s ease;
  overflow: hidden;

  &:focus-within {
    background-color: var(--background-1);
    border-color: var(--primary-1);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-1) 20%, transparent);
  }
`;

export const StyledInput = styled.input`
  padding: 10px 12px;
  border: none;
  font-size: 15px;
  color: var(--foreground-1);
  background: transparent;
  flex: 1;
  width: 100%;
  min-width: 0;

  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: var(--foreground-3);
  }
`;

export const UnitText = styled.span`
  color: var(--foreground-2);
  font-size: 13px;
  padding-right: 12px;
  white-space: nowrap;
`;
