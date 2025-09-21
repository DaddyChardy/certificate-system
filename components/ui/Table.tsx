
import React from 'react';

export const Table: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className="w-full overflow-hidden rounded-lg border border-gray-200">
    <table className={`min-w-full divide-y divide-gray-200 ${className}`}>{children}</table>
  </div>
);

export const TableHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <thead className={`bg-gray-50 ${className}`}>{children}</thead>
);

export const TableBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>{children}</tbody>
);

export const TableRow: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <tr className={className}>{children}</tr>
);

export const TableHead: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

export const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-800 ${className}`}>{children}</td>
);
