import { forwardRef } from 'react'

const Input = forwardRef(function Input({ label, error, className = '', ...props }, ref) {
  return (
    <div className="mb-4">
      {label && <label className="form-label">{label}</label>}
      <input ref={ref} className={`form-input ${error ? 'border-red-500' : ''} ${className}`} {...props} />
      {error && <p className="form-error">{error}</p>}
    </div>
  )
})

export default Input
