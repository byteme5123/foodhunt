import React from 'react';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, children, hint, error }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-1 text-sm text-gray-500">{hint}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({ error, className = '', ...props }) => {
  return (
    <input
      {...props}
      className={`form-input mt-1 block w-full rounded-md shadow-sm 
        ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'}
        ${className}`}
    />
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({ error, className = '', ...props }) => {
  return (
    <textarea
      {...props}
      className={`form-textarea mt-1 block w-full rounded-md shadow-sm 
        ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'}
        ${className}`}
    />
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select: React.FC<SelectProps> = ({ error, className = '', children, ...props }) => {
  return (
    <select
      {...props}
      className={`form-select mt-1 block w-full rounded-md shadow-sm 
        ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'}
        ${className}`}
    >
      {children}
    </select>
  );
};

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        {...props}
        className={`form-checkbox h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded ${className}`}
      />
      <label htmlFor={props.id} className="ml-2 block text-sm text-gray-900">
        {label}
      </label>
    </div>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg flex items-center gap-2 ${className}`}
    >
      {children}
    </button>
  );
};