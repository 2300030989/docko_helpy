"use client";

import { useState, useEffect, useRef } from "react";

const SYMPTOMS = [
  {icon:'🤕', label:'Headache'},
  {icon:'🌡️', label:'Fever'},
  {icon:'💔', label:'Chest pain'},
  {icon:'🤢', label:'Nausea'},
  {icon:'😮‍💨', label:'Breathlessness'},
  {icon:'🦴', label:'Joint pain'},
  {icon:'👁️', label:'Blurred vision'},
  {icon:'🦷', label:'Toothache'},
  {icon:'😰', label:'Fatigue'},
  {icon:'🌸', label:'Skin rash'},
  {icon:'🤧', label:'Cough'},
  {icon:'🔙', label:'Back pain'},
];

const DEMO_CLINICS = [
  {name:'Apollo Clinic', meta:'1.2 km · Open until 9 PM', rating:'★★★★☆ 4.3', tags:['Neurology','General']},
  {name:'Care Hospitals', meta:'2.5 km · Open 24/7', rating:'★★★★★ 4.7', tags:['Multi-specialty','Emergency']},
  {name:'KIMS Health', meta:'3.8 km · Open until 8 PM', rating:'★★★★☆ 4.1', tags:['Neurology','Radiology']},
];

export default function Page() {
  const [selectedChips, setSelectedChips] = useState([]);
  const [symInput, setSymInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultFlipped, setResultFlipped] = useState(false);
  const [result, setResult] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [locationText, setLocationText] = useState("📍 Use My Location");
  
  const cardRef = useRef(null);

  // 3D Tilt Effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cardRef.current.style.transition = 'transform .08s ease';
    cardRef.current.style.transform = `perspective(1200px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateZ(6px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transition = 'transform .5s ease';
    cardRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  };

  const toggleChip = (label) => {
    setSelectedChips(prev => 
      prev.includes(label) ? prev.filter(c => c !== label) : [...prev, label]
    );
  };

  const analyse = async () => {
    const combined = [selectedChips.join(', '), symInput.trim()].filter(Boolean).join('. ');
    if (!combined) {
      alert('Please select symptoms or describe how you feel.');
      return;
    }

    setAnalyzing(true);
    setShowResults(true);
    setResultFlipped(false);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: combined })
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      setResult(data);
      
      const updatedClinics = DEMO_CLINICS.map(c => {
        const tags = [...c.tags];
        if (!tags.includes(data.specialty) && !tags.some(t => t.includes('General') && !t.includes('Neurology'))) {
          tags.unshift(data.specialty);
        }
        return { ...c, tags };
      });
      setClinics(updatedClinics);

    } catch (err) {
      console.error(err);
      alert('Failed to analyze symptoms.');
    }

    setTimeout(() => {
      setResultFlipped(true);
      setAnalyzing(false);
      document.getElementById('resultsWrap')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 400);
  };

  const getLocation = () => {
    setLocationText('📡 Locating…');
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocationText(`📍 ${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`),
        () => {
          setLocationText('📍 Location denied');
          setTimeout(() => setLocationText('📍 Use My Location'), 2000);
        }
      );
    }
  };

  return (
    <>
      <div className="bg-scene">
        <div className="orb o1"></div>
        <div className="orb o2"></div>
        <div className="orb o3"></div>
        <div className="grid-overlay"></div>
        <div className="particles">
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} className="pt" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              '--d': `${5 + Math.random() * 9}s`,
              '--dl': `${Math.random() * 7}s`,
              fontSize: `${9 + Math.random() * 8}px`
            }}>
              {['+', '⊕', '·', '×', '◇', '○'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      </div>

      <div className="app">
        <header className="header">
          <div className="logo">
            <div className="logo-icon">⊕</div>
            <span className="logo-text">MedRoute</span>
          </div>
          <div className="api-btn">
             <span className="api-dot active"></span>
             <span>Gemini Secured</span>
          </div>
        </header>

        {/* Ad Unit 1 */}
        <AdBanner 
          adSlot="1111111111" 
          format="auto" 
          fullWidthResponsive={true} 
        />

        <section className="hero">
          <div className="gyro-wrap">
            <div className="gyro">
              <div className="ring ring-a"></div>
              <div className="ring ring-b"></div>
              <div className="ring ring-c"></div>
              <div className="orbit-dot"></div>
              <div className="orbit-dot"></div>
              <div className="orbit-dot"></div>
              <div className="gyro-core">🩺</div>
            </div>
          </div>
          <div className="hero-copy">
            <div className="hero-eyebrow">AI-Powered Triage</div>
            <h1 className="hero-h1">Know Which<br/>Doctor to See</h1>
            <p className="hero-sub">Describe your symptoms. Our AI analyses and matches you to the right medical specialist — instantly.</p>
          </div>
        </section>

        <div className="card-wrap">
          <div 
            className="input-card" 
            id="inputCard"
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="card-eyebrow">Step 1</div>
            <h2 className="card-h2">Describe Your Symptoms</h2>
            <p className="card-desc">Select quick symptoms below or describe in your own words.</p>

            <div className="chips-label">Quick select →</div>
            <div className="chips-grid">
              {SYMPTOMS.map((s, i) => (
                <button 
                  key={i} 
                  className={`chip ${selectedChips.includes(s.label) ? 'active' : ''}`}
                  onClick={() => toggleChip(s.label)}
                >
                  <span className="chip-icon">{s.icon}</span>{s.label}
                </button>
              ))}
            </div>

            <textarea 
              className="sym-input" 
              rows={3}
              value={symInput}
              onChange={(e) => setSymInput(e.target.value)}
              placeholder={selectedChips.length > 0 ? `Selected: ${selectedChips.join(', ')} — add more details below…` : "e.g. I have a severe headache on one side with nausea and sensitivity to light for 2 days…"}
            ></textarea>

            <button 
              className="analyse-btn" 
              onClick={analyse}
              disabled={analyzing}
            >
              <span className="btn-shimmer"></span>
              {analyzing ? 'Analysing…' : '✦  Analyse My Symptoms'}
            </button>
          </div>
        </div>

        <div className={`results-wrap ${showResults ? 'show' : ''}`} id="resultsWrap">
          
          {/* Ad Unit 2 */}
          <AdBanner 
            adSlot="2222222222" 
            format="rectangle" 
            fullWidthResponsive={false} 
            style={{ maxWidth: '336px', margin: '0 auto 20px', width: '300px', height: '250px' }} 
            containerStyle={{ maxWidth: '336px', margin: '0 auto 20px' }}
          />

          <div className="flip-scene">
            <div className={`flip-card ${resultFlipped ? 'flipped' : ''}`} id="flipCard">
              
              <div className="face face-front">
                <div className="spin-ring"></div>
                <div className="loading-dots">
                  <div className="ldot"></div>
                  <div className="ldot"></div>
                  <div className="ldot"></div>
                </div>
                <div className="loading-label">Analysing symptoms…</div>
              </div>

              {result && (
                <div className="face face-back">
                  <div className="result-head">
                    <div className="res-icon">{result.icon || '🩺'}</div>
                    <div className="res-title-wrap">
                      <div className="res-specialty">{result.specialty || 'General Physician'}</div>
                      <div className={`urgency-badge urg-${result.urgency === 'emergency' ? 'em' : result.urgency === 'see_soon' ? 'soon' : 'routine'}`}>
                        <span className="udot"></span>
                        <span>{result.urgency_label || 'Routine'}</span>
                      </div>
                    </div>
                  </div>
                  <p className="res-reason">{result.reason}</p>
                  <div className="res-sub-label">Also consider</div>
                  <div className="also-chips">
                    {(result.also_consider || []).map((s, i) => (
                      <span key={i} className="also-chip">{s}</span>
                    ))}
                  </div>
                  <div className="res-sub-label">Self-care tip</div>
                  <p className="res-reason" style={{ marginBottom: '10px' }}>{result.self_care}</p>
                  <div className="warn-box">
                    <strong>⚠️ Go to ER if:</strong> {result.emergency_signs}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="clinics-section">
            <div className="sec-head">
              <span className="sec-title">Nearby Specialists</span>
              <button className="loc-btn" onClick={getLocation}>{locationText}</button>
            </div>
            <div className="clinics-grid">
              {clinics.map((c, i) => (
                <div key={i} className="clinic-card">
                  <div className="cl-name">{c.name}</div>
                  <div className="cl-meta">{c.meta}</div>
                  <div className="cl-tags">
                    {c.tags.slice(0, 3).map((t, ti) => (
                      <span key={ti} className="cl-tag">{t}</span>
                    ))}
                  </div>
                  <div className="cl-rating">{c.rating}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="disclaimer">
          ⚠️ MedRoute is for informational guidance only and is not a substitute for professional medical advice.<br/>
          In an emergency, call <strong>108</strong> (India) immediately.
        </div>

        {/* Ad Unit 3 */}
        <AdBanner 
          adSlot="3333333333" 
          format="auto" 
          fullWidthResponsive={true} 
          containerStyle={{ marginTop: '28px' }}
        />
      </div>
    </>
  );
}

function AdBanner({ adSlot, format, fullWidthResponsive, style, containerStyle }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      // Hide placeholder if ad loads
      setTimeout(() => {
        document.querySelectorAll('.ad-placeholder').forEach(el => el.style.display = 'none');
      }, 2500);
    } catch (err) {
      console.error('AdSense Error:', err);
    }
  }, []);

  return (
    <div className={`ad-unit ${format === 'rectangle' ? 'ad-unit-rect' : ''}`} style={containerStyle}>
      <div className="ad-label">Advertisement</div>
      <ins 
        className="adsbygoogle"
        style={style || { display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
      <div className="ad-placeholder">Ad loads here after AdSense approval</div>
    </div>
  );
}
