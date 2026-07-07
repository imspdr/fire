import styled from '@emotion/styled';

export const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--imspdr-background-3);
  margin-top: 16px;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 500px;

  th, td {
    padding: 8px 10px;
    text-align: right;
    border-bottom: 1px solid var(--imspdr-background-3);
    font-size: 13px;
    color: var(--imspdr-foreground-1);
  }

  th {
    background-color: var(--imspdr-background-2);
    font-weight: 600;
    position: sticky;
    top: 0;
    white-space: nowrap;
    font-size: 12px;
  }

  th:first-of-type, td:first-of-type {
    text-align: left;
    min-width: 60px;
  }

  tr.fire-row {
    background-color: color-mix(in srgb, var(--imspdr-success-1) 10%, transparent);
  }
  
  tr.isa-cancel-row {
    background-color: color-mix(in srgb, var(--imspdr-warning-1) 20%, transparent);
  }
  
  tr:last-child td {
    border-bottom: none;
  }
`;
