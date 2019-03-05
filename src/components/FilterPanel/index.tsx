import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PlusIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import IconButton from '@material-ui/core/IconButton';
import { fetchValues } from '../../reducers/app/thunks';
import {
  getValues,
  getEntity,
  getAttributes,
  getSelectedFilters,
  getOperators,
  getValue,
} from '../../reducers/app/selectors';
import {
  setValueAction,
  addFilterAction,
  removeFilterAction,
  changeFilterAction,
} from '../../reducers/app/actions';
import FilterSelect from '../FilterSelect';
import ValueSelect from '../ValueSelect';
import FilterInput from '../FilterInput';

const Container = styled.div`
  width: 100%;
  background: #fbfbfb;
  border: 1px solid #ededed;
  border-radius: 3px;
`;

const FilterItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px 0 30px;
`;

const FilterItemGr = styled.div`
  border-radius: 5px;
  border: 1px solid #ecedef;
  display: flex;
`;

const AddFilterFooter = styled.div`
  width: 100%;
  height: ${({ isFilters }) => (isFilters ? '67px' : '93px')};
  display: flex;
  align-items: center;
  padding-left: 24px;
  border-top: ${({ isFilters }) => (isFilters ? '1px solid #ECEDEF' : 'none')};
  margin-top: ${({ isFilters }) => (isFilters ? '18px' : '0')};
`;

const AddFilterButton = styled.div`
  color: #56c2d9;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const PlusIconWrapper = styled(PlusIcon)`
  &&& {
    color: #56c2d9;
    font-size: 27px;
  }
`;

const DeleteIconWrapper = styled(DeleteIcon)`
  &&& {
    color: #d8d8d8;
    font-size: 37px;
  }
`;

const FilterExpTxt = styled.div`
  color: #9b9b9b;
  font-size: 18px;
  margin-left: 21px;
`;

const HR = styled.div`
  width: 1px;
  background-color: #ecedef;
`;

const AndBlock = styled.div`
  color: #4a4a4a;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 400;
  padding-right: 10px;
  padding-left: 10px;
