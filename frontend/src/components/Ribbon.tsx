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
  onCopy?: () => void;
  onCut?: () => void;
  onPaste?: () => void;
  onInsertRow?: () => void;
  onInsertCol?: () => void;
  onDeleteRow?: () => void;
  onDeleteCol?: () => void;
  onClear?: () => void;
  onSortAZ?: () => void;
  onSortZA?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

function RibbonButton({
  onClick,
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
      disabled={disabled || !onClick}
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
  onCopy,
  onCut,
  onPaste,
  onInsertRow,
  onInsertCol,
  onDeleteRow,
  onDeleteCol,
  onClear,
  onSortAZ,
  onSortZA,
  onUndo,
  onRedo,
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
            <RibbonButton title="Export XLSX" onClick={onExportXlsx} disabled={disabled.export}>XLSX</RibbonButton>
            <RibbonButton title="Export CSV" onClick={onExportCsv} disabled={disabled.export}>CSV</RibbonButton>
          </div>
        </div>
        <div className="ribbon-group">
          <span className="ribbon-group-label">Edit</span>
          <div className="ribbon-group-buttons">
            <RibbonButton title="Undo" onClick={onUndo}>↩</RibbonButton>
            <RibbonButton title="Redo" onClick={onRedo}>↪</RibbonButton>
          </div>
        </div>
        <div className="ribbon-group">
          <span className="ribbon-group-label">Clipboard</span>
          <div className="ribbon-group-buttons">
            <RibbonButton title="Copy" onClick={onCopy}>Copy</RibbonButton>
            <RibbonButton title="Cut" onClick={onCut}>Cut</RibbonButton>
            <RibbonButton title="Paste" onClick={onPaste}>Paste</RibbonButton>
          </div>
        </div>
        <div className="ribbon-group">
          <span className="ribbon-group-label">Cells</span>
          <div className="ribbon-group-buttons">
            <RibbonButton title="Insert row" onClick={onInsertRow}>+Row</RibbonButton>
            <RibbonButton title="Insert column" onClick={onInsertCol}>+Col</RibbonButton>
            <RibbonButton title="Delete row" onClick={onDeleteRow}>−Row</RibbonButton>
            <RibbonButton title="Delete column" onClick={onDeleteCol}>−Col</RibbonButton>
          </div>
        </div>
        <div className="ribbon-group">
          <span className="ribbon-group-label">Editing</span>
          <div className="ribbon-group-buttons">
            <RibbonButton title="Clear" onClick={onClear}>Clear</RibbonButton>
            <RibbonButton title="Sort A–Z" onClick={onSortAZ}>A↑</RibbonButton>
            <RibbonButton title="Sort Z–A" onClick={onSortZA}>A↓</RibbonButton>
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
