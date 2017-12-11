import React from 'react';
import onClickOutside from 'react-onclickoutside';
import classnames from 'classnames';

import { TAB_KEY_CODE } from '../../constants';

import Icon from '../Icon';
import Input from '../Input';
import Menu from '../menu/Menu';
import MenuList from '../menu/MenuList';
import Popover from '../Popover';

const propTypes = {
  autoOpen: React.PropTypes.bool,
  onSelect: React.PropTypes.func,
  options: React.PropTypes.array,
  className: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  name: React.PropTypes.string,
  disablePortal: React.PropTypes.bool,
  size: React.PropTypes.oneOf(['tiny', 'small']),
};

const defaultProps = {
  placeholder: 'Select...',
  disablePortal: false,
  onSelect: () => {},
  autoOpen: false,
  size: 'small',
  options: [],
};

const formatOptions = options => options.map((o, idx) => {
  let option = o;

  if (typeof o === 'string') {
    option = { id: o, value: o, label: o };
  } else if (typeof o.id === 'undefined') {
    o.id = idx;
  }

  return option;
});

const shouldComponentUpdate = (currentOptions, newOptions) => {
  let update = false;
  newOptions = formatOptions(newOptions);

  newOptions.forEach((option, i) => {
    if (!update && currentOptions[i].id !== option.id) {
      update = true;
    }
  });

  return update;
};

/**
 * `Select` allows the user to select an item from a list.
 */
class Select extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: undefined,
      open: this.props.autoOpen,
      options: formatOptions(props.options),
    };

    this.onSelect = this.onSelect.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onInputClick = this.onInputClick.bind(this);
  }

  componentDidMount() {
    if (this.props.autoOpen) {
      this.popover.open();
      this.input.focus();
    }
  }

  componentWillReceiveProps(newProps) {
    if (shouldComponentUpdate(newProps.options, this.state.options)) {
      this.setState({ options: formatOptions(newProps.options) });
    }
  }

  onInputClick() {
    this.setState({ open: true });
  }

  onKeyDown(e) {
    switch (e.keyCode) {
      case TAB_KEY_CODE:
        this.setState({ open: false });

        break;
      default:
        break;
    }
  }

  onSelect(option) {
    const options = this.state.options.map((o) => {
      if (o.id === option.id) {
        o.selected = true;
      } else {
        o.selected = false;
      }

      return o;
    });

    this.popover.close();
    this.props.onSelect(option);
    this.setState({
      inputValue: undefined,
      open: false,
      options,
    });
  }

  getCurrentValue() {
    let value = '';

    if (typeof this.state.inputValue !== 'undefined') {
      value = this.state.inputValue;
    } else {
      this.state.options.forEach((option) => {
        if (option.selected) {
          value = option.label;
        }
      });
    }

    return value;
  }

  clearInput() {
    const options = this.state.options.map((o) => {
      o.selected = false;

      return o;
    });

    this.setState({ inputValue: '', options });
  }

  handleClickOutside() {
    this.setState({ open: false });
  }

  renderMenuList() {
    let selected;

    selected = this.state.options.filter(o => o.selected);

    if (selected && selected.length) {
      selected = selected[0].id;
    }

    return (
      <MenuList
        selected={ selected }
        size={ this.props.size }
        options={ this.state.options }
        onChange={ this.onSelect }
      />
    );
  }

  renderMenu() {
    const menuList = this.renderMenuList();

    const jsx = (
      <Menu className="rc-select-menu" size={ this.props.size }>
        { menuList }
      </Menu>
    );

    return jsx;
  }

  renderInput() {
    const input = (
      <Input
        dropdown
        name={ this.props.name }
        onClick={ this.onInputClick }
        onKeyDown={ this.onKeyDown }
        onChange={ e => this.setState({ inputValue: e.target.value }) }
        value={ this.getCurrentValue() }
        size={ this.props.size }
        ref={ (c) => { this.input = c; } }
        focused={ this.state.open }
        onFocus={ () => this.setState({ open: true }) }
        placeholder={ this.props.placeholder }
      />
    );

    return (
      <div className="rc-select-input">
        { input }
        <Icon width="10px" height="10px" type="chevron-down" />
      </div>
    );
  }

  render() {
    const menu = this.renderMenu();
    const input = this.renderInput();
    const className = classnames('rc-select', 'rc-select-popover-wrapper', this.props.className, {
      'rc-select-open': this.state.open,
      [`rc-select-${this.props.size}`]: this.props.size,
    });

    return (
      <Popover
        ref={ (c) => { this.popover = c; } }
        target={ input }
        disablePortal={ this.props.disablePortal }
        trigger="onMouseDown"
        className="rc-select-popover"
        wrapperClassName={ className }
        inheritTargetWidth
        margin={ 4 }
      >
        { menu }
      </Popover>
    );
  }
}

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;

export default onClickOutside(Select);
