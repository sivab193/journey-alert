"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { BellRing, Bus, Check, ChevronDown, Clock3, LockKeyhole, MapPin, Navigation, Route, Train, Volume2, Zap } from "lucide-react";

function RouteOrb() {
  const mount = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = mount.current; if (!host) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(47, host.clientWidth / host.clientHeight, 0.1, 100); camera.position.set(0, .2, 6.3);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); renderer.setSize(host.clientWidth, host.clientHeight); host.appendChild(renderer.domElement);
    const globe = new THREE.Mesh(new THREE.IcosahedronGeometry(2.03, 5), new THREE.MeshBasicMaterial({ color: 0x121729, wireframe: true, transparent: true, opacity: .23 })); scene.add(globe);
    const points = Array.from({ length: 110 }, (_, i) => { const t = i / 109; return new THREE.Vector3(-2.9 + t * 5.8, Math.sin(t * Math.PI * 1.6) * .62 - .3, Math.cos(t * Math.PI) * .32); });
    const curve = new THREE.CatmullRomCurve3(points); const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 150, .029, 8, false), new THREE.MeshBasicMaterial({ color: 0xd3ff3f })); scene.add(tube);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(.13, 24, 24), new THREE.MeshBasicMaterial({ color: 0xffffff })); scene.add(dot);
    const halo = new THREE.Mesh(new THREE.RingGeometry(.21, .27, 40), new THREE.MeshBasicMaterial({ color: 0xd3ff3f, transparent: true, opacity: .7, side: THREE.DoubleSide })); scene.add(halo);
    const stars = new THREE.BufferGeometry(); const p = new Float32Array(450); for (let i = 0; i < p.length; i += 3) { p[i] = (Math.random() - .5) * 10; p[i + 1] = (Math.random() - .5) * 8; p[i + 2] = (Math.random() - .5) * 4 - 1; } stars.setAttribute("position", new THREE.BufferAttribute(p, 3)); scene.add(new THREE.Points(stars, new THREE.PointsMaterial({ color: 0xa8b5df, size: .025, transparent: true, opacity: .55 })));
    let frame = 0; const render = () => { frame = requestAnimationFrame(render); const point = curve.getPointAt((performance.now() * .000055) % 1); dot.position.copy(point); halo.position.copy(point); halo.rotation.z += .03; globe.rotation.y += .0013; globe.rotation.x = Math.sin(performance.now() * .00018) * .14; renderer.render(scene, camera); }; render();
    const resize = () => { camera.aspect = host.clientWidth / host.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(host.clientWidth, host.clientHeight); }; window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); renderer.dispose(); host.removeChild(renderer.domElement); };
  }, []);
  return <div ref={mount} className="route-orb" aria-hidden="true" />;
}

