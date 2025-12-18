export default function Input({ 
  label, 
  helper, 
  error, 
  id,
  className = '',
  ...props 
}) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? 'border-danger' : 'border-border'
        }`}
        {...props}
      />
      {helper && !error && (
        <p className="mt-1 text-sm text-muted">{helper}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
}

