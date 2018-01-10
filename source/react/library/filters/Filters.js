import React from 'react';
import clone from 'clone';

import Filter from './FilterItem';
import FilterForm from './FilterForm';

import Button from '../Button';
import List from '../list/List';

const propTypes = {
  fields: React.PropTypes.array,
  filters: React.PropTypes.array,
  onChange: React.PropTypes.func,
  removableToggle: React.PropTypes.bool,
};

const defaultProps = {
  fields: [],
  filters: [],
  onChange: () => {},
  removableToggle: false,
};

const getFilterKey = filter =>
  [filter.field, filter.op, filter.value, filter.values, filter.removable].join('');

/**
 * `Filters` allows users to list, edit, and add filters.
 */
class Filters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      adding: false,
      editing: null,
      filter: {},
    };

    this.onAdd = this.onAdd.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onSubmitFilter = this.onSubmitFilter.bind(this);
  }

  onAdd(e) {
    if (e) {
      e.preventDefault();
    }

    this.setState({ adding: true });
  }

  onCancel() {
    this.setState({
      editing: null,
      adding: false,
      filter: {},
    });
  }

  onSubmitFilter(filter) {
    let newFilters = [];

    if (this.state.editing) {
      const index = this.props.filters
        .findIndex(f => getFilterKey(f) === this.state.editing);

      newFilters = clone(this.props.filters);
      newFilters[index] = filter;
    } else {
      newFilters = this.props.filters
        .concat(filter);
    }

    this.props.onChange(newFilters);
    this.setState({ adding: false, editing: null, filter: {} });
  }

  onEdit(filter) {
    const key = getFilterKey(filter);

    return () => {
      this.setState({
        editing: key,
        filter,
      });
    };
  }

  onRemove(removed) {
    return () => {
      const newFilters = this.props.filters
        .filter(filter => !(getFilterKey(removed) === getFilterKey(filter)));

      this.props.onChange(newFilters);
    };
  }

  renderFilters() {
    const filters = this.props.filters.map((filter) => {
      const key = getFilterKey(filter);

      return (
        <Filter
          onEdit={ this.onEdit(filter) }
          onRemove={ this.onRemove(filter) }
          filter={ filter }
          key={ key }
        />
      );
    });

    return (
      <List className="rc-filters-list">
        { filters }
      </List>
    );
  }

  renderAction() {
    let jsx;

    if (!this.state.editing && !this.state.adding) {
      jsx = (
        <Button
          simple
          icon="plus"
          label="Add filter"
          onClick={ this.onAdd }
        />
      );
    }

    return jsx;
  }

  renderForm() {
    return (
      <FilterForm
        removable={ this.props.removableToggle }
        fields={ this.props.fields }
        filter={ this.state.filter }
        onCancel={ this.onCancel }
        onSubmit={ this.onSubmitFilter }
      />
    );
  }

  render() {
    const action = this.renderAction();
    let filters;
    let form;

    if (this.state.adding || this.state.editing) {
      form = this.renderForm();
    } else {
      filters = this.renderFilters();
    }

    return (
      <div className="rc-filters">
        { filters }
        { action }
        { form }
      </div>
    );
  }
}

Filters.propTypes = propTypes;
Filters.defaultProps = defaultProps;

export default Filters;
