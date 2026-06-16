import { forwardRef, useId } from 'react'

const Input = forwardRef(function Input({ label, error, id: idProp, className = '', ...props }, ref) {
  const generatedId = useId()
  const id = idProp || (label ? generatedId : undefined)
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <input id={id} ref={ref} className={`form-input ${error ? 'border-red-500' : ''} ${className}`} {...props} />
      {error && <p className="form-error">{error}</p>}
    </div>
  )
})

export default Input
