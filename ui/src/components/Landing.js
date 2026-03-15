import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Landing() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  useEffect(() => {
    const userStatus = localStorage.getItem('homai_user_status');
    if (userStatus) {
      setStatus(userStatus);
    }
  }, []);

  const handleSignup = (e) => {
    e.preventDefault();
    if (email) {
      const pendingUsers = JSON.parse(localStorage.getItem('homai_pending_users') || '[]');
      if (!pendingUsers.includes(email)) {
        pendingUsers.push(email);
        localStorage.setItem('homai_pending_users', JSON.stringify(pendingUsers));
      }
      localStorage.setItem('homai_user_status', 'pending');
      setStatus('pending');
      setSubscribed(true);
      setEmail('');
    }
  };

  const goToApp = () => {
    if (status === 'approved') {
      navigate('/properties');
    }
  };

  const features = [
    {
      icon: '🏠',
      title: 'Property Analysis',
      description: 'AI-powered analysis of any property. Get instant valuations, ROI estimates, and investment recommendations.'
    },
    {
      icon: '📊',
      title: 'Market Intelligence',
      description: 'Real-time market trends, comparable sales, and neighborhood analytics for smarter decisions.'
    },
    {
      icon: '✉️',
      title: 'Smart Communications',
      description: 'Auto-generate professional emails, listings, and follow-ups tailored to your clients.'
    },
    {
      icon: '🤖',
      title: 'Local AI Power',
      description: 'Run AI locally with Qwen or use Claude API. Your data stays private, your costs stay low.'
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #1a2332 100%)',
      display: 'flex'
    }}>
      {/* Left Sidebar */}
      <div style={{
        width: '240px',
        background: 'rgba(13, 17, 23, 0.95)',
        borderRight: '1px solid rgba(139,148,158,0.1)',
        padding: '2rem 0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh'
      }}>
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <img 
            src="/homai-logo.png" 
            alt="HOMAI" 
            style={{ 
              height: '80px',
              marginBottom: '0.5rem',
              filter: 'brightness(0) invert(1)'
            }} 
          />
          <p style={{ color: '#8b949e', fontSize: '0.85rem', margin: 0 }}>
            AI Real Estate OS
          </p>
        </div>

        <nav style={{ flex: 1 }}>
          {[
            { icon: '🏠', label: 'Home', path: '/' },
            { icon: '📁', label: 'Properties', path: '/properties', requiresApproval: true },
            { icon: '⚡', label: 'Workflows', path: '/workflows', requiresApproval: true },
            { icon: '💬', label: 'AI Chat', path: '/chat', requiresApproval: true },
            { icon: '📧', label: 'Email', path: '/email', requiresApproval: true },
            { icon: '📈', label: 'Market', path: '/market', requiresApproval: true },
            { icon: '🔌', label: 'Status', path: '/status', requiresApproval: true },
          ].map((item, i) => {
            const isLocked = item.requiresApproval && status !== 'approved';
            return (
              <div 
                key={i} 
                onClick={() => !isLocked && navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1.5rem',
                  color: isLocked ? '#484f58' : '#8b949e',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  opacity: isLocked ? 0.5 : 1
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                <span>{item.label}</span>
                {isLocked && <span style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>🔒</span>}
              </div>
            );
          })}
        </nav>

        <div style={{ padding: '0 1.5rem', borderTop: '1px solid rgba(139,148,158,0.1)', paddingTop: '1rem' }}>
          <div 
            onClick={() => navigate('/settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 0',
              color: '#8b949e',
              cursor: 'pointer'
            }}
          >
            <span>⚙️</span>
            <span>Settings</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 0',
            color: '#8b949e'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6e40c9, #8250df)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}>
              U
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: '0.875rem', fontWeight: '500' }}>
                {status === 'approved' ? 'Member' : status === 'pending' ? 'Pending' : 'Guest'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#8b949e' }}>Beta</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '240px', flex: 1, padding: '3rem 4rem', maxWidth: '900px' }}>
        {/* Hero */}
        <div style={{ maxWidth: '800px', marginBottom: '4rem' }}>
          <h2 style={{ 
            color: '#fff', 
            fontSize: '2.75rem', 
            fontWeight: '700',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            Empowering Real Estate Professionals with{' '}
            <span style={{ 
              background: 'linear-gradient(135deg, #388bfd, #6e40c9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              AI-Driven
            </span>{' '}
            Intelligence
          </h2>
          <p style={{ color: '#8b949e', fontSize: '1.15rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Simplify property analysis, market research, and client communications with intelligent AI solutions. 
            Run locally or use cloud AI — your choice.
          </p>

          {/* Beta Signup */}
          {status === 'approved' ? (
            <div style={{
              background: 'rgba(35, 134, 54, 0.2)',
              border: '1px solid rgba(35, 134, 54, 0.5)',
              borderRadius: '16px',
              padding: '1.5rem',
              maxWidth: '500px'
            }}>
              <h3 style={{ color: '#3fb950', margin: 0, fontSize: '1.1rem' }}>
                ✓ Welcome to HOMAI!
              </h3>
              <p style={{ color: '#8b949e', margin: '0.5rem 0 0' }}>
                You have access. Click "Properties" in the sidebar to get started.
              </p>
            </div>
          ) : status === 'pending' ? (
            <div style={{
              background: 'rgba(210, 153, 34, 0.2)',
              border: '1px solid rgba(210, 153, 34, 0.5)',
              borderRadius: '16px',
              padding: '1.5rem',
              maxWidth: '500px'
            }}>
              <h3 style={{ color: '#d29922', margin: 0, fontSize: '1.1rem' }}>
                ⏳ Pending Approval
              </h3>
              <p style={{ color: '#8b949e', margin: '0.5rem 0 0' }}>
                Your request is being reviewed. You'll be notified when approved.
              </p>
            </div>
          ) : (
            <div style={{
              background: 'rgba(56,139,253,0.1)',
              border: '1px solid rgba(56,139,253,0.3)',
              borderRadius: '16px',
              padding: '1.5rem',
              maxWidth: '500px'
            }}>
              <h3 style={{ color: '#fff', margin: '0 0 1rem', fontSize: '1.1rem' }}>
                🚀 Join Our Exclusive Early Beta!
              </h3>
              {subscribed ? (
                <div style={{ color: '#3fb950', fontWeight: '600' }}>
                  ✓ Thanks for signing up! We'll review your request soon.
                </div>
              ) : (
                <form onSubmit={handleSignup} style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(139,148,158,0.3)',
                      background: 'rgba(0,0,0,0.3)',
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                  <button type="submit" style={{
                    background: 'linear-gradient(135deg, #238636, #2ea043)',
                    color: '#fff',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    Register Free
                  </button>
                </form>
              )}
              <p style={{ color: '#6e7681', fontSize: '0.8rem', margin: '0.75rem 0 0' }}>
                No credit card required • Local or Cloud AI • Approval required
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div>
          <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
            Our Skills
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {features.map((feature, i) => (
              <div key={i} style={{
                background: 'rgba(22,27,34,0.8)',
                border: '1px solid rgba(139,148,158,0.15)',
                borderRadius: '16px',
                padding: '1.5rem',
                transition: 'transform 0.2s, border-color 0.2s',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h4 style={{ color: '#fff', margin: '0 0 0.5rem', fontSize: '1.1rem' }}>
                  {feature.title}
                </h4>
                <p style={{ color: '#8b949e', margin: 0, lineHeight: '1.5', fontSize: '0.9rem' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '4rem', 
          paddingTop: '2rem', 
          borderTop: '1px solid rgba(139,148,158,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <p style={{ color: '#6e7681', fontSize: '0.85rem', margin: 0 }}>
            © 2026 HOMAI. AI Real Estate Operating System.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: '#8b949e', fontSize: '0.85rem', textDecoration: 'none' }}>Privacy</a>
            <a href="#" style={{ color: '#8b949e', fontSize: '0.85rem', textDecoration: 'none' }}>Terms</a>
            <a href="#" style={{ color: '#8b949e', fontSize: '0.85rem', textDecoration: 'none' }}>Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
