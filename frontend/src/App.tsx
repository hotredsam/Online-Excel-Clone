import { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Ribbon } from './components/Ribbon';
import { SheetTab } from './components/SheetTab';
import { getDefaultSheetData } from './utils/sheetDefaults';
import { ProjectsTab } from './components/ProjectsTab';
import { SettingsTab } from './components/SettingsTab';
import { uploadFile, saveProject, exportSheet, getProject } from './api/client';
import { addRecentProjectId } from './utils/recentProjects';
import type { CellValue } from './utils/gridData';
import './App.css';

type TabId = 'sheets' | 'projects' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('sheets');
  const [sheetData, setSheetData] = useState<CellValue[][]>(getDefaultSheetData());
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [exportError, setExportError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<'xlsx' | 'csv' | null>(null);

  const handleFileSelect = async (file: File) => {
    setUploadError(null);
    setExportError(null);
    setUploading(true);
    try {
      const { project, sheet } = await uploadFile(file);
      setSheetData(sheet.data);
      setProjectId(project.id);
      setProjectName(project.name);
      addRecentProjectId(project.id);
      setActiveTab('sheets');
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!projectId) return;
    setSaveStatus('saving');
    setUploadError(null);
    try {
      await saveProject(projectId, {
        sheets: [{ name: 'Sheet1', data: sheetData }],
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Save failed');
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleExport = async (format: 'xlsx' | 'csv') => {
    setExportError(null);
    setUploadError(null);
    setExporting(format);
    try {
      const blob = await exportSheet(format, {
        name: projectName || 'Sheet1',
        data: sheetData,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName || 'export'}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(null);
    }
  };

  const handleOpenProject = async (id: string) => {
    try {
      const project = await getProject(id);
      setSheetData(project.sheets[0]?.data ?? []);
      setProjectId(project.id);
      setProjectName(project.name);
      addRecentProjectId(id);
      setActiveTab('sheets');
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to open project');
    }
  };

  const handleProjectDeleted = (id: string) => {
    if (projectId === id) {
      setProjectId(null);
      setProjectName(null);
      setSheetData(getDefaultSheetData());
    }
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <nav className="tab-bar" role="tablist" aria-label="Main navigation">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'sheets'}
            aria-controls="panel-sheets"
            id="tab-sheets"
            className={`glass-btn glass-btn-ghost ${activeTab === 'sheets' ? 'active' : ''}`}
            onClick={() => setActiveTab('sheets')}
          >
            Sheets
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'projects'}
            aria-controls="panel-projects"
            id="tab-projects"
            className={`glass-btn glass-btn-ghost ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'settings'}
            aria-controls="panel-settings"
            id="tab-settings"
            className={`glass-btn glass-btn-ghost ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>
        <main className="main" role="main">
          {activeTab === 'sheets' && (
            <div id="panel-sheets" role="tabpanel" aria-labelledby="tab-sheets" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <Ribbon
                onFileSelect={handleFileSelect}
                onSave={handleSave}
                onExportXlsx={() => handleExport('xlsx')}
                onExportCsv={() => handleExport('csv')}
                projectName={projectName}
                uploadError={uploadError}
                exportError={exportError}
                saveStatus={saveStatus}
                disabled={{
                  upload: uploading,
                  save: !projectId || saveStatus === 'saving',
                  export: !!exporting,
                }}
              />
              <SheetTab data={sheetData} onChange={setSheetData} />
            </div>
          )}
          {activeTab === 'projects' && (
            <div id="panel-projects" role="tabpanel" aria-labelledby="tab-projects" style={{ flex: 1, minHeight: 0 }}>
              <ProjectsTab
              onOpenProject={handleOpenProject}
              onProjectDeleted={handleProjectDeleted}
            />
            </div>
          )}
          {activeTab === 'settings' && (
            <div id="panel-settings" role="tabpanel" aria-labelledby="tab-settings" style={{ flex: 1, minHeight: 0 }}>
              <SettingsTab />
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
