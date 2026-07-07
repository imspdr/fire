import styled from '@emotion/styled';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  max-width: 760px;
  margin: 0 auto;
  gap: 20px;
  box-sizing: border-box;
  width: 100%;

  @media (max-width: 767px) {
    padding: 12px;
    gap: 12px;
  }
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: var(--background-2);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px var(--shadow);
  border: 1px solid var(--background-3);

  @media (max-width: 767px) {
    padding: 0;
    gap: 16px;
    border-radius: 0;
    box-shadow: none;
    border: none;
    background-color: transparent;
  }
`;

export const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`;
