const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('poApp', {
  generatePdf: (data) => ipcRenderer.invoke('generate-pdf', data),
  exportToSpreadsheet: (data) => ipcRenderer.invoke('export-to-spreadsheet', data),
});
