const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { createPdf } = require('./pdf-generator');
const { exportToSpreadsheet } = require('./spreadsheet-export');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 720,
    height: 820,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'Spiro Medical PO Generator',
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
  mainWindow.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Generate PDF and return path; renderer will have triggered save dialog via preload
ipcMain.handle('generate-pdf', async (_, data) => {
  try {
    const pdfBytes = await createPdf(data);
    const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save PO as PDF',
      defaultPath: `PO_${(data.poNumber || 'PO').replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf`,
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    });
    if (canceled || !filePath) return { ok: false, message: 'Save canceled' };
    fs.writeFileSync(filePath, pdfBytes);
    return { ok: true, path: filePath };
  } catch (err) {
    return { ok: false, message: err.message };
  }
});

// Export row to spreadsheet (append to existing or create new)
ipcMain.handle('export-to-spreadsheet', async (_, data) => {
  try {
    const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save / update PO log (spreadsheet)',
      defaultPath: path.join(app.getPath('documents'), 'Spiro_Medical_PO_Log.xlsx'),
      filters: [
        { name: 'Excel', extensions: ['xlsx'] },
        { name: 'CSV', extensions: ['csv'] },
      ],
    });
    if (canceled || !filePath) return { ok: false, message: 'Save canceled' };
    await exportToSpreadsheet(data, filePath);
    return { ok: true, path: filePath };
  } catch (err) {
    return { ok: false, message: err.message };
  }
});
