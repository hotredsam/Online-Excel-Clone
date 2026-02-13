import { useRef } from 'react';

interface RibbonProps {
  onFileSelect: (file: File) => void;
  onSave: () => void;
  onExportXlsx: () => void;
  onExportCsv: () => void;
  projectName: string | null;
  uploadError: string | null;
  exportError: string | null;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  disabled: { upload: boolean; save: boolean; export: boolean };
}

const stub = () => {}; // no-op for placeholder tools

function RibbonButton({
  onClick = stub,
  title,
  children,
  disabled,
  className = '',
}: {
  onClick?: () => void;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`glass-btn glass-btn-ghost ribbon-btn ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );
}

export function Ribbon({
  onFileSelect,
  onSave,
  onExportXlsx,
  onExportCsv,
  projectName,
  uploadError,
  exportError,
  saveStatus,
  disabled,
}: RibbonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="ribbon" role="banner" aria-label="Ribbon">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (file) onFileSelect(file);
        }}
        style={{ display: 'none' }}
        aria-hidden
      />
      <div className="ribbon-tabs" role="tablist" aria-label="Ribbon tabs">
        <button type="button" className="ribbon-tab active" role="tab" aria-selected>
          Home
        </button>
      </div>
      <div className="ribbon-content" role="tabpanel" aria-label="Home ribbon content">
        <div className="ribbon-group" role="group" aria-label="File">
          <span className="ribbon-group-label" id="ribbon-file-label">File</span>
          <div className="ribbon-group-buttons">
            <RibbonButton title="Open" onClick={() => fileInputRef.current?.click()} disabled={disabled.upload}>Open</RibbonButton>
            <RibbonButton title="Save" onClick={onSave} disabled={disabled.save}>
              {saveStatus === 'saving' ? '…' : saveStatus === 'saved' ? '✓' : saveStatus === 'error' ? '!' : 'Save'}
            </RibbonButton>
            <RibbonButton title="Save As (coming soon)">Save As</RibbonButton>
            <RibbonButton title="Export XLSX" onClick={onExportXlsx} disabled={disabled.export}>XLSX</RibbonButton>
            <RibbonButton title="Export CSV" onClick={onExportCsv} disabled={disabled.export}>CSV</RibbonButton>
            <RibbonButton title="Close (coming soon)">Close</RibbonButton>
          </div>
        </div>
        <div className="ribbon-group">
          <span className="ribbon-group-label">Clipboard</span>
          <div className="ribbon-group-buttons">
            <RibbonButton title="Paste">Paste</RibbonButton>
            <RibbonButton title="Cut">Cut</RibbonButton>
            <RibbonButton title="Copy">Copy</RibbonButton>
            <RibbonButton title="Format painter">Format</RibbonButton>
          </div>
        </div>
        <div className="ribbon-group">
          <span className="ribbon-group-label">Font</span>
          <div className="ribbon-group-buttons">
            <RibbonButton title="Bold">B</RibbonButton>
            <RibbonButton title="Italic">I</RibbonButton>
            <RibbonButton title="Underline">U</RibbonButton>
            <RibbonButton title="Strikethrough">S</RibbonButton>
            <RibbonButton title="Font size">12</RibbonButton>
            <RibbonButton title="Font color">A</RibbonButton>
            <RibbonButton title="Fill color">▤</RibbonButton>
          </div>
        </div>
        <div className="ribbon-group">
          <span className="ribbon-group-label">Alignment</span>
          <div className="ribbon-group-buttons">
            <RibbonButton title="Align left">≡</RibbonButton>
            <RibbonButton title="Center">≡</RibbonButton>
            <RibbonButton title="Align right">≡</RibbonButton>
            <RibbonButton title="Top">▴</RibbonButton>
            <RibbonButton title="Middle">▴</RibbonButton>
            <RibbonButton title="Bottom">▴</RibbonButton>
            <RibbonButton title="Wrap text">↵</RibbonButton>
          </div>
        </div>
        <div className="ribbon-group">
          <span className="ribbon-group-label">Number</span>
          <div className="ribbon-group-buttons">
            <RibbonButton title="General">123</RibbonButton>
            <RibbonButton title="Number">#</RibbonButton>
            <RibbonButton title="Currency">$</RibbonButton>
            <RibbonButton title="Percent">%</RibbonButton>
            <RibbonButton title="Date">Date</RibbonButton>
          </div>
        </div>
        <div className="ribbon-group">
          <span className="ribbon-group-label">Cells</span>
          <div className="ribbon-group-buttons">
            <RibbonButton title="Insert row">+Row</RibbonButton>
            <RibbonButton title="Insert column">+Col</RibbonButton>
            <RibbonButton title="Delete row">−Row</RibbonButton>
            <RibbonButton title="Delete column">−Col</RibbonButton>
            <RibbonButton title="Format cells">Fmt</RibbonButton>
          </div>
        </div>
        <div className="ribbon-group">
          <span className="ribbon-group-label">Editing</span>
          <div className="ribbon-group-buttons">
            <RibbonButton title="Fill down">↓</RibbonButton>
            <RibbonButton title="Clear">Clear</RibbonButton>
            <RibbonButton title="Sort A–Z">A↑</RibbonButton>
            <RibbonButton title="Sort Z–A">A↓</RibbonButton>
            <RibbonButton title="Filter">Filter</RibbonButton>
          </div>
        </div>
        <div className="ribbon-group">
          <span className="ribbon-group-label">Data</span>
          <div className="ribbon-group-buttons">
            <RibbonButton title="Sort">Sort</RibbonButton>
            <RibbonButton title="Filter">Filter</RibbonButton>
            <RibbonButton title="Validation">Valid</RibbonButton>
          </div>
        </div>
        <div className="ribbon-group">
          <span className="ribbon-group-label">View</span>
          <div className="ribbon-group-buttons">
            <RibbonButton title="Zoom in">+</RibbonButton>
            <RibbonButton title="Zoom out">−</RibbonButton>
            <RibbonButton title="Gridlines">⊞</RibbonButton>
          </div>
        </div>
        {projectName && (
          <div className="ribbon-group ribbon-project">
            <span className="ribbon-group-label">Project</span>
            <span className="ribbon-project-name" title={projectName}>{projectName}</span>
          </div>
        )}
        {(uploadError || exportError) && (
          <div className="ribbon-errors">
            {uploadError && <span className="ribbon-error" title={uploadError}>{uploadError}</span>}
            {exportError && <span className="ribbon-error" title={exportError}>{exportError}</span>}
          </div>
        )}
      </div>
    </header>
  );
}
