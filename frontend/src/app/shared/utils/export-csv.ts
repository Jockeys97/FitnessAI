export function exportCsv(rows: object[], filename: string = 'export.csv'): void {
  if (!rows || rows.length === 0) {
    return;
  }

  const keys = Object.keys(rows[0]);
  const separator = ';';
  
  const csvContent = [
    keys.join(separator),
    ...rows.map(row => 
      keys.map(key => {
        const value = (row as any)[key];
        const stringValue = value !== null && value !== undefined ? String(value) : '';
        return stringValue.includes('"') ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
      }).join(separator)
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}