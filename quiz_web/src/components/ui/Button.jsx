export default function Button({ 
  children, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props 
}) {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark',
    danger: 'bg-danger text-white hover:bg-danger-dark',
    ghost: 'bg-transparent text-primary hover:bg-background-muted',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}

