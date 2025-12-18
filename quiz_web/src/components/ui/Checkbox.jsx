export default function Checkbox({ 
  label, 
  helper, 
  error, 
  id,
  className = '',
  ...props 
}) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={checkboxId}
          className={`w-4 h-4 text-primary border-border rounded focus:ring-primary ${
            error ? 'border-danger' : ''
          }`}
          {...props}
        />
        {label && (
          <label htmlFor={checkboxId} className="ml-2 text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
      </div>
      {helper && !error && (
        <p className="mt-1 text-sm text-muted">{helper}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
}

