import styled from '@emotion/styled';

export const ResultCard = styled.div<{ isSuccess: boolean }>`
  background-color: ${({ isSuccess }) => (isSuccess ? 'color-mix(in srgb, var(--imspdr-success-1) 10%, transparent)' : 'color-mix(in srgb, var(--imspdr-warning-1) 10%, transparent)')};
  border: 1px solid ${({ isSuccess }) => (isSuccess ? 'var(--imspdr-success-1)' : 'var(--imspdr-warning-1)')};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  text-align: center;

  @media (max-width: 767px) {
    padding: 12px;
    border-radius: 8px;
  }
`;
