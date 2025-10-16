import { useState } from 'react';

export function SettingsSection() {
  const [settings, setSettings] = useState<{ theme:'dark'|'light'; language:'vi'|'en'; notifications:boolean; privacy:'public'|'friends'|'private'; }>(
    { theme:'dark', language:'vi', notifications:true, privacy:'friends' }
  );
  return (
    <section className="panel">
      <form className="settingsForm" onSubmit={(e)=>{ e.preventDefault(); alert('Settings saved'); }}>
        <div className="field">
          <label className="label" htmlFor="themeSelect">Theme</label>
          <select id="themeSelect" className="input" value={settings.theme} onChange={e=>setSettings(s=>({...s, theme:e.target.value as 'dark'|'light'}))}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        <div className="field">
          <label className="label" htmlFor="langSelect">Language</label>
          <select id="langSelect" className="input" value={settings.language} onChange={e=>setSettings(s=>({...s, language:e.target.value as 'vi'|'en'}))}>
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="field">
          <label className="label">Notifications</label>
          <div>
            <label>
              <input type="checkbox" checked={settings.notifications} onChange={e=>setSettings(s=>({...s, notifications:e.target.checked}))} /> Enable notifications
            </label>
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="privacySelect">Privacy</label>
          <select id="privacySelect" className="input" value={settings.privacy} onChange={e=>setSettings(s=>({...s, privacy:e.target.value as 'public'|'friends'|'private'}))}>
            <option value="public">Public</option>
            <option value="friends">Friends</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div className="fullRow"><button className="btn primary" type="submit">Save</button></div>
      </form>
    </section>
  );
}
