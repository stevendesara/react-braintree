import React from 'react'

const InputGroup = ({
  field,
  onChange,
  addtClassName = '',
  isEditable,
  isEdit,
  ...props
}) => {
  let hasErrors = field.errors.length > 0 ? true : false
  return (
    <div
      className={
        (hasErrors ? 'form-group text-danger' : 'form-group') +
        ' ' +
        addtClassName
      }>
      <div className="input-group">
        {isEdit && !isEditable ? (
          <div className="not-editable-input">{field.value}</div>
        ) : (
          <input
            placeholder={field.placeholder || ''}
            type={field.type}
            className={hasErrors ? 'form-control is-invalid' : 'form-control'}
            name={field.name}
            value={field.value}
            onChange={onChange}
            {...props}
            //   onBlur={e => validateInput(e, field)}
          />
        )}
      </div>
      {field.errors.map((error, i) => (
        <div key={i} className="form-text text-danger">
          {error}
        </div>
      ))}
    </div>
  )
}

export default InputGroup
