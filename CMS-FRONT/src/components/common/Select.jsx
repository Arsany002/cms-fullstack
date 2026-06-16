import { forwardRef, useId } from 'react'

const Select = forwardRef(function Select({ label, error, id: idProp, children, className = '', ...props }, ref) {
  const generatedId = useId()
  const id = idProp || (label ? generatedId : undefined)
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <select id={id} ref={ref} className={`form-input ${error ? 'border-red-500' : ''} ${className}`} {...props}>
        {children}
      </select>
      {error && <p className="form-error">{error}</p>}
    </div>
  )
})

export default Select
