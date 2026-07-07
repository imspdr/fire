import styled from '@emotion/styled';

export const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  background-color: var(--imspdr-background-2);
  padding: 4px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

export const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  background-color: ${({ active }) => (active ? 'var(--imspdr-background-1)' : 'transparent')};
  color: ${({ active }) => (active ? 'var(--imspdr-primary-1)' : 'var(--imspdr-foreground-2)')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  box-shadow: ${({ active }) => (active ? '0 1px 3px var(--imspdr-shadow)' : 'none')};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 15px;
  word-break: keep-all;

  &:hover {
    color: ${({ active }) => (active ? 'var(--imspdr-primary-1)' : 'var(--imspdr-foreground-1)')};
    background-color: ${({ active }) => (active ? 'var(--imspdr-background-1)' : 'var(--imspdr-background-3)')};
  }
`;
