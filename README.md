# Spiro Medical PO Generator

Desktop app for **Spiro Medical** to create Purchase Orders (POs) and log them in a spreadsheet. Runs entirely on your computer — no cloud, no data sent online.

## What it does

1. Open the app when you need to create a PO.
2. Fill in the fields (PO#, Quote#, Date, Placed by, For, Vendor, Total Cost, Description).  
   **PO numbers** follow your company protocol — you type them in; the app does not generate them.
3. Click **Generate PO**:
   - A **PDF** of the PO is saved (you choose where).
   - The same data is **appended to a spreadsheet** (Excel `.xlsx` or CSV). You choose the file; if it already exists, the new row is added.

## Fields (spreadsheet columns)

| Column     | Description        |
|-----------|--------------------|
| PO#       | Your PO number     |
| Quote#    | Quote reference    |
| Date      | PO date            |
| Placed by | Who placed the PO  |
| For       | Department/project  |
| Total Cost| Amount             |
| Vendor    | Supplier name      |
| Description | Notes/line items |

You can still change or add fields later; this is a prototype for team feedback.

---

## Run from source (development)

**Requirements:** Node.js 18+ and npm.

```bash
cd mom_project
npm install
npm start
```

---

## Build downloadable apps (Mac and Windows)

### Mac (DMG / app)

On a Mac:

```bash
cd mom_project
npm install
npm run dist:mac
```

Output: `dist/Spiro Medical PO Generator-1.0.0.dmg` (and `.app` in `dist/mac`).  
Share the `.dmg`; users open it and drag the app to Applications.

### Windows (installer / portable)

On a **Windows** machine (or use a Windows VM/CI):

```bash
cd mom_project
npm install
npm run dist:win
```

Output in `dist/`:

- `Spiro Medical PO Generator Setup 1.0.0.exe` — installer
- Or use the portable build if generated

**Note:** Building the Windows app is best done on Windows. To build the Mac app you need a Mac.

### I don’t have a Windows computer — how do I get a Windows build?

You have a few options:

1. **GitHub Actions (recommended)**  
   This repo includes a workflow that builds both Mac and Windows on GitHub’s servers. You only need a Mac (or any machine) to push code.

   - Push `mom_project` (and the `.github/workflows` at the repo root) to a GitHub repo.
   - Open the repo → **Actions** → workflow **"Build PO App"**.
   - Run it via **Run workflow** (or it will run automatically on push to `main` when `mom_project/**` changes).
   - When it finishes, open the run and download the **windows-build** artifact (contains the `.exe` installer). Use **mac-build** for the `.dmg`.

   No Windows machine or VM needed.

2. **Windows VM on your Mac**  
   Use Parallels, VMware Fusion, or VirtualBox with a Windows image, then run `npm run dist:win` inside Windows.

3. **Someone else’s Windows PC**  
   Clone the repo on a Windows machine, run `npm install` and `npm run dist:win`, and share the `.exe` from `dist/`.

---

## Security

- No data is sent to any server.
- PDF and spreadsheet files are saved only where you choose (Save dialog).
- Everything runs locally on the machine where the app is installed.

---

## Tech

- **Electron** — cross‑platform desktop (Mac + Windows).
- **pdf-lib** — PDF generation on your machine.
- **xlsx** — Excel/CSV export on your machine.

If you want to adjust fields or layout to match your Word PO form, we can update the form and PDF template next.
