import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { renderableElement } from '../../helpers/customPropTypes';

const propTypes = {
  /** Html element or react component to render */
  as: renderableElement,
  /** Text Size */
  size: PropTypes.oneOf(['medium', 'small', 'tiny']),
  /** Link text */
  children: PropTypes.node,
  /** Optional additional classname. */
  className: PropTypes.string,
  /** Optional inline style. Additionally, other event handlers and and props are propagated to the inner element for use as needed */
  style: PropTypes.shape({}),
  /** Optional disabled prop */
  disabled: PropTypes.bool,
};

const defaultProps = {
  as: 'a',
  size: 'medium',
  className: '',
  children: null,
  style: {},
  disabled: false,
};

const Link = ({ as, size, className, children, disabled, ...rest }) => {
  const Element = as;

  return (
    <Element
      className={classNames(
        'rc-link',
        {
          [`rc-link-size-${size}`]: size,
        },
        className,
      )}
      disabled={disabled}
      aria-disabled={disabled}
      {...rest}
    >
      {children}
    </Element>
  );
};

Link.propTypes = propTypes;
Link.defaultProps = defaultProps;

export default Link;