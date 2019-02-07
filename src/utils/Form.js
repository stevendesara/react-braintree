import React from 'react'
import cx from 'classnames'

const Form = ({
  title,
  description,
  children,
  className,
  autocomplete = 'on'
}) => (
  <div className={cx('sample-form', className)}>
    {title && <h3>{title}</h3>}
    <form onSubmit={e => e.preventDefault()} autoComplete={autocomplete}>
      {description && <div className="description">{description}</div>}
      {children}
    </form>
  </div>
)

export default Form
