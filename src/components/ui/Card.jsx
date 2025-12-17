export const Card = ({ children, className = "" }) => (
  <div className={`bg-card border border-border rounded-xl p-5 shadow-lg ${className}`}>
    {children}
  </div>
);
