export default function Card({ children, className = '', title, ...props }) {
  return (
    <div className={`bg-background border border-border rounded-lg shadow-sm p-6 ${className}`} {...props}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      )}
      {children}
    </div>
  );
}

