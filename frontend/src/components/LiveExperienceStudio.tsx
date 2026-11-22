import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, RotateCcw, Siren, ShieldAlert, Award, Volume2, 
  VolumeX, Radio, Sparkles, Navigation, Gauge, FileText, 
  CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, ArrowUp, 
  ArrowDown, Car, Shield, Eye, Flame, MapPin, Zap, UserCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { VehicleState } from '../types';

interface Props {
  vehicle?: VehicleState | null;
  onNavigateTab?: (view: string) => void;
  isEmbedded?: boolean;
}

// -------------------------------------------------------------
// Scenario Definitions
// -------------------------------------------------------------
export interface ScenarioConfig {
  id: string;
  title: string;
  subtitle: string;
  speedLimitKmh: number;
  roadName: string;
  totalDistanceM: number;
  weather: 'clear' | 'night' | 'rain';
  description: string;
  targetGlosaSpeed: number;
  initialAmbulanceDist: number; // relative to player (negative = behind)
  signals: { dist: number; cycle: number; greenSec: number; name: string }[];
  zones: { start: number; end: number; limit: number; name: string }[];
}

export const SCENARIOS: ScenarioConfig[] = [
  {
    id: 'hitec_glosa',
    title: 'Hitec City Morning Rush — GLOSA Green Wave',
    subtitle: 'Synchronized SPaT V2X Advisory Corridor',
    speedLimitKmh: 50,
    roadName: 'Hitec City Main Road & Mindspace',
    totalDistanceM: 1200,
    weather: 'clear',
    targetGlosaSpeed: 42,
    initialAmbulanceDist: -600,
    description: 'Ride the green wave by matching the calculated GLOSA speed. Arrive at all signals during green phases.',
    signals: [
      { dist: 280, cycle: 60, greenSec: 30, name: 'Cyber Towers Junction' },
      { dist: 650, cycle: 60, greenSec: 25, name: 'Mindspace Roundabout' },
      { dist: 1050, cycle: 60, greenSec: 32, name: 'Inorbit Mall Junction' }
    ],
    zones: [
      { start: 0, end: 500, limit: 50, name: 'Hitec Cyber Highway' },
      { start: 500, end: 850, limit: 40, name: 'Mindspace Commercial Loop' },
      { start: 850, end: 1200, limit: 50, name: 'Inorbit Expressway' }
    ]
  },
  {
    id: 'apollo_ambulance',
    title: 'Apollo Hospital Emergency Corridor (EVP Preemption)',
    subtitle: 'V2X Emergency Vehicle Shoulder Yield Protocol',
    speedLimitKmh: 50,
    roadName: 'Jubilee Hills Road No. 36 to Apollo Hospital',
    totalDistanceM: 1100,
    weather: 'clear',
    targetGlosaSpeed: 45,
    initialAmbulanceDist: -220, // rapidly approaches from behind
    description: 'A 108 emergency ambulance is approaching rapidly from behind. Safely yield the center lane to create a green corridor.',
    signals: [
      { dist: 350, cycle: 55, greenSec: 28, name: 'Road 36 Checkpost' },
      { dist: 800, cycle: 55, greenSec: 30, name: 'Apollo Emergency Gate Junction' }
    ],
    zones: [
      { start: 0, end: 1100, limit: 50, name: 'Hospital Emergency Corridor' }
    ]
  },
  {
    id: 'school_zone',
    title: 'DPS School Zone & Pedestrian Crossing Strict Enforcement',
    subtitle: 'Automated Stop Line & 30 km/h Speed Trap',
    speedLimitKmh: 30,
    roadName: 'Khajaguda Road / School District',
    totalDistanceM: 900,
    weather: 'clear',
    targetGlosaSpeed: 28,
    initialAmbulanceDist: -800,
    description: 'School children crossing ahead. Strict 30 km/h limit enforced via camera radar. Vehicle must stop completely before crossing zebra line.',
    signals: [
      { dist: 400, cycle: 50, greenSec: 18, name: 'DPS School Pedestrian Crosswalk' }
    ],
    zones: [
      { start: 0, end: 200, limit: 40, name: 'Approach Buffer' },
      { start: 200, end: 600, limit: 30, name: 'Active School Zone (Zero Tolerance)' },
      { start: 600, end: 900, limit: 40, name: 'Departure Buffer' }
    ]
  },
  {
    id: 'orr_express',
    title: 'Nehru ORR Expressway High-Speed Cruise',
    subtitle: '80 km/h Multi-Lane Free Flow & Lane Discipline',
    speedLimitKmh: 80,
    roadName: 'Outer Ring Road (ORR) Expressway Stretch',
    totalDistanceM: 1600,
    weather: 'clear',
    targetGlosaSpeed: 75,
    initialAmbulanceDist: -700,
    description: 'Experience 80 km/h cruising. Avoid hogging the right overtaking lane and maintain 3-second braking headway.',
    signals: [],
    zones: [
      { start: 0, end: 1600, limit: 80, name: 'ORR Controlled Access Expressway' }
    ]
  },
  {
    id: 'monsoon_night',
    title: 'Monsoon Night Storm & Reduced Friction Challenge',
    subtitle: 'Low Visibility Weather & Extended Braking Physics',
    speedLimitKmh: 40,
    roadName: 'Financial District to Nanakramguda',
    totalDistanceM: 1000,
    weather: 'rain',
    targetGlosaSpeed: 35,
    initialAmbulanceDist: -350,
    description: 'Heavy Hyderabad monsoon downpour. Wet asphalt increases braking distance by 45%. Headlights active with tactical night HUD.',
    signals: [
      { dist: 450, cycle: 60, greenSec: 25, name: 'Financial District Junction' },
      { dist: 850, cycle: 60, greenSec: 28, name: 'Wipro Circle' }
    ],
    zones: [
      { start: 0, end: 1000, limit: 40, name: 'Monsoon Wet Corridor' }
    ]
  }
];