`;

const attrTabValue = {
  blocks: 'block',
  operations: 'operation',
  accounts: 'account',
};

type Props = {
  value: string;
  values: object[];
  selectedEntity: string;
  attributes: any[];
  filters: object[];
  operators: object[];
  setValue: (value: string) => void;
  fetchValues: (value: string) => void;
  addFilter: (entity: string) => void;
  removeFilter: (entity: string, index: number) => void;
  changeFilter: (entity: string, filter: object, index: number) => void;
};

type States = {
  filters: object[];
};

class FilterPanel extends React.Component<Props, States> {
  onAddFilter = () => {
    const { addFilter, selectedEntity } = this.props;
    addFilter(selectedEntity);
  };

  onRemoveFilter = index => {
    const { removeFilter, selectedEntity } = this.props;
    removeFilter(selectedEntity, index);
  };

  onFilterNameChange = (val, index) => {
    const {
      filters,
      selectedEntity,
      changeFilter,
      attributes,
      fetchValues,
      setValue,
    } = this.props;
    const cards = attributes.reduce((acc, current) => {
      if (current.cardinality < 15 && current.cardinality !== null) {
        acc.push(current.name);
      }
      return acc;
    }, []);
    if (cards.includes(val)) {
      fetchValues(val);
    }
    const selectedFilter: any = filters[index];
    selectedFilter.name = val;
    setValue(null);
    changeFilter(selectedEntity, selectedFilter, index);
  };

  onFilterOperatorChange = (val, index) => {
    const { filters, selectedEntity, changeFilter } = this.props;
    const selectedFilter: any = filters[index];
    selectedFilter.operator = val;
    changeFilter(selectedEntity, selectedFilter, index);
  };

  onFilterAttributeChange = (val, index) => {
    const { filters, selectedEntity, changeFilter } = this.props;
    const selectedFilter: any = filters[index];
    selectedFilter.attribute = val;
    changeFilter(selectedEntity, selectedFilter, index);
  };

  onValueChange = val => {
    const { setValue } = this.props;
    setValue(val);
  };

  generateValues = items => {
    let newItems = [];
    items.map((item, index) => {
      if (item !== null) {
        const items = item.replace(/(^|_)./g, s =>
          s
            .split('_')
            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ')
        );
        newItems.push(items);
      } else if (item === null) {
        newItems.push('Null');
      }
    });
    return newItems;
  };

  generateFilter = filter => {
    const { values, attributes, value, selectedEntity } = this.props;
    const menuValues =
      (selectedEntity === 'operations' && filter.name === 'kind') ||
      (selectedEntity === 'operations' && filter.name === 'status') ||
      (selectedEntity === 'operations' && filter.name === 'spendable') ||
      (selectedEntity === 'operations' && filter.name === 'delegatable') ||
      (selectedEntity === 'accounts' && filter.name === 'spendable') ||
      (selectedEntity === 'accounts' && filter.name === 'delegate_setable')
        ? this.generateValues(values)
        : values;
    const cards = attributes.reduce((acc, current) => {
      if (current.cardinality < 15 && current.cardinality !== null) {
        acc.push(current.name);
      }
      return acc;
    }, []);
    if (!filter.operator) {
      return;
    } else if (filter.operator === 'ISNULL') {
      return;
    } else if (filter.operator === 'BETWEEN' || filter.operator === 'IN') {
      return (
        <React.Fragment>
          <HR />
          <FilterInput
            InputProps={{ disableUnderline: true }}
            placeholder={`e.g. 123456`}
          />
          <HR />
          <AndBlock>and</AndBlock>
          <HR />
          <FilterInput
            InputProps={{ disableUnderline: true }}
            placeholder={`e.g. 123456`}
          />
        </React.Fragment>
      );
    } else if (
      filter.operator !== 'ISNULL' &&
      filter.operator !== 'BETWEEN' &&
      filter.operator !== 'IN' &&
      cards.includes(filter.name)
    ) {
      return (
        <React.Fragment>
          <HR />
          <ValueSelect
            value={value}
            placeholder={`Select Value`}
            items={menuValues}
            onChange={value => this.onValueChange(value)}
          />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <HR />
          <FilterInput
            placeholder={`Placeholder Here`}
            InputProps={{ disableUnderline: true }}
          />
        </React.Fragment>
      );
    }
  };

  render() {
    const {
      selectedEntity,
      attributes,
      filters,
      operators,
      value,
    } = this.props;
    const entityName = attrTabValue[selectedEntity];
    return (
      <Container>
        {filters.map((filter: any, index) => {
          let newAttributes = [];
          attributes.forEach((attr: any) => {
            if (attr.name === filter.name) {
              newAttributes.push(attr);
            }
            const index = filters.findIndex(
              (item: any) => item.name === attr.name
            );
            if (index < 0) {
              newAttributes.push(attr);
            }
          });
          return (
            <FilterItemContainer key={index}>
              <FilterItemGr>
                <FilterSelect
                  value={filter.name}
                  placeholder={`Select ${entityName} Attribute`}
                  items={newAttributes}
                  onChange={val => this.onFilterNameChange(val, index)}
                />
                {filter.name && <HR />}
                {filter.name && (
                  <FilterSelect
                    value={filter.operator}
                    placeholder={`Select Operator`}
                    items={operators}
                    onChange={event =>
                      this.onFilterOperatorChange(event, index)
                    }
                  />
                )}
                {this.generateFilter(filter)}
              </FilterItemGr>
              <IconButton
                aria-label="Delete"
                onClick={() => this.onRemoveFilter(index)}
              >
                <DeleteIconWrapper />
              </IconButton>
            </FilterItemContainer>
          );
        })}

        <AddFilterFooter isFilters={filters.length > 0}>
          <AddFilterButton onClick={this.onAddFilter}>
            <PlusIconWrapper />
            Add Filter
          </AddFilterButton>
          {filters.length == 0 && (
            <FilterExpTxt>
              You can filter by all {entityName} attributes and more.
            </FilterExpTxt>
          )}
        </AddFilterFooter>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  selectedEntity: getEntity(state),
  attributes: getAttributes(state),
  filters: getSelectedFilters(state),
  values: getValues(state),
  value: getValue(state),
  operators: getOperators(state),
});

const mapDispatchToProps = dispatch => ({
  fetchValues: (value: string) => dispatch(fetchValues(value)),
  setValue: (value: string) => dispatch(setValueAction(value)),
  addFilter: (entity: string) => dispatch(addFilterAction(entity)),
  removeFilter: (entity: string, index: number) =>
    dispatch(removeFilterAction(entity, index)),
  changeFilter: (entity: string, filter: object, index: number) =>
    dispatch(changeFilterAction(entity, filter, index)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterPanel);
