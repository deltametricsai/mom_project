const form = document.getElementById('po-form');
const btnGenerate = document.getElementById('btn-generate');
const messageEl = document.getElementById('message');

function setDefaultDate() {
  const dateInput = document.getElementById('date');
  if (!dateInput.value) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }
}
setDefaultDate();

function showMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.className = 'message visible ' + (isError ? 'error' : 'success');
  messageEl.setAttribute('aria-live', 'polite');
}

function hideMessage() {
  messageEl.className = 'message';
  messageEl.textContent = '';
}

function getFormData() {
  return {
    poNumber: document.getElementById('poNumber').value.trim(),
    quoteNumber: document.getElementById('quoteNumber').value.trim(),
    date: document.getElementById('date').value,
    placedBy: document.getElementById('placedBy').value.trim(),
    for: document.getElementById('for').value.trim(),
    vendor: document.getElementById('vendor').value.trim(),
    totalCost: document.getElementById('totalCost').value ? parseFloat(document.getElementById('totalCost').value) : null,
    description: document.getElementById('description').value.trim(),
  };
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideMessage();
  const data = getFormData();

  btnGenerate.disabled = true;
  try {
    const pdfResult = await window.poApp.generatePdf(data);
    if (!pdfResult.ok) {
      if (pdfResult.message !== 'Save canceled') showMessage(pdfResult.message, true);
      btnGenerate.disabled = false;
      return;
    }

    const sheetResult = await window.poApp.exportToSpreadsheet(data);
    if (!sheetResult.ok) {
      if (sheetResult.message !== 'Save canceled') showMessage('PDF saved. Spreadsheet: ' + sheetResult.message, true);
      else showMessage('PO saved as PDF: ' + pdfResult.path, false);
      btnGenerate.disabled = false;
      return;
    }

    showMessage('PO generated. PDF: ' + pdfResult.path + ' — Log updated: ' + sheetResult.path, false);
  } catch (err) {
    showMessage('Error: ' + (err.message || String(err)), true);
  } finally {
    btnGenerate.disabled = false;
  }
});
