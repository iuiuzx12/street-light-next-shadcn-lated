import React from 'react';

// Base interface for common props
interface BaseProps {
  children: React.ReactNode;
  className?: string;
}

// Dialog Props
interface DialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// DialogTrigger Props
interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

// DialogContent Props
type DialogContentProps = BaseProps;

// DialogHeader Props
type DialogHeaderProps = BaseProps;

// DialogTitle Props
interface DialogTitleProps extends BaseProps {
  icon?: React.ReactNode;
}

// DialogDescription Props
type DialogDescriptionProps = BaseProps;

// DialogFooter Props
type DialogFooterProps = BaseProps;

// Main Dialog Container
const Dialog: React.FC<DialogProps> = ({ children, open, onOpenChange }) => {
  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);

  if (!open) return null;
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleBackdropClick}
      />
      <div className="relative z-50 animate-in fade-in duration-200">
        {children}
      </div>
    </div>
  );
};

// Dialog Trigger (wrapper for the trigger element)
const DialogTrigger: React.FC<DialogTriggerProps> = ({ children, asChild = false }) => {
  return asChild ? <>{children}</> : <div>{children}</div>;
};

// Dialog Content Container
const DialogContent: React.FC<DialogContentProps> = ({ children, className = "" }) => (
  <div 
    className={`bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md mx-4 animate-in zoom-in-95 duration-200 ${className}`}
    role="dialog"
    aria-modal="true"
  >
    {children}
  </div>
);

// Dialog Header Section
const DialogHeader: React.FC<DialogHeaderProps> = ({ children, className = "" }) => (
  <div className={`px-6 pt-6 pb-2 ${className}`}>
    {children}
  </div>
);

// Dialog Title
const DialogTitle: React.FC<DialogTitleProps> = ({ children, className = "", icon }) => (
  <h2 className={`text-xl font-semibold text-gray-900 flex items-center gap-2 ${className}`}>
    {icon && (
      <div className="p-2 bg-blue-100 rounded-lg">
        {icon}
      </div>
    )}
    {children}
  </h2>
);

// Dialog Description
const DialogDescription: React.FC<DialogDescriptionProps> = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-600 mt-2 leading-relaxed ${className}`}>
    {children}
  </p>
);

// Dialog Footer Section
const DialogFooter: React.FC<DialogFooterProps> = ({ children, className = "" }) => (
  <div className={`px-6 pb-6 pt-2 ${className}`}>
    {children}
  </div>
);

// Export all components and types
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
};

export type {
  DialogProps,
  DialogTriggerProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogFooterProps
};