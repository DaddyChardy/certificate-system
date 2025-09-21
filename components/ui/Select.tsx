
import React from 'react';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  children: React.ReactNode;
};

export const Select: React.FC<SelectProps> = ({ label, name, children, ...props }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <select
          name={name}
          id={name}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          {...props}
        >
          {children}
        </select>
      </div>
    </div>
  );
};
