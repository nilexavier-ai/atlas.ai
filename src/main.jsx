import React from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Check, Clock3, Menu, Phone, PhoneCall, Sparkles, X } from 'lucide-react';
import './styles.css';

const conversations = [
  { initials: 'MC', name: 'Marcus Chen', note: 'New patient inquiry', time: '2 min ago', color: 'blue' },
  { initials: 'SR', name: 'Sofia Rivera', note: 'Appointment scheduled', time: '18 min ago', color: 'gold' },
  { initials: 'JT', name: 'James Taylor', note: 'Follow-up requested', time: '42 min ago', color: 'green' },
];

function Logo() {
  return <a className="logo" href="#top" aria-label="Atlas home"><span className="logo-mark"><i /><i /><i /><i /></span><span>atlas</span></a>;
}

function App() {
  const [menu, setMenu] = React.useState(false);
  return (
    <main id="top">
      <nav className="nav shell">
        <Logo />
        <div className={`nav-links ${menu ? 'open' : ''}`}>
          <a href="#product">Product</a><a href="#solutions">Solutions</a><a href="#pricing">Pricing</a>
          <button className="login">Log in</button><a className="nav-cta" href="#demo">Book a demo <ArrowRight size={15} /></a>
        </div>
        <button className="menu" aria-label="Toggle menu" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
      </nav>

      <section className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14} /> Meet your new AI receptionist</div>
          <h1>Every call answered.<br/><em>Every opportunity captured.</em></h1>
          <p className="lead">Atlas is the always-on AI receptionist that answers calls, books appointments, and delights your customers—so you can focus on the work that matters.</p>
          <div className="hero-actions">
            <a className="primary" href="#demo">Book a demo <ArrowRight size={18} /></a>
            <a className="listen" href="#product"><span><PhoneCall size={17}/></span> Hear Atlas in action</a>
          </div>
          <div className="trust"><span className="faces"><b>AJ</b><b>MK</b><b>SL</b></span><span><strong>Trusted by 500+ teams</strong><small>to never miss a customer</small></span></div>
        </div>

        <div className="dashboard-wrap" aria-label="Atlas call dashboard preview">
          <div className="glow one"/><div className="glow two"/>
          <div className="floating live"><span/><b>Atlas is live</b><small>Answering calls now</small></div>
          <div className="dashboard">
            <header><Logo/><div className="dash-user">AR</div></header>
            <div className="dash-body">
              <div className="welcome"><span>Good morning, Alex</span><h2>Here’s what Atlas handled.</h2></div>
              <div className="stats">
                <article><span className="stat-icon"><Phone size={16}/></span><small>Calls answered</small><strong>47</strong><i>↗ 12% this week</i></article>
                <article><span className="stat-icon purple"><Clock3 size={16}/></span><small>Time saved</small><strong>6.2h</strong><i>↗ 8% this week</i></article>
              </div>
              <div className="activity-title"><b>Recent conversations</b><button>View all</button></div>
              <div className="calls">{conversations.map(c => <div className="call" key={c.name}><span className={`avatar ${c.color}`}>{c.initials}</span><span><b>{c.name}</b><small>{c.note}</small></span><time>{c.time}</time><button>›</button></div>)}</div>
            </div>
          </div>
          <div className="floating booked"><span><Check size={16}/></span><b>Appointment booked</b><small>Tomorrow at 10:30 AM</small></div>
        </div>
      </section>

      <section className="proof" id="solutions"><div className="shell">
        <p>Powering exceptional customer experiences at</p>
        <div className="brands"><span>Northstar</span><span><b>◈</b> Everwell</span><span>ARC & CO.</span><span><b>✣</b> bloom</span><span>HARBOR</span></div>
      </div></section>

      <section className="benefits shell" id="product">
        <div><span className="mini">ALWAYS AVAILABLE</span><h2>Your business never<br/>has to miss a call again.</h2></div>
        <p>From the first ring to the final follow-up, Atlas delivers a seamless, human-like experience your customers will love.</p>
        <div className="benefit-grid">
          <article><span>01</span><h3>Answers every call</h3><p>Day or night, busy or not—Atlas picks up instantly with a warm, natural voice.</p></article>
          <article><span>02</span><h3>Books your calendar</h3><p>Atlas finds the right time, confirms every detail, and keeps your schedule full.</p></article>
          <article><span>03</span><h3>Knows your business</h3><p>Trained on your services and policies, Atlas gives every caller the right answer.</p></article>
        </div>
      </section>

      <section className="cta" id="demo"><div className="cta-orb"/><div className="shell"><span className="mini">READY WHEN YOU ARE</span><h2>Let Atlas pick up<br/>your next call.</h2><p>See how an AI receptionist can transform your customer experience.</p><a className="primary light" href="mailto:hello@atlas.ai">Book your free demo <ArrowRight size={18}/></a></div></section>

      <footer className="shell"><Logo/><p>© 2026 Atlas AI. All rights reserved.</p><div><a href="#">Privacy</a><a href="#">Terms</a></div></footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
