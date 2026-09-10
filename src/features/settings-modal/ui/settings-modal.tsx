'use client';

import { useSettingsStore } from '@/entities/settings';
import { getInitials } from '@/shared/lib';
import { Check, ExternalLink, Eye, EyeOff, Key, RefreshCw, Sliders, User, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import styles from './settings-modal.module.scss';

function SettingsModalContent() {
  const closeSettings = useSettingsStore((state) => state.closeSettings);
  const storeName = useSettingsStore((state) => state.name);
  const storeRole = useSettingsStore((state) => state.role);
  const storeApiKey = useSettingsStore((state) => state.geminiApiKey);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const resetSettings = useSettingsStore((state) => state.resetSettings);

  const [localName, setLocalName] = useState(storeName);
  const [localRole, setLocalRole] = useState(storeRole);
  const [localApiKey, setLocalApiKey] = useState(storeApiKey);
  const [showApiKey, setShowApiKey] = useState(false);

  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSettings();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeSettings]);

  const currentInitials = getInitials(localName);
  const hasCustomKey = localApiKey.trim().length > 0;

  const handleSave = () => {
    updateSettings({
      name: localName.trim() || 'TEST USER',
      role: localRole.trim() || 'SYNAPSE // SWARM COMMAND',
      geminiApiKey: localApiKey.trim(),
    });
    closeSettings();
  };

  const handleReset = () => {
    resetSettings();
    setLocalName('TEST USER');
    setLocalRole('SYNAPSE // SWARM COMMAND');
    setLocalApiKey('');
    setVerifyStatus(null);
  };

  const handleVerifyConnection = async () => {
    setIsVerifying(true);
    setVerifyStatus(null);

    try {
      const res = await fetch('/api/settings/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: localApiKey.trim() }),
      });

      const data = (await res.json()) as { success?: boolean; message?: string; error?: string };

      if (res.ok && data.success) {
        setVerifyStatus({
          success: true,
          message: data.message || 'Neural connection verified.',
        });
      } else {
        setVerifyStatus({
          success: false,
          message: data.error || 'Connection failed. Please check your key.',
        });
      }
    } catch (err: unknown) {
      setVerifyStatus({
        success: false,
        message: err instanceof Error ? err.message : 'Network error during ping.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={closeSettings} aria-modal="true" role="dialog">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <span className={styles.cornerTl} />
        <span className={styles.cornerTr} />
        <span className={styles.cornerBl} />
        <span className={styles.cornerBr} />

        <div className={styles.modalHeader}>
          <div className={styles.headerTitle}>
            <span className={styles.headerDot} />
            <Sliders size={14} />
            <span>SYSTEM CONFIGURATION // NEURAL SETTINGS</span>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeSettings}
            title="Close Settings"
            aria-label="Close Settings"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <User size={14} />
                <span>Operator Profile & Identity</span>
              </div>
            </div>

            <div className={styles.profileCard}>
              <div className={styles.avatarPreview} title={`Avatar: ${currentInitials}`}>
                {currentInitials}
              </div>

              <div className={styles.profileInputs}>
                <div className={styles.inputField}>
                  <label htmlFor="settings-user-name" className={styles.inputLabel}>
                    Operator Call-Sign / Name
                  </label>
                  <input
                    id="settings-user-name"
                    type="text"
                    className={styles.textInput}
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    placeholder="Enter your name (e.g. Commander Shepard)"
                  />
                </div>

                <div className={styles.inputField}>
                  <label htmlFor="settings-user-role" className={styles.inputLabel}>
                    Command Designation / Role
                  </label>
                  <input
                    id="settings-user-role"
                    type="text"
                    className={styles.textInput}
                    value={localRole}
                    onChange={(e) => setLocalRole(e.target.value)}
                    placeholder="e.g. SYNAPSE // SWARM COMMAND"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <Key size={14} />
                <span>Google Gemini Neural Engine</span>
              </div>
              <div className={`${styles.statusBadge} ${hasCustomKey ? styles.active : styles.fallback}`}>
                <span className={styles.statusDot} />
                <span>{hasCustomKey ? 'Custom Key Active' : 'Cluster Env Key'}</span>
              </div>
            </div>

            <div className={styles.inputField}>
              <label htmlFor="settings-gemini-key" className={styles.inputLabel}>
                Gemini API Key (Google AI Studio)
              </label>
              <div className={styles.keyInputWrapper}>
                <input
                  id="settings-gemini-key"
                  type={showApiKey ? 'text' : 'password'}
                  className={styles.keyInput}
                  value={localApiKey}
                  onChange={(e) => {
                    setLocalApiKey(e.target.value);
                    setVerifyStatus(null);
                  }}
                  placeholder="AIzaSy..."
                  autoComplete="off"
                />
                <button
                  type="button"
                  className={styles.keyVisibilityBtn}
                  onClick={() => setShowApiKey((prev) => !prev)}
                  title={showApiKey ? 'Hide Key' : 'Show Key'}
                  aria-label={showApiKey ? 'Hide API Key' : 'Show API Key'}
                >
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className={styles.keyActions}>
              <button
                type="button"
                className={styles.testBtn}
                onClick={() => {
                  void handleVerifyConnection();
                }}
                disabled={isVerifying}
                title="Test neural link connection with Gemini API"
              >
                {isVerifying ? <RefreshCw size={12} className="animate-spin" /> : <Zap size={12} />}
                <span>{isVerifying ? 'TESTING LINK...' : 'PING NEURAL LINK'}</span>
              </button>

              {verifyStatus && (
                <div
                  className={`${styles.testResult} ${verifyStatus.success ? styles.success : styles.error}`}
                  role="status"
                >
                  {verifyStatus.success ? <Check size={14} /> : <X size={14} />}
                  <span>{verifyStatus.message}</span>
                </div>
              )}
            </div>

            <div className={styles.guideCard}>
              <div className={styles.guideTitle}>How to connect your Gemini API Key:</div>
              <ul className={styles.guideList}>
                <li className={styles.guideItem}>
                  <span className={styles.guideStepNum}>01</span>
                  <span className={styles.guideStepText}>
                    Open Google AI Studio and sign in with your Google account (free tier available with generous rate
                    limits).
                  </span>
                </li>
                <li className={styles.guideItem}>
                  <span className={styles.guideStepNum}>02</span>
                  <span className={styles.guideStepText}>
                    Click &quot;Create API key&quot; and copy your generated key string.
                  </span>
                </li>
                <li className={styles.guideItem}>
                  <span className={styles.guideStepNum}>03</span>
                  <span className={styles.guideStepText}>
                    Paste it into the field above and click &quot;Save Configuration&quot;. Your key is stored securely
                    in your browser&apos;s localStorage.
                  </span>
                </li>
              </ul>

              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.guideLink}
                title="Open Google AI Studio in new tab"
              >
                <span>GET FREE GEMINI API KEY</span>
                <ExternalLink size={13} />
              </a>

              <div className={styles.guideNotice}>
                * If no custom key is specified, Synapse OS automatically utilizes the server cluster fallback key (if
                configured in the deployment environment).
              </div>
            </div>
          </section>
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className={styles.resetBtn} onClick={handleReset} title="Reset to default settings">
            RESET DEFAULTS
          </button>

          <button type="button" className={styles.saveBtn} onClick={handleSave} title="Save and apply configuration">
            SAVE CONFIGURATION
          </button>
        </div>
      </div>
    </div>
  );
}

export function SettingsModal() {
  const isSettingsOpen = useSettingsStore((state) => state.isSettingsOpen);
  if (!isSettingsOpen) return null;
  return <SettingsModalContent />;
}
