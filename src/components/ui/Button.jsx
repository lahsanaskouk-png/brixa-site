export const Button = ({ children, variant = 'primary', onClick, disabled, className = "", wFull }) => {
  const styles = {
    primary: "bg-primary text-black hover:bg-primaryHover font-bold",
    outline: "border border-border text-text hover:bg-border",
    success: "bg-success/10 text-success border border-success hover:bg-success/20",
    danger: "bg-danger/10 text-danger border border-danger hover:bg-danger/20",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2
        ${styles[variant]} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
        ${wFull ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
};
