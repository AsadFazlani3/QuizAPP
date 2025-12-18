export default function Textarea({ 
  label, 
  helper, 
  error, 
  id,
  className = '',
  ...props 
}) {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
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

