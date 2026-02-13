export function SettingsTab() {
  return (
    <section className="settings-tab" aria-labelledby="settings-heading">
      <h2 id="settings-heading" className="glass-title">Settings</h2>
      <div className="setting-row glass-list-row" role="listitem">
        <span className="setting-label glass-muted">Theme</span>
        <span className="setting-value glass-body">Glass (frosted)</span>
      </div>
      <div className="setting-row glass-list-row" role="listitem">
        <span className="setting-label glass-muted">Workspace</span>
        <span className="setting-value glass-body">Stored on server (local backend)</span>
      </div>
    </section>
  );
}
