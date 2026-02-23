const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const HEADERS = ['PO#', 'Quote#', 'Date', 'Placed by', 'For', 'Total Cost', 'Vendor', 'Description'];

function formatDateForSheet(val) {
  if (!val) return '';
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);
  return d.toISOString().split('T')[0];
}

async function exportToSpreadsheet(data, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const row = [
    data.poNumber || '',
    data.quoteNumber || '',
    formatDateForSheet(data.date),
    data.placedBy || '',
    data.for || '',
    data.totalCost != null ? Number(data.totalCost) : '',
    data.vendor || '',
    (data.description || '').replace(/\r?\n/g, ' '),
  ];

  if (ext === '.csv') {
    const header = HEADERS.join(',');
    const escape = (v) => {
      const s = String(v == null ? '' : v);
      if (/[,"\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    let content = header + '\n';
    content += row.map(escape).join(',') + '\n';
    const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
    if (existing.trim()) {
      content = existing.trimEnd() + '\n' + row.map(escape).join(',') + '\n';
    }
    fs.writeFileSync(filePath, content, 'utf8');
    return;
  }

  let wb;
  let sheet;
  if (fs.existsSync(filePath)) {
    wb = XLSX.readFile(filePath);
    sheet = wb.Sheets[wb.SheetNames[0]] || null;
  }
  if (!sheet) {
    wb = XLSX.utils.book_new();
    sheet = XLSX.utils.aoa_to_sheet([HEADERS]);
    XLSX.utils.book_append_sheet(wb, sheet, 'PO Log');
  }
  const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
  const newRow = range.e.r + 1;
  row.forEach((val, c) => {
    const cellRef = XLSX.utils.encode_cell({ r: newRow, c });
    sheet[cellRef] = { t: typeof val === 'number' ? 'n' : 's', v: val };
  });
  sheet['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: newRow, c: HEADERS.length - 1 },
  });
  XLSX.writeFile(wb, filePath);
}

module.exports = { exportToSpreadsheet };
