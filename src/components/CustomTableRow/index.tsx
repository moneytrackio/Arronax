import * as React from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';
import { getColumns } from '../../reducers/app/selectors';
import styled from 'styled-components';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Circle from '@material-ui/icons/FiberManualRecord';

const TableRowWrapper = styled(TableRow)`
  &&& {
    &:nth-of-type(odd) {
      background-color: #ecedef;
    }
  }
`;

const StyledCircle = styled(Circle)`
  color: rgb(255, 155, 213);
`;

const StyledCell = styled(TableCell)`
  &&& {
    color: #4a4a4a;
    font-size: 16px;
    font-weight: 300;
    letter-spacing: -0.55px;
    border: none;
  }
`;

const SpanContainer = styled.span`
  display: flex;
`;

const styles = {
  linkUnderline: {
    textDecoration: 'none',
    color: '#10ADE4',
  },
};

interface Props {
  category: string;
  item: object;
  selectedColumns: any[];
}

export const displayType = (shortenedItem, item, dataIndex) => {
  if (dataIndex === 'accountId' || dataIndex === 'manager') {
    return (
      <>
        <StyledCircle /> <StyledCircle />
        <a
          href={`https://zeronet.tzscan.io/${item[dataIndex]}`}
          style={styles.linkUnderline}
        >
          {shortenedItem[dataIndex]}
        </a>
      </>
    );
  } else if (
    dataIndex === 'predecessor' ||
    dataIndex === 'hash' ||
    dataIndex === 'operationsHash' ||
    dataIndex === 'blockId' ||
    dataIndex === 'blockHash' ||
    dataIndex === 'operationGroupHash'
  ) {
    return (
      <>
        <a
          href={`https://zeronet.tzscan.io/${item[dataIndex]}`}
          style={styles.linkUnderline}
        >
          {shortenedItem[dataIndex]}
        </a>
      </>
    );
  } else {
    return item[dataIndex];
  }
};

const CustomTableRow: React.StatelessComponent<Props> = props => {
  const { selectedColumns, item } = props;
  const shortenedItem = { ...item };
  let itemsArray = Object.keys(shortenedItem);
  itemsArray.forEach(hash => {
    if (
      hash.toLowerCase().includes('hash') ||
      hash.toLowerCase().includes('predecessor') ||
      hash.toLowerCase().includes('accountid') ||
      hash.toLowerCase().includes('blockid') ||
      hash.toLowerCase().includes('manager')
    ) {
      const hashRepresentation = item[hash];
      const firstHalf = hashRepresentation.substring(0, 6);
      const secondHalf = hashRepresentation.substring(
        hashRepresentation.length - 6,
        hashRepresentation.length
      );
      const newHash = `${firstHalf}...${secondHalf}`;
      shortenedItem[hash] = newHash;
    }
    return shortenedItem[hash];
  });

  return (
    <TableRowWrapper>
      {selectedColumns.map(column => {
        return (
          <StyledCell key={column.key}>
            {column.dataIndex === 'timestamp' ? (
              moment(item[column.dataIndex]).format('dd MM YYYY h:mm:ss a')
            ) : (
              // NOTE: SpanContainer necessary to avoid error (for passing isIcon: boolean):
              // Warning: Failed prop type: Invalid prop children supplied to TableCell, expected a ReactNode.
              <SpanContainer>
                {displayType(shortenedItem, item, column.dataIndex)}
              </SpanContainer>
            )}
          </StyledCell>
        );
      })}
    </TableRowWrapper>
  );
};

const mapStateToProps = (state: any) => ({
  selectedColumns: getColumns(state),
});

export default connect(
  mapStateToProps,
  null
)(CustomTableRow);