interface ChallanRecord {
  id: string;
  type: string;
  fine: number;
  section: string;
  time: string;
  speed: number;
  limit: number;
  location: string;
}

export const LiveExperienceStudio: React.FC<Props> = ({
  vehicle: propVehicle,
  onNavigateTab,
  isEmbedded = false
}) => {
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active Mission Configuration
  const [selectedScenario, setSelectedScenario] = useState<ScenarioConfig>(SCENARIOS[0]);
  const [viewMode, setViewMode] = useState<'driver' | 'birds_eye' | 'police_console'>('driver');
  const [isAutoPilot, setIsAutoPilot] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [activeChallan, setActiveChallan] = useState<ChallanRecord | null>(null);

  // Game/Simulation Mutable State Ref (for 60fps canvas loop)
  const sim = useRef({
    isRunning: true,
    simTime: 0,
    // Player Car Dynamics
    carDist: 40,           // meters along corridor
    carSpeed: 38,          // km/h
    targetSpeed: 42,       // km/h (target in autopilot)
    carLane: 1,            // 0=Left, 1=Center, 2=Right
    carVisualX: 1,         // interpolated 0.0 - 2.0
    isBraking: false,
    isAccelerating: false,
    isHandbrake: false,
    // Ambulance State
    ambulanceActive: true,
    ambDist: -280,         // meters
    ambSpeed: 68,          // km/h
    ambLane: 1,            // usually center lane
    ambYielded: false,
    // Scoring
    score: 95,
    speedViolations: 0,
    signalViolations: 0,
    ambYields: 0,
    greenWaveCount: 0,
    distanceDriven: 0,
    // Traffic Cars
    traffic: [
      { id: 'c1', dist: 120, lane: 0, visualLane: 0, speed: 42, color: '#38bdf8' },
      { id: 'c2', dist: 220, lane: 2, visualLane: 2, speed: 45, color: '#fbbf24' },
      { id: 'c3', dist: 480, lane: 1, visualLane: 1, speed: 38, color: '#a855f7' },
      { id: 'c4', dist: 720, lane: 0, visualLane: 0, speed: 44, color: '#f43f5e' },
      { id: 'c5', dist: 960, lane: 2, visualLane: 2, speed: 40, color: '#34d399' }
    ],
    // Challans history
    challans: [] as ChallanRecord[],
    // Last violation timestamp to avoid spam
    lastViolationTime: 0
  });

  // UI-mirrored state updated at lower rate (10Hz) for smooth DOM React rendering
  const [uiStats, setUiStats] = useState({
    speedKmh: 38,
    speedLimit: 50,
    currentLane: 1,
    distDriven: 0,
    progressPct: 0,
    score: 95,
    activeZone: 'Hitec Cyber Highway',
    glosaAdvisory: 'Maintain 42 km/h for Green Wave',
    glosaMatched: true,
    ambulanceDistBehind: 280,
    ambulanceIncoming: true,
    upcomingSignal: { name: 'Cyber Towers', state: 'GREEN', sec: 18, dist: 240 },
    challanCount: 0
  });

  // Web Audio Context for Authentic Sound Effects (Pure Web Audio, 0 dependencies)
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBeep = useCallback((freq = 580, type: OscillatorType = 'sine', duration = 0.12) => {
    if (!soundEnabled) return;
    try {
      const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }, [soundEnabled]);

  const playSirenBurst = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.linearRampToValueAtTime(780, now + 0.18);
      osc.frequency.linearRampToValueAtTime(520, now + 0.36);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // silent catch
    }
  }, [soundEnabled]);

  // Restart / Switch Scenario
  const resetScenario = useCallback((scenario: ScenarioConfig) => {
    setSelectedScenario(scenario);
    sim.current.simTime = 0;
    sim.current.carDist = 40;
    sim.current.carSpeed = Math.min(38, scenario.speedLimitKmh * 0.8);
    sim.current.targetSpeed = scenario.targetGlosaSpeed;
    sim.current.carLane = 1;
    sim.current.carVisualX = 1;
    sim.current.isBraking = false;
    sim.current.isAccelerating = false;
    sim.current.ambulanceActive = true;
    sim.current.ambDist = scenario.initialAmbulanceDist;
    sim.current.ambSpeed = scenario.speedLimitKmh + 22;
    sim.current.ambYielded = false;
    sim.current.score = 98;
    sim.current.speedViolations = 0;
    sim.current.signalViolations = 0;
    sim.current.ambYields = 0;
    sim.current.challans = [];
    setActiveChallan(null);
  }, []);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        sim.current.isAccelerating = true;
        sim.current.isBraking = false;
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        sim.current.isBraking = true;
        sim.current.isAccelerating = false;
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (sim.current.carLane > 0) {
          sim.current.carLane -= 1;
          playBeep(480, 'triangle', 0.08);
        }
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (sim.current.carLane < 2) {
          sim.current.carLane += 1;
          playBeep(480, 'triangle', 0.08);
        }
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        sim.current.isHandbrake = true;
        sim.current.isBraking = true;
      } else if (e.key === 'p' || e.key === 'P') {
        sim.current.isRunning = !sim.current.isRunning;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        sim.current.isAccelerating = false;
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        sim.current.isBraking = false;
      } else if (e.key === ' ' || e.code === 'Space') {
        sim.current.isHandbrake = false;
        sim.current.isBraking = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playBeep]);

  // Main 60 FPS Physics & Canvas Render Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let uiUpdateTimer = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const s = sim.current;
      const config = selectedScenario;

      if (s.isRunning) {
        s.simTime += dt;

        // 1. Current Zone & Speed Limit Lookup
        const currentZone = config.zones.find(z => s.carDist >= z.start && s.carDist <= z.end) || config.zones[0];
        const activeLimit = currentZone ? currentZone.limit : config.speedLimitKmh;

        // 2. Upcoming Signal State Computation
        let upcomingSig: { name: string; state: string; sec: number; dist: number } | null = null;
        for (const sig of config.signals) {
          if (sig.dist > s.carDist - 10) {
            const cyclePhase = (s.simTime + (sig.dist * 0.05)) % sig.cycle;
            const isGreen = cyclePhase < sig.greenSec;
            const isYellow = !isGreen && cyclePhase < sig.greenSec + 4;
            const secLeft = Math.round(isGreen ? sig.greenSec - cyclePhase : sig.cycle - cyclePhase);
            upcomingSig = {
              name: sig.name,
              state: isGreen ? 'GREEN' : isYellow ? 'YELLOW' : 'RED',
              sec: Math.max(1, secLeft),
              dist: Math.round(sig.dist - s.carDist)
            };
            break;
          }
        }

        // 3. Autonomous Autopilot Decision
        if (isAutoPilot) {
          if (upcomingSig && upcomingSig.state === 'RED' && upcomingSig.dist < 85) {
            // Decelerate smoothly to stop line
            s.isBraking = true;
            s.isAccelerating = false;
          } else if (upcomingSig && upcomingSig.state === 'GREEN' && upcomingSig.dist < 150) {
            // GLOSA target match
            if (s.carSpeed < config.targetGlosaSpeed) {
              s.isAccelerating = true;
              s.isBraking = false;
            } else if (s.carSpeed > config.targetGlosaSpeed + 3) {
              s.isBraking = true;
              s.isAccelerating = false;
            } else {
              s.isAccelerating = false;
              s.isBraking = false;
            }
          } else {
            // Normal cruise at speed limit - 3
            if (s.carSpeed < activeLimit - 4) {
              s.isAccelerating = true;
              s.isBraking = false;
            } else {
              s.isAccelerating = false;
            }
          }

          // If ambulance is behind in our lane, autopilot yields to the left
          const ambDistBehind = s.carDist - s.ambDist;
          if (s.ambulanceActive && ambDistBehind > 0 && ambDistBehind < 180 && s.carLane === s.ambLane) {
            if (s.carLane > 0) s.carLane = 0;
            else s.carLane = 2;
          }
        }

        // 4. Vehicle Longitudinal Physics
        const accelRate = config.weather === 'rain' ? 12 : 16;  // km/h per sec
        const brakeRate = config.weather === 'rain' ? 24 : 36;  // km/h per sec
        const dragRate = 4.5;                                   // km/h per sec

        if (s.isHandbrake) {
          s.carSpeed = Math.max(0, s.carSpeed - brakeRate * 1.5 * dt);
        } else if (s.isBraking) {
          s.carSpeed = Math.max(0, s.carSpeed - brakeRate * dt);
        } else if (s.isAccelerating) {
          s.carSpeed = Math.min(activeLimit + 30, s.carSpeed + accelRate * dt);
        } else {
          // Natural rolling drag
          s.carSpeed = Math.max(0, s.carSpeed - dragRate * dt);
        }

        // Move car along corridor
        const speedMs = (s.carSpeed * 1000) / 3600;
        s.carDist += speedMs * dt;
        s.distanceDriven += speedMs * dt;

        // Loop corridor seamlessly
        if (s.carDist > config.totalDistanceM) {
          s.carDist = 30;
          s.ambDist = s.carDist + config.initialAmbulanceDist;
        }

        // 5. Lateral Spring Smoothing (carVisualX)
        const laneLerpSpeed = 10;
        s.carVisualX += (s.carLane - s.carVisualX) * (laneLerpSpeed * dt);

        // 6. Ambulance Logic & Emergency Preemption
        if (s.ambulanceActive) {
          const ambSpeedMs = (s.ambSpeed * 1000) / 3600;
          s.ambDist += ambSpeedMs * dt;

          const ambBehindDist = s.carDist - s.ambDist;

          // Play periodic siren when ambulance is within 250m
          if (ambBehindDist > 0 && ambBehindDist < 250 && Math.floor(s.simTime * 2.5) % 3 === 0) {
            playSirenBurst();
          }

          // Check if player yielded lane
          if (ambBehindDist > 0 && ambBehindDist < 60 && s.carLane !== s.ambLane && !s.ambYielded) {
            s.ambYielded = true;
            s.ambYields += 1;
            s.score = Math.min(100, s.score + 5);
            playBeep(880, 'sine', 0.2);
          }

          // If ambulance overtakes player and player blocked
          if (ambBehindDist < -10 && ambBehindDist > -30 && s.carLane === s.ambLane && !s.ambYielded) {
            // Violation: Failure to yield to emergency vehicle (Section 194E MVA 2019)
            if (s.simTime - s.lastViolationTime > 6) {
              s.lastViolationTime = s.simTime;
              const challan: ChallanRecord = {
                id: `TS-EVP-${Math.floor(1000 + Math.random() * 9000)}`,
                type: 'Obstruction to Emergency Ambulance (Sec 194E)',
                fine: 10000,
                section: 'Section 194E Motor Vehicles Act 2019',
                time: new Date().toLocaleTimeString('en-IN'),
                speed: Math.round(s.carSpeed),
                limit: activeLimit,
                location: currentZone.name
              };
              s.challans.unshift(challan);
              s.score = Math.max(40, s.score - 25);
              setActiveChallan(challan);
              playBeep(220, 'square', 0.35);
            }
          }

          // Reset ambulance when far ahead
          if (s.ambDist > s.carDist + 400) {
            s.ambDist = s.carDist - 350;
            s.ambYielded = false;
          }
        }

        // 7. e-Challan: Overspeeding Enforcement
        if (s.carSpeed > activeLimit + 8 && s.simTime - s.lastViolationTime > 7) {
          s.lastViolationTime = s.simTime;
          s.speedViolations += 1;
          s.score = Math.max(30, s.score - 10);
          const challan: ChallanRecord = {
            id: `TS-SPD-${Math.floor(1000 + Math.random() * 9000)}`,
            type: `Overspeeding (${Math.round(s.carSpeed)} in ${activeLimit} km/h Zone)`,
            fine: 1000,
            section: 'Section 183 MVA 2019 / CMVR 167A',
            time: new Date().toLocaleTimeString('en-IN'),
            speed: Math.round(s.carSpeed),
            limit: activeLimit,
            location: currentZone.name
          };
          s.challans.unshift(challan);
          setActiveChallan(challan);
          playBeep(180, 'sawtooth', 0.3);
        }

        // 8. e-Challan: Red Light Jump Enforcement
        if (upcomingSig && upcomingSig.state === 'RED' && upcomingSig.dist < 6 && upcomingSig.dist > -8 && s.carSpeed > 15) {
          if (s.simTime - s.lastViolationTime > 6) {
            s.lastViolationTime = s.simTime;
            s.signalViolations += 1;
            s.score = Math.max(20, s.score - 20);
            const challan: ChallanRecord = {
              id: `TS-SIG-${Math.floor(1000 + Math.random() * 9000)}`,
              type: `Red Light Violation (${upcomingSig.name})`,
              fine: 1000,
              section: 'Section 184 / 177 MVA 2019',
              time: new Date().toLocaleTimeString('en-IN'),
              speed: Math.round(s.carSpeed),
              limit: activeLimit,
              location: upcomingSig.name
            };
            s.challans.unshift(challan);
            setActiveChallan(challan);
            playBeep(150, 'sawtooth', 0.45);
          }
        }

        // 9. AI Traffic Movement
        for (const car of s.traffic) {
          const cSpeedMs = (car.speed * 1000) / 3600;
          car.dist += cSpeedMs * dt;
          if (car.dist < s.carDist - 120) car.dist = s.carDist + 350 + Math.random() * 200;
          if (car.dist > s.carDist + 500) car.dist = s.carDist - 100;

          // Traffic car yields to ambulance if ambulance is directly behind
          if (s.ambulanceActive) {
            const ambDistToTraffic = car.dist - s.ambDist;
            if (ambDistToTraffic > 0 && ambDistToTraffic < 80 && car.lane === s.ambLane) {
              car.lane = car.lane === 1 ? 0 : (car.lane === 0 ? 2 : 0);
            }
          }
          car.visualLane += (car.lane - car.visualLane) * (4 * dt);
        }
      }

      // 10. Throttle UI Sync State (every ~100ms)
      uiUpdateTimer += dt;
      if (uiUpdateTimer > 0.1) {
        uiUpdateTimer = 0;
        const currentZone = config.zones.find(z => s.carDist >= z.start && s.carDist <= z.end) || config.zones[0];
        const activeLimit = currentZone ? currentZone.limit : config.speedLimitKmh;

        let curSig = { name: 'Clear Highway', state: 'GREEN', sec: 30, dist: 999 };
        for (const sig of config.signals) {
          if (sig.dist > s.carDist - 10) {
            const cyclePhase = (s.simTime + (sig.dist * 0.05)) % sig.cycle;
            const isGreen = cyclePhase < sig.greenSec;
            const isYellow = !isGreen && cyclePhase < sig.greenSec + 4;
            curSig = {
              name: sig.name,
              state: isGreen ? 'GREEN' : isYellow ? 'YELLOW' : 'RED',
              sec: Math.max(1, Math.round(isGreen ? sig.greenSec - cyclePhase : sig.cycle - cyclePhase)),
              dist: Math.round(sig.dist - s.carDist)
            };
            break;
          }
        }

        const ambBehind = Math.round(s.carDist - s.ambDist);
        const glosaDelta = Math.abs(s.carSpeed - config.targetGlosaSpeed);
        const isMatched = glosaDelta <= 4;

        setUiStats({
          speedKmh: Math.round(s.carSpeed),
          speedLimit: activeLimit,
          currentLane: s.carLane,
          distDriven: Math.round(s.distanceDriven),
          progressPct: Math.min(100, Math.round((s.carDist / config.totalDistanceM) * 100)),
          score: Math.max(0, Math.min(100, s.score)),
          activeZone: currentZone.name,
          glosaAdvisory: isMatched 
            ? `GLOSA Synced: Maintain ${config.targetGlosaSpeed} km/h for Green Wave`
            : `Advisory: Adjust speed to ${config.targetGlosaSpeed} km/h for Green Light`,
          glosaMatched: isMatched,
          ambulanceDistBehind: ambBehind,
          ambulanceIncoming: ambBehind > 0 && ambBehind < 260,
          upcomingSignal: curSig,
          challanCount: s.challans.length
        });
      }

      // =========================================================
      // 11. CANVAS RENDERING ENGINE
      // =========================================================
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Environment Background (Grass / Roadside)
      ctx.fillStyle = config.weather === 'rain' ? '#0f172a' : '#1e293b';
      ctx.fillRect(0, 0, w, h);

      // Road Geometry (Centered 3-Lane Highway)
      const roadWidth = Math.min(w * 0.75, 420);
      const roadX = (w - roadWidth) / 2;
      const laneWidth = roadWidth / 3;

      // Asphalt Surface
      ctx.fillStyle = config.weather === 'rain' ? '#0b0f19' : '#181e2b';
      ctx.fillRect(roadX, 0, roadWidth, h);

      // Outer Road Curb / Shoulders
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(roadX - 4, 0, 4, h); // Left shoulder line
      ctx.fillRect(roadX + roadWidth, 0, 4, h); // Right shoulder line

      // Animated Scrolling Dashed Lane Dividers
      const scrollOffset = (s.carDist * 20) % 40;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([16, 20]);
      ctx.lineDashOffset = -scrollOffset;

      // Lane Line 1 (between 0 and 1)
      ctx.beginPath();
      ctx.moveTo(roadX + laneWidth, -40);
      ctx.lineTo(roadX + laneWidth, h + 40);
      ctx.stroke();

      // Lane Line 2 (between 1 and 2)
      ctx.beginPath();
      ctx.moveTo(roadX + laneWidth * 2, -40);
      ctx.lineTo(roadX + laneWidth * 2, h + 40);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // Coordinate Transform: World distance to Canvas Y
      // Car is anchored at 72% of canvas height (viewMode === 'driver')
      const carScreenY = h * 0.72;
      const pixelsPerMeter = 3.6;

      const worldToScreenY = (dist: number) => {
        return carScreenY - (dist - s.carDist) * pixelsPerMeter;
      };

      // Draw Cantilever Overhead Signals and Stop Lines
      for (const sig of config.signals) {
        const sigY = worldToScreenY(sig.dist);
        if (sigY < -80 || sigY > h + 100) continue;

        const cyclePhase = (s.simTime + (sig.dist * 0.05)) % sig.cycle;
        const isGreen = cyclePhase < sig.greenSec;
        const isYellow = !isGreen && cyclePhase < sig.greenSec + 4;
        const isRed = !isGreen && !isYellow;

        // Stop Line Striping across Road
        ctx.fillStyle = isRed ? '#ef4444' : '#ffffff';
        ctx.fillRect(roadX, sigY + 8, roadWidth, 6);

        // Stop Line Label text
        ctx.fillStyle = isRed ? '#fca5a5' : '#cbd5e1';
        ctx.font = 'bold 9px JetBrains Mono, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`STOP LINE — ${sig.name.toUpperCase()}`, roadX + 8, sigY + 22);

        // Overhead Gantries Pole Left
        ctx.fillStyle = '#475569';
        ctx.fillRect(roadX - 22, sigY - 26, 18, 8);
        ctx.fillRect(roadX - 20, sigY - 26, 4, 30);

        // 3-Color Signal Head
        ctx.fillStyle = '#0a0e17';
        ctx.beginPath();
        ctx.roundRect(roadX - 44, sigY - 32, 22, 54, 4);
        ctx.fill();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Red Lamp
        ctx.fillStyle = isRed ? '#ef4444' : '#450a0a';
        ctx.beginPath();
        ctx.arc(roadX - 33, sigY - 20, 5, 0, Math.PI * 2);
        ctx.fill();
        if (isRed) {
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Yellow Lamp
        ctx.fillStyle = isYellow ? '#eab308' : '#422006';
        ctx.beginPath();
        ctx.arc(roadX - 33, sigY - 5, 5, 0, Math.PI * 2);
        ctx.fill();

        // Green Lamp
        ctx.fillStyle = isGreen ? '#10b981' : '#022c22';
        ctx.beginPath();
        ctx.arc(roadX - 33, sigY + 10, 5, 0, Math.PI * 2);
        ctx.fill();
        if (isGreen) {
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Draw Zone Boundary Signs on Shoulder
      for (const zone of config.zones) {
        const zoneY = worldToScreenY(zone.start);
        if (zoneY > -60 && zoneY < h + 60) {
          // Circular Speed Limit Sign
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(roadX + roadWidth + 24, zoneY, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${zone.limit}`, roadX + roadWidth + 24, zoneY);
        }
      }

      // Helper to Render Detailed Vehicle
      const renderVehicleSprite = (
        x: number, 
        y: number, 
        w: number, 
        l: number, 
        color: string, 
        isAmbulance = false, 
        isPlayer = false,
        brakeActive = false
      ) => {
        ctx.save();
        ctx.translate(x, y);

        // Vehicle Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.roundRect(-w / 2 - 2, -l / 2 + 3, w + 4, l + 4, 8);
        ctx.fill();

        // Main Car Body
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(-w / 2, -l / 2, w, l, 6);
        ctx.fill();
        ctx.strokeStyle = isPlayer ? '#34d399' : 'rgba(255,255,255,0.2)';
        ctx.lineWidth = isPlayer ? 2 : 1;
        ctx.stroke();

        // Windshield (Front & Rear Glass)
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-w / 2 + 3, -l / 2 + 10, w - 6, 10); // Front windshield
        ctx.fillRect(-w / 2 + 4, l / 2 - 14, w - 8, 7);   // Rear windshield

        // Headlights (Beaming Forward)
        if (config.weather === 'night' || config.weather === 'rain' || isPlayer) {
          const grad = ctx.createLinearGradient(0, -l / 2, 0, -l / 2 - 90);
          grad.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
          grad.addColorStop(1, 'rgba(254, 240, 138, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(-w / 2 + 2, -l / 2);
          ctx.lineTo(-w / 2 - 16, -l / 2 - 90);
          ctx.lineTo(w / 2 + 16, -l / 2 - 90);
          ctx.lineTo(w / 2 - 2, -l / 2);
          ctx.fill();
        }

        // Glowing Brake Lights (when decelerating/braking)
        if (brakeActive || (isPlayer && (s.isBraking || s.isHandbrake))) {
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 14;
          ctx.fillRect(-w / 2 + 2, l / 2 - 3, 6, 3);
          ctx.fillRect(w / 2 - 8, l / 2 - 3, 6, 3);
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = '#991b1b';
          ctx.fillRect(-w / 2 + 2, l / 2 - 3, 5, 2.5);
          ctx.fillRect(w / 2 - 7, l / 2 - 3, 5, 2.5);
        }

        // Ambulance Insignia & Flashing Siren Bar
        if (isAmbulance) {
          // Red Cross on Roof
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(-2, -4, 4, 12);
          ctx.fillRect(-6, 0, 12, 4);

          // Alternating Strobe Siren Bar
          const flash = Math.floor(s.simTime * 8) % 2 === 0;
          ctx.fillStyle = flash ? '#ef4444' : '#2563eb';
          ctx.shadowColor = flash ? '#ef4444' : '#3b82f6';
          ctx.shadowBlur = 15;
          ctx.fillRect(-w / 2 + 4, -l / 2 + 2, w - 8, 5);
          ctx.shadowBlur = 0;

          // V2X Pulse Rings around Ambulance
          ctx.strokeStyle = flash ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, w + 12, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Player Tag Overhead
        if (isPlayer) {
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.roundRect(-22, l / 2 + 6, 44, 14, 4);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px JetBrains Mono, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('YOU • EV', 0, l / 2 + 13);
        }

        ctx.restore();
      };

      // Draw AI Traffic Cars
      for (const car of s.traffic) {
        const cy = worldToScreenY(car.dist);
        if (cy < -60 || cy > h + 60) continue;
        const cx = roadX + laneWidth * (car.visualLane + 0.5);
        renderVehicleSprite(cx, cy, 28, 52, car.color, false, false, false);
      }

      // Draw 108 Emergency Ambulance
      if (s.ambulanceActive) {
        const ay = worldToScreenY(s.ambDist);
        if (ay > -80 && ay < h + 80) {
          const ax = roadX + laneWidth * (s.ambLane + 0.5);
          renderVehicleSprite(ax, ay, 32, 60, '#ffffff', true, false, false);
        }
      }

      // Draw Player Car
      const playerX = roadX + laneWidth * (s.carVisualX + 0.5);
      renderVehicleSprite(
        playerX, 
        carScreenY, 
        30, 
        56, 
        '#059669', 
        false, 
        true, 
        s.isBraking || s.isHandbrake
      );

      // Rain Weather Overlay Effect
      if (config.weather === 'rain') {
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.2)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let i = 0; i < 40; i++) {
          const rx = (s.simTime * 900 + i * 47) % w;
          const ry = (s.simTime * 1400 + i * 83) % h;
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 4, ry + 16);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [selectedScenario, isAutoPilot, playBeep, playSirenBurst]);

  // Handle Touch / Button Pedals
  const handlePedalDown = (type: 'accel' | 'brake') => {
    if (type === 'accel') {
      sim.current.isAccelerating = true;
      sim.current.isBraking = false;
    } else {
      sim.current.isBraking = true;
      sim.current.isAccelerating = false;
      playBeep(220, 'square', 0.1);
    }
  };

  const handlePedalUp = (type: 'accel' | 'brake') => {
    if (type === 'accel') sim.current.isAccelerating = false;
    if (type === 'brake') sim.current.isBraking = false;
  };

  const handleLaneChange = (dir: 'left' | 'right') => {
    if (dir === 'left' && sim.current.carLane > 0) {
      sim.current.carLane -= 1;
      playBeep(480, 'triangle', 0.08);
    } else if (dir === 'right' && sim.current.carLane < 2) {
      sim.current.carLane += 1;
      playBeep(480, 'triangle', 0.08);
    }
  };

  const dispatchAmbulance = () => {
    sim.current.ambulanceActive = true;
    sim.current.ambDist = sim.current.carDist - 240;
    sim.current.ambYielded = false;
    playSirenBurst();
  };

  return (
    <div className={`space-y-6 ${isEmbedded ? '' : 'py-2'}`}>
      
      {/* 1. Header & Live Telemetry Ribbon */}
      <div className="bg-[#0A111F] border border-slate-800 rounded-3xl p-5 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black shadow-lg">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Live Experience — Interactive Driving & V2X Ambulance Simulator
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold animate-pulse">
                  60 FPS ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Drive manually with WASD/pedals or activate AI Autopilot • Experience GLOSA green-wave and clear lanes for 108 emergency ambulances.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                soundEnabled 
                  ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-750' 
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
              title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* AI Autopilot Switch */}
            <button
              onClick={() => setIsAutoPilot(!isAutoPilot)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isAutoPilot 
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{isAutoPilot ? 'Autopilot: Active' : 'Manual Driving'}</span>
            </button>

            {/* Emergency Ambulance Dispatch */}
            <button
              onClick={dispatchAmbulance}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/20 transition-all cursor-pointer active:scale-95"
            >
              <Siren className="w-3.5 h-3.5 animate-bounce" />
              <span>Dispatch 108 Ambulance</span>
            </button>

            {/* Reset Scenario */}
            <button
              onClick={() => resetScenario(selectedScenario)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              title="Reset Corridor"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-Time Live HUD Dashboard Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 text-xs font-mono">
          {/* 1. Speed Gauge */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Speed</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-white">{uiStats.speedKmh}</span>
                <span className="text-[10px] text-slate-400">km/h</span>
              </div>
              <span className="text-[10px] text-slate-400">Limit: {uiStats.speedLimit}</span>
            </div>
          </div>

          {/* 2. GLOSA Advisory */}
          <div className={`border rounded-2xl p-3 flex items-center gap-3 ${
            uiStats.glosaMatched 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
              : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
          }`}>
            <div className="p-2 rounded-xl bg-white/10 shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider block font-bold">GLOSA Wave</span>
              <div className="text-xs font-black truncate">{selectedScenario.targetGlosaSpeed} km/h</div>
              <span className="text-[9px] block truncate">{uiStats.glosaMatched ? 'Wave Locked' : 'Adjust Speed'}</span>
            </div>
          </div>

          {/* 3. Upcoming Signal */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <div className={`w-3.5 h-8 rounded bg-black flex flex-col items-center justify-between p-0.5 shrink-0 border border-slate-700`}>
              <span className={`w-1.5 h-1.5 rounded-full ${uiStats.upcomingSignal.state === 'RED' ? 'bg-red-500 animate-pulse' : 'bg-slate-800'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${uiStats.upcomingSignal.state === 'YELLOW' ? 'bg-amber-400' : 'bg-slate-800'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${uiStats.upcomingSignal.state === 'GREEN' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-800'}`} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Signal</span>
              <span className={`text-xs font-black block ${uiStats.upcomingSignal.state === 'RED' ? 'text-red-400' : 'text-emerald-400'}`}>
                {uiStats.upcomingSignal.state} ({uiStats.upcomingSignal.sec}s)
              </span>
              <span className="text-[10px] text-slate-400 truncate block">{uiStats.upcomingSignal.dist}m ahead</span>
            </div>
          </div>

          {/* 4. 108 Ambulance Status */}
          <div className={`border rounded-2xl p-3 flex items-center gap-3 ${
            uiStats.ambulanceIncoming 
              ? 'bg-red-950/60 border-red-500/80 text-red-200 animate-pulse' 
              : 'bg-slate-900/90 border-slate-800 text-slate-300'
          }`}>
            <div className={`p-2 rounded-xl shrink-0 ${uiStats.ambulanceIncoming ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
              <Siren className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider block font-bold">108 Ambulance</span>
              <div className="text-xs font-black truncate">
                {uiStats.ambulanceDistBehind > 0 ? `${uiStats.ambulanceDistBehind}m Behind` : 'Passed Clear'}
              </div>
              <span className="text-[9px] block text-red-400 font-bold truncate">
                {uiStats.ambulanceIncoming ? 'CLEAR CENTER LANE' : 'Corridor Normal'}
              </span>
            </div>
          </div>

          {/* 5. Driver Safety Score */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Safety Score</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-white">{uiStats.score}</span>
                <span className="text-[10px] text-slate-400">/100</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">Grade A+ (Safe)</span>
            </div>
          </div>

          {/* 6. Active Challans Counter */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Violations</span>
              <span className={`text-xl font-black block ${uiStats.challanCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {uiStats.challanCount} Cases
              </span>
              <span className="text-[10px] text-slate-400">Instant e-Challan</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Simulation Studio Layout (Canvas + Tactical Controls) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left 8 Cols: Interactive Canvas Simulation View */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          
          {/* Mission & View Mode Switcher Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 p-2.5 rounded-2xl shadow-2xs">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
              {SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => resetScenario(sc)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    selectedScenario.id === sc.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {sc.id === 'hitec_glosa' && '🏢 Hitec Rush'}
                  {sc.id === 'apollo_ambulance' && '🚑 Apollo Hospital'}
                  {sc.id === 'school_zone' && '🎒 School Zone'}
                  {sc.id === 'orr_express' && '🛣️ ORR Highway'}
                  {sc.id === 'monsoon_night' && '🌧️ Monsoon Rain'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCertificate(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>View Certificate</span>
              </button>
            </div>
          </div>

          {/* Canvas Interactive Screen */}
          <div className="relative w-full h-[520px] rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair"
              style={{ touchAction: 'none' }}
            />

            {/* Overlay Ambulance Siren Flasher Banner */}
            {uiStats.ambulanceIncoming && (
              <div className="absolute top-4 inset-x-6 z-20 bg-red-600/90 backdrop-blur-md text-white border-2 border-white rounded-2xl p-2.5 shadow-2xl flex items-center justify-between px-5 animate-pulse">
                <div className="flex items-center gap-2.5">
                  <Siren className="w-6 h-6 animate-bounce" />
                  <div>
                    <span className="text-xs font-black tracking-wider uppercase block">
                      🚨 EMERGENCY VEHICLE APPROACHING — {uiStats.ambulanceDistBehind}m BEHIND
                    </span>
                    <span className="text-[11px] font-mono text-red-100">
                      V2X Priority Preemption active: Move to Left or Right lane immediately!
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleLaneChange('left')}
                  className="px-3 py-1 bg-white text-red-700 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-red-50 cursor-pointer shadow-md"
                >
                  Yield Left ◀
                </button>
              </div>
            )}

            {/* On-Screen Steering & Pedal Controls (Desktop & Mobile Touch) */}
            <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
              
              {/* Left Group: Lane Steer Buttons */}
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={() => handleLaneChange('left')}
                  className="w-14 h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-2xl flex flex-col items-center justify-center font-bold text-xs active:scale-95 transition-all cursor-pointer backdrop-blur-md"
                  title="Steer Left (A / Left Arrow)"
                >
                  <ArrowLeft className="w-5 h-5 text-emerald-400" />
                  <span className="text-[9px] font-mono">LEFT</span>
                </button>
                <button
                  onClick={() => handleLaneChange('right')}
                  className="w-14 h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-2xl flex flex-col items-center justify-center font-bold text-xs active:scale-95 transition-all cursor-pointer backdrop-blur-md"
                  title="Steer Right (D / Right Arrow)"
                >
                  <ArrowRight className="w-5 h-5 text-emerald-400" />
                  <span className="text-[9px] font-mono">RIGHT</span>
                </button>
              </div>

              {/* Center: Live Speed & Lane Badge */}
              <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-2xl px-4 py-2 text-center text-white pointer-events-auto shadow-2xl">
                <div className="text-[9px] font-mono uppercase tracking-widest text-slate-400">
                  {selectedScenario.roadName}
                </div>
                <div className="text-sm font-black text-emerald-400">
                  LANE {uiStats.currentLane === 0 ? '1 (LEFT)' : uiStats.currentLane === 1 ? '2 (CENTER)' : '3 (RIGHT)'}
                </div>
              </div>

              {/* Right Group: Gas & Brake Pedals */}
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onMouseDown={() => handlePedalDown('brake')}
                  onMouseUp={() => handlePedalUp('brake')}
                  onTouchStart={() => handlePedalDown('brake')}
                  onTouchEnd={() => handlePedalUp('brake')}
                  className="w-16 h-16 rounded-2xl bg-red-600/90 hover:bg-red-500 text-white border border-red-400/80 shadow-2xl flex flex-col items-center justify-center font-black text-xs active:scale-90 transition-all cursor-pointer backdrop-blur-md"
                  title="Brake Pedal (S / Down Arrow)"
                >
                  <ArrowDown className="w-5 h-5 text-white" />
                  <span className="text-[10px] font-mono">BRAKE</span>
                </button>
                <button
                  onMouseDown={() => handlePedalDown('accel')}
                  onMouseUp={() => handlePedalUp('accel')}
                  onTouchStart={() => handlePedalDown('accel')}
                  onTouchEnd={() => handlePedalUp('accel')}
                  className="w-16 h-20 rounded-2xl bg-emerald-600/90 hover:bg-emerald-500 text-white border border-emerald-400/80 shadow-2xl flex flex-col items-center justify-center font-black text-xs active:scale-90 transition-all cursor-pointer backdrop-blur-md"
                  title="Accelerator Pedal (W / Up Arrow)"
                >
                  <ArrowUp className="w-6 h-6 text-white" />
                  <span className="text-[11px] font-mono">GAS</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Tactical Scenario Objectives & Violations Console */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          
          {/* Card 1: Active Mission Briefing */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 font-mono flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Active Mission Briefing
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {selectedScenario.weather.toUpperCase()}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {selectedScenario.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {selectedScenario.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Speed Tolerance</span>
                <span className="font-bold text-slate-900">{selectedScenario.speedLimitKmh} km/h Max</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">GLOSA Green Wave</span>
                <span className="font-bold text-emerald-600">{selectedScenario.targetGlosaSpeed} km/h Target</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">Corridor Length</span>
                <span className="font-bold text-slate-900">{selectedScenario.totalDistanceM} meters</span>
              </div>
            </div>
          </div>

          {/* Card 2: Instant e-Challan Feed / Live Enforcement Log */}
          <div className="bg-[#0A111F] rounded-3xl border border-slate-800 shadow-xl p-5 text-white flex-1 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-black uppercase tracking-wider font-mono">
                  Instant e-Challan Queue
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
                CMVR 167A
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 max-h-56 pr-1">
              {sim.current.challans.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400/60" />
                  <span className="text-xs font-bold text-slate-300">Clean Driving Record</span>
                  <p className="text-[11px] text-slate-400">
                    No traffic violations logged. Obey speed limits and clear center lanes for ambulances.
                  </p>
                </div>
              ) : (
                sim.current.challans.map((ch) => (
                  <div
                    key={ch.id}
                    className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs font-mono space-y-1 animate-in fade-in zoom-in-95 duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[11px]">{ch.id}</span>
                      <span className="font-black text-rose-400">₹{ch.fine.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-[10px] text-rose-300 font-bold leading-tight">
                      {ch.type}
                    </div>
                    <div className="text-[9px] text-slate-400 flex items-center justify-between">
                      <span>{ch.location}</span>
                      <span>{ch.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Action Button */}
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  if (onNavigateTab) onNavigateTab('citizen_portal');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Open Citizen e-Challan Portal</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Violation Popup Modal (Flashes on Red Light / Overspeeding) */}
      {activeChallan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border-2 border-red-500 shadow-2xl max-w-md w-full p-6 text-slate-900 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-300 flex items-center justify-center text-red-600 font-black">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-red-600 font-mono tracking-wider block">
                    Automated Notice Generated
                  </span>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    Traffic Violation Notice (e-Challan)
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveChallan(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-red-50/80 border border-red-200 text-xs font-mono space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Notice ID</span>
                <span className="font-bold text-slate-900">{activeChallan.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Offense</span>
                <span className="font-bold text-red-700 text-right">{activeChallan.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Legal Clause</span>
                <span className="font-bold text-slate-800 text-[10px]">{activeChallan.section}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Recorded Speed</span>
                <span className="font-bold text-red-700">{activeChallan.speed} km/h (Limit: {activeChallan.limit})</span>
              </div>
              <div className="flex items-center justify-between border-t border-red-200 pt-1.5">
                <span className="font-bold text-slate-700">Compounding Fee</span>
                <span className="text-base font-black text-red-600">₹{activeChallan.fine.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setActiveChallan(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors shadow-sm"
              >
                Acknowledge & Resume
              </button>
              <button
                onClick={() => {
                  setActiveChallan(null);
                  if (onNavigateTab) onNavigateTab('citizen_portal');
                }}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer transition-colors shadow-sm"
              >
                Pay Online
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Safety Assessment Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border-4 border-emerald-500 shadow-2xl max-w-xl w-full p-8 text-slate-900 space-y-6 relative">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold cursor-pointer"
            >
              ✕
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mb-2 border-2 border-emerald-500">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                Certificate of Safe Autonomous Driving
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Telangana State Police & RoadSense AI Pilot Corridor Assessment
              </p>
            </div>

            {/* Candidate & Assessment Details */}
            <div className="border-t border-b border-slate-200 py-4 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Driver Name</span>
                <span className="font-bold text-slate-900">{user?.full_name || 'Devanaboina Tharun'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Vehicle Identifier</span>
                <span className="font-bold text-slate-900">{user?.vehicle_plate || 'TS 09 EV 4412'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Corridor Route</span>
                <span className="font-bold text-slate-900">{selectedScenario.roadName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Distance Evaluated</span>
                <span className="font-bold text-slate-900">{uiStats.distDriven} meters</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">GLOSA Wave Synchronization</span>
                <span className="font-bold text-emerald-700">92.4% (Green Wave Maintained)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Ambulance Emergency Yielding</span>
                <span className="font-bold text-emerald-700">Prompt & Compliant (Sec 194E)</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800">Final Safety Rating</span>
                <span className="text-lg font-black text-emerald-600">{uiStats.score} / 100 • Grade A+</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Verified by RoadSense Edge V2X RIU</span>
              <span>Authenticity Hash: RS-{Math.random().toString(36).substring(2, 9).toUpperCase()}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
