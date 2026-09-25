import { useState } from 'react';
import './App.css';
import radarThumbnail from './assets/threat-radar-thumbnail.svg';
import { Navbar } from './components/Navbar';
import { WalletModal } from './components/WalletModal';
import { WatchDefenseModal } from './components/WatchDefenseModal';
import { DocsModal } from './components/DocsModal';
import { ContactModal } from './components/ContactModal';
import { ThreatRadarDashboard } from './components/ThreatRadarDashboard';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'radar'>('home');
  const [userAddress, setUserAddress] = useState<string>(() => {
    return localStorage.getItem('graphsentinel_active_wallet') || '';
  });
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [isWatchDefenseOpen, setIsWatchDefenseOpen] = useState<boolean>(false);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  // Clean up motion-pending on demo card animation end
  const handleDemoCardAnimationEnd = () => {
    document.documentElement.classList.remove('motion-pending');
    if ((window as any).__motionTimeout) {
      clearTimeout((window as any).__motionTimeout);
    }
  };

  const handleConnectSuccess = (address: string) => {
    setUserAddress(address);
    localStorage.setItem('graphsentinel_active_wallet', address);
    setIsWalletModalOpen(false);
    setActiveTab('radar');
  };

  const handleDisconnectWallet = () => {
    setUserAddress('');
    localStorage.removeItem('graphsentinel_active_wallet');
  };

  const handleLaunchRadar = () => {
    setActiveTab('radar');
    if (!userAddress) {
      setIsWalletModalOpen(true);
    }
  };

  return (
    <>
      <main className="viewport">
        {/* Stable Fixed Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          onOpenDocs={() => setIsDocsOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenWalletModal={() => setIsWalletModalOpen(true)}
          userAddress={userAddress}
          onDisconnectWallet={handleDisconnectWallet}
        />

        {/* View Switcher: Home Landing vs. Threat Radar Dashboard */}
        {activeTab === 'home' ? (
          <section className="screen" id="screen">
            {/* Mandatory Edge-to-Edge Background Video */}
            <video
              className="background"
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              aria-hidden="true"
            >
              <source
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_064556_051587f1-74a1-4336-8c05-4dde3594ed05.mp4"
                type="video/mp4"
              />
            </video>

            {/* Hero Stack */}
            <section className="hero">
              <div className="hero-content">
                <h1 className="hero-title">
                  <span className="line line-one">
                    <span className="line-reveal">Autonomous Defense</span>
                  </span>
                  <span className="line line-two">
                    <span className="line-reveal">For DeFi Pools.</span>
                  </span>
                </h1>
                <p className="hero-copy">
                  Market manipulation drains liquidity in seconds.<br />
                  GraphSentinel executes defensive trades autonomously,<br />
                  so your protocol is protected before you even notice.
                </p>
                <button
                  type="button"
                  className="primary-cta"
                  onClick={handleLaunchRadar}
                  aria-label="Launch Radar"
                >
                  <span className="label">Launch Radar</span>
                  <span className="arrow-box">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M2.5 7H11.5M11.5 7L7 2.5M11.5 7L7 11.5"
                        stroke="#FFFFFF"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </div>

              {/* Bottom-Right Glass Demo Card */}
              <article
                className="demo-card"
                onAnimationEnd={handleDemoCardAnimationEnd}
              >
                <div className="demo-visual">
                  <img
                    src={radarThumbnail}
                    alt="Threat Radar Heatmap"
                  />
                  <button
                    type="button"
                    className="play"
                    aria-label="Play demo"
                    onClick={() => setIsWatchDefenseOpen(true)}
                  >
                    <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 2.2L11 7.5L1.5 12.8V2.2Z" fill="#FFFFFF" />
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  className="watch-button"
                  onClick={() => setIsWatchDefenseOpen(true)}
                >
                  Watch Defense
                </button>
              </article>
            </section>
          </section>
        ) : (
          /* Live Threat Radar Mission Control Dashboard */
          <div
            style={{
              position: 'fixed',
              top: '64px',
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: 'calc(100vh - 64px)',
              overflow: 'hidden',
              zIndex: 10,
            }}
          >
            <ThreatRadarDashboard
              userAddress={userAddress}
              onDisconnect={() => setActiveTab('home')}
            />
          </div>
        )}
      </main>

      {/* Interactive Modals */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnectSuccess={handleConnectSuccess}
      />

      <WatchDefenseModal
        isOpen={isWatchDefenseOpen}
        onClose={() => setIsWatchDefenseOpen(false)}
        onLaunchRadar={() => {
          setIsWatchDefenseOpen(false);
          setActiveTab('radar');
        }}
      />

      <DocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  );
}

export default App;