const choices = [5, 10, 20, 30];
export default function Home() {
  const [mode, setMode] = useState<"bus" | "train">("bus"); const [alertKm, setAlertKm] = useState(20); const [tracking, setTracking] = useState(false); const [sound, setSound] = useState(true); const [locationStatus, setLocationStatus] = useState("");
  const startTracking = () => {
    if (tracking) { setTracking(false); setLocationStatus("Journey tracking paused"); return; }
    if (!navigator.geolocation) { setLocationStatus("Location is not supported by this browser"); return; }
    setLocationStatus("Requesting location permission…");
    navigator.geolocation.getCurrentPosition(
      (position) => { setTracking(true); setLocationStatus(`Location connected · ${position.coords.accuracy.toFixed(0)} m accuracy`); },
      (error) => { setTracking(false); setLocationStatus(error.code === error.PERMISSION_DENIED ? "Location permission is needed to start tracking" : "Could not get your location. Check GPS and try again."); },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    );
  };
  return <main>
    <section className="hero"><nav className="nav-shell"><a className="brand" href="#top"><span className="brand-mark"><Navigation size={16} fill="currentColor" /></span>JourneyAlert</a><div className="nav-links"><a href="#how-it-works">How it works</a><a href="#privacy">Privacy</a></div><a href="#demo" className="nav-cta">Try the journey <span>↗</span></a></nav><RouteOrb /><div className="aurora one" /><div className="aurora two" />
      <div className="hero-copy" id="top"><div className="eyebrow"><span className="pulse" /> ROUTE-AWARE TRAVEL ALARMS</div><h1>Sleep through<br />the journey.<br /><em>Not</em> the stop.</h1><p>JourneyAlert watches the route, not just the clock — then wakes you at exactly the distance you choose.</p><div className="hero-actions"><a className="primary-button" href="#demo">Plan a journey <span>→</span></a><button className="text-button" onClick={() => document.querySelector("#how-it-works")?.scrollIntoView({ behavior: "smooth" })}>See how it works <ChevronDown size={16} /></button></div></div>
      <div className="floating-stat stat-left"><div className="stat-icon"><Route size={17} /></div><span>Route tracking</span><b>34.6 km</b><small>to destination</small></div><div className="floating-stat stat-right"><div className="live-dot" /><span>ALARM READY</span><b>~47 min</b><small>until alert</small></div><div className="scroll-prompt"><span>SCROLL TO EXPLORE</span><div /></div>
    </section>
    <section className="story-section" id="how-it-works"><div className="section-kicker">THE BETTER WAY TO ARRIVE</div><div className="story-grid"><h2>Distance that<br /><span>knows the way.</span></h2><div><p className="lead">Not a simple radius. JourneyAlert follows your actual bus or rail route, updating remaining kilometres and arrival time as you move.</p><div className="feature-lines"><p><Check /> Calculates <strong>road-route distance</strong> for buses</p><p><Check /> Uses <strong>station progression</strong> for trains</p><p><Check /> Keeps your journey details <strong>on your phone</strong></p></div></div></div><div className="route-stage"><div className="route-label start"><span /> COIMBATORE <b>23:15</b></div><div className="route-line"><i /><i /><i /><i /><i /></div><div className="route-label end"><span /> KARUR <b>~47 MIN</b></div><div className="route-card"><div className="card-top"><span><Bus size={15} /> BUS JOURNEY</span><b>LIVE</b></div><strong>34.6 km <small>remaining by road</small></strong><div className="mini-progress"><i /></div><p><Clock3 size={14} /> 47 min left <span>•</span> Alert at 20 km</p></div></div></section>
    <section className="demo-section" id="demo"><div className="demo-copy"><div className="section-kicker">THE JOURNEY, YOUR WAY</div><h2>Set it once.<br />Drift off.</h2><p>Choose your route. Set your wake-up distance. Let JourneyAlert do the watching.</p><div className="privacy-promise"><LockKeyhole size={18} /><span><b>Private by design.</b><br />No account. No tracking server. Your location never leaves your phone.</span></div></div><div className="journey-console"><div className="console-head"><span>NEW JOURNEY</span><span className={tracking ? "active-status" : ""}>{tracking ? "TRACKING" : "READY"}</span></div><div className="mode-switch"><button onClick={() => setMode("bus")} className={mode === "bus" ? "selected" : ""}><Bus size={17} /> Bus</button><button onClick={() => setMode("train")} className={mode === "train" ? "selected" : ""}><Train size={17} /> Train</button></div><label>{mode === "bus" ? "DROP POINT" : "DESTINATION STATION"}<div className="location-field"><MapPin size={17} /><span>{mode === "bus" ? "Karur Bus Stand" : "KRR · Karur Junction"}</span><ChevronDown size={16} /></div></label>{mode === "train" && <label>TRAIN NUMBER<div className="location-field"><Train size={17} /><span>12635 · Vaigai SF Express</span><ChevronDown size={16} /></div></label>}<label>WAKE ME WHEN I’M THIS FAR AWAY</label><div className="distance-choices">{choices.map(km => <button key={km} className={alertKm === km ? "selected" : ""} onClick={() => setAlertKm(km)}>{km} km</button>)}</div><div className="sound-row"><div><Volume2 size={17} /><span><b>Sound + vibration</b><small>Also sends an alert to your band</small></span></div><button className={sound ? "toggle on" : "toggle"} onClick={() => setSound(!sound)} aria-label="Toggle sound"><i /></button></div><button className={tracking ? "start-button tracking" : "start-button"} onClick={startTracking}>{tracking ? <><BellRing size={18} /> Stop journey tracking</> : <><Zap size={18} /> Start journey tracking</>}</button>{locationStatus && <div className={tracking ? "tracking-readout" : "tracking-readout warning"}>{tracking && <span className="pulse" />} {tracking ? <>LIVE · <b>34.6 km</b> by road · <b>~47 min</b> left<br /></> : null}{locationStatus}</div>}</div></section>
    <section className="alarm-section"><div className="alarm-glow" /><div className="alarm-content"><BellRing size={24} /><div><div className="section-kicker">WHEN IT MATTERS</div><h2>Wake up before<br />you arrive.</h2></div><p>Full-screen alarm. Persistent vibration. One tap to snooze. And a mirrored notification for your Samsung Fit when it is connected.</p></div></section>
    <section className="privacy-section" id="privacy"><div className="section-kicker">YOUR JOURNEY IS YOURS</div><h2>No login.<br />No cloud trail.</h2><p>JourneyAlert processes location and route progress on-device during an active trip. End the journey, and temporary location data is cleared.</p><div className="privacy-grid"><div><LockKeyhole /><b>On-device tracking</b><span>Active journey data stays local</span></div><div><Route /><b>Cached route</b><span>Works through patchy signal</span></div><div><BellRing /><b>Reliable alert</b><span>Route, time, and health fallbacks</span></div></div></section>
    <footer><a className="brand" href="#top"><span className="brand-mark"><Navigation size={16} fill="currentColor" /></span>JourneyAlert</a><p>Arrive rested. Wake up right.</p><span>ANDROID · PRIVATE BY DESIGN</span></footer>
  </main>;
}
