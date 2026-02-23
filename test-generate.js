#!/usr/bin/env node
/**
 * Terminal test: prefilled data → PDF + spreadsheet. No Electron, no UI.
 * Run: node test-generate.js
 */
const path = require('path');
const fs = require('fs');
const { createPdf } = require('./pdf-generator');
const { exportToSpreadsheet } = require('./spreadsheet-export');

const testData = {
  poNumber: 'PO-2026-001',
  quoteNumber: 'QT-456',
  date: '2026-02-23',
  placedBy: 'Nikhil Karnik',
  for: 'Ops',
  vendor: 'Sunny Health',
  totalCost: 2234.43,
  description: 'Test line items for terminal run',
};

const outDir = path.join(__dirname, 'test-output');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const pdfPath = path.join(outDir, 'PO_test.pdf');
const sheetPath = path.join(outDir, 'PO_Log_Test.xlsx');

async function run() {
  console.log('Generating PDF and spreadsheet with prefilled data...');
  const pdfBytes = await createPdf(testData);
  fs.writeFileSync(pdfPath, pdfBytes);
  console.log('PDF written:', pdfPath);

  await exportToSpreadsheet(testData, sheetPath);
  console.log('Spreadsheet written:', sheetPath);

  console.log('Done. Check test-output/');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
