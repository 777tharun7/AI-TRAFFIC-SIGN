import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Pause, RotateCcw, Siren, ShieldAlert, Award, Volume2, 
  VolumeX, Radio, Sparkles, Navigation, Gauge, FileText, 
  CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, ArrowUp, 
  ArrowDown, Car, Shield, Eye, Flame, MapPin, Zap, UserCheck,
  Camera, Sliders, Crosshair, Check, ChevronRight, Activity, Clock
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
  initialAmbulanceDist: number;
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
    initialAmbulanceDist: -220,
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

  // Active Mission & Visual Features Configuration
  const [selectedScenario, setSelectedScenario] = useState<ScenarioConfig>(SCENARIOS[0]);
  const [cameraPerspective, setCameraPerspective] = useState<'3d_chase' | 'top_down'>('3d_chase');
  const [showAiVision, setShowAiVision] = useState<boolean>(true);
  const [isAutoPilot, setIsAutoPilot] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [activeChallan, setActiveChallan] = useState<ChallanRecord | null>(null);
  const [cameraFlash, setCameraFlash] = useState<boolean>(false);
  const [turnIndicator, setTurnIndicator] = useState<'none' | 'left' | 'right'>('none');
  const [isSimRunning, setIsSimRunning] = useState<boolean>(false);

  // Game/Simulation Mutable State Ref (for 60fps canvas loop)
  const sim = useRef({
    isRunning: false,
    simTime: 0,
    // Player Car Dynamics
    carDist: 40,           // meters along corridor
    carSpeed: 38,          // km/h
    targetSpeed: 42,       // km/h
    carLane: 1,            // 0=Left, 1=Center, 2=Right
    carVisualX: 1,         // interpolated 0.0 - 2.0
    steeringAngle: 0,      // degrees -20 to +20
    isBraking: false,
    isAccelerating: false,
    isHandbrake: false,
    // Ambulance State
    ambulanceActive: true,
    ambDist: -280,         // meters
    ambSpeed: 68,          // km/h
    ambLane: 1,            // usually center lane
    ambYielded: false,
    // Scoring & Objectives
    score: 95,
    speedViolations: 0,
    signalViolations: 0,
    ambYields: 0,
    greenWaveCount: 0,
    distanceDriven: 0,
    // Traffic Cars
    traffic: [
      { id: 'c1', dist: 120, lane: 0, visualLane: 0, speed: 42, color: '#38bdf8', type: 'Sedan' },
      { id: 'c2', dist: 220, lane: 2, visualLane: 2, speed: 45, color: '#fbbf24', type: 'Auto' },
      { id: 'c3', dist: 480, lane: 1, visualLane: 1, speed: 38, color: '#a855f7', type: 'SUV' },
      { id: 'c4', dist: 720, lane: 0, visualLane: 0, speed: 44, color: '#f43f5e', type: 'Sedan' },
      { id: 'c5', dist: 960, lane: 2, visualLane: 2, speed: 40, color: '#34d399', type: 'Bus' }
    ],
    // Challans history
    challans: [] as ChallanRecord[],
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
    challanCount: 0,
    objectives: {
      glosaWave: true,
      ambulanceYield: false,
      signalClear: true,
      speedCompliance: true
    }
  });

  // Web Audio Context for Authentic Dynamic Sound Synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);
  const motorOscRef = useRef<OscillatorNode | null>(null);
  const motorGainRef = useRef<GainNode | null>(null);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;

      // Electric motor whine oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      motorOscRef.current = osc;
      motorGainRef.current = gain;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playBeep = useCallback((freq = 580, type: OscillatorType = 'sine', duration = 0.12) => {
    if (!soundEnabled) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
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
  }, [soundEnabled, initAudio]);

  const playSirenBurst = useCallback(() => {
    if (!soundEnabled) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
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
  }, [soundEnabled, initAudio]);

  const playCameraShutter = useCallback(() => {
    if (!soundEnabled) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // silent
    }
  }, [soundEnabled, initAudio]);

  // Restart / Switch Scenario
  const resetScenario = useCallback((scenario: ScenarioConfig) => {
    setSelectedScenario(scenario);
    sim.current.simTime = 0;
    sim.current.carDist = 40;
    sim.current.carSpeed = Math.min(38, scenario.speedLimitKmh * 0.8);
    sim.current.targetSpeed = scenario.targetGlosaSpeed;
    sim.current.carLane = 1;
    sim.current.carVisualX = 1;
    sim.current.steeringAngle = 0;
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

  const handleTogglePlay = useCallback(() => {
    const next = !sim.current.isRunning;
    sim.current.isRunning = next;
    setIsSimRunning(next);
    if (next) {
      initAudio();
      playBeep(520, 'sine', 0.1);
    }
  }, [initAudio, playBeep]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (!sim.current.isRunning) {
          sim.current.isRunning = true;
          setIsSimRunning(true);
        }
        sim.current.isAccelerating = true;
        sim.current.isBraking = false;
        initAudio();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        sim.current.isBraking = true;
        sim.current.isAccelerating = false;
        initAudio();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (sim.current.carLane > 0) {
          sim.current.carLane -= 1;
          sim.current.steeringAngle = -18;
          setTurnIndicator('left');
          playBeep(480, 'triangle', 0.08);
          setTimeout(() => { sim.current.steeringAngle = 0; setTurnIndicator('none'); }, 300);
        }
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (sim.current.carLane < 2) {
          sim.current.carLane += 1;
          sim.current.steeringAngle = 18;
          setTurnIndicator('right');
          playBeep(480, 'triangle', 0.08);
          setTimeout(() => { sim.current.steeringAngle = 0; setTurnIndicator('none'); }, 300);
        }
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        sim.current.isHandbrake = true;
        sim.current.isBraking = true;
      } else if (e.key === 'p' || e.key === 'P') {
        const next = !sim.current.isRunning;
        sim.current.isRunning = next;
        setIsSimRunning(next);
        if (next) initAudio();
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
  }, [playBeep, initAudio]);

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
            s.isBraking = true;
            s.isAccelerating = false;
          } else if (upcomingSig && upcomingSig.state === 'GREEN' && upcomingSig.dist < 150) {
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
            if (s.carSpeed < activeLimit - 4) {
              s.isAccelerating = true;
              s.isBraking = false;
            } else {
              s.isAccelerating = false;
            }
          }

          const ambDistBehind = s.carDist - s.ambDist;
          if (s.ambulanceActive && ambDistBehind > 0 && ambDistBehind < 180 && s.carLane === s.ambLane) {
            if (s.carLane > 0) s.carLane = 0;
            else s.carLane = 2;
          }
        }

        // 4. Vehicle Longitudinal Physics
        const accelRate = config.weather === 'rain' ? 12 : 16;
        const brakeRate = config.weather === 'rain' ? 24 : 36;
        const dragRate = 4.5;

        if (s.isHandbrake) {
          s.carSpeed = Math.max(0, s.carSpeed - brakeRate * 1.5 * dt);
        } else if (s.isBraking) {
          s.carSpeed = Math.max(0, s.carSpeed - brakeRate * dt);
        } else if (s.isAccelerating) {
          s.carSpeed = Math.min(activeLimit + 30, s.carSpeed + accelRate * dt);
        } else {
          s.carSpeed = Math.max(0, s.carSpeed - dragRate * dt);
        }

        const speedMs = (s.carSpeed * 1000) / 3600;
        s.carDist += speedMs * dt;
        s.distanceDriven += speedMs * dt;

        // Modulate continuous EV motor audio synthesizer pitch
        if (motorOscRef.current && motorGainRef.current && soundEnabled && audioCtxRef.current) {
          const targetFreq = 100 + (s.carSpeed * 5.2);
          motorOscRef.current.frequency.setTargetAtTime(targetFreq, audioCtxRef.current.currentTime, 0.08);
          const targetGain = s.isAccelerating ? 0.05 : 0.02;
          motorGainRef.current.gain.setTargetAtTime(targetGain, audioCtxRef.current.currentTime, 0.08);
        }

        // Loop corridor seamlessly
        if (s.carDist > config.totalDistanceM) {
          s.carDist = 30;
          s.ambDist = s.carDist + config.initialAmbulanceDist;
        }

        // 5. Lateral Spring Smoothing
        const laneLerpSpeed = 10;
        s.carVisualX += (s.carLane - s.carVisualX) * (laneLerpSpeed * dt);

        // 6. Ambulance Logic & Emergency Preemption
        if (s.ambulanceActive) {
          const ambSpeedMs = (s.ambSpeed * 1000) / 3600;
          s.ambDist += ambSpeedMs * dt;

          const ambBehindDist = s.carDist - s.ambDist;

          if (ambBehindDist > 0 && ambBehindDist < 250 && Math.floor(s.simTime * 2.5) % 3 === 0) {
            playSirenBurst();
          }

          if (ambBehindDist > 0 && ambBehindDist < 60 && s.carLane !== s.ambLane && !s.ambYielded) {
            s.ambYielded = true;
            s.ambYields += 1;
            s.score = Math.min(100, s.score + 5);
            playBeep(880, 'sine', 0.2);
          }

          if (ambBehindDist < -10 && ambBehindDist > -30 && s.carLane === s.ambLane && !s.ambYielded) {
            if (s.simTime - s.lastViolationTime > 6) {
              s.lastViolationTime = s.simTime;
              setCameraFlash(true);
              setTimeout(() => setCameraFlash(false), 250);
              playCameraShutter();
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
            }
          }

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
          setCameraFlash(true);
          setTimeout(() => setCameraFlash(false), 250);
          playCameraShutter();
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
        }

        // 8. e-Challan: Red Light Jump Enforcement
        if (upcomingSig && upcomingSig.state === 'RED' && upcomingSig.dist < 6 && upcomingSig.dist > -8 && s.carSpeed > 15) {
          if (s.simTime - s.lastViolationTime > 6) {
            s.lastViolationTime = s.simTime;
            s.signalViolations += 1;
            s.score = Math.max(20, s.score - 20);
            setCameraFlash(true);
            setTimeout(() => setCameraFlash(false), 250);
            playCameraShutter();
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
          }
        }

        // 9. AI Traffic Movement
        for (const car of s.traffic) {
          const cSpeedMs = (car.speed * 1000) / 3600;
          car.dist += cSpeedMs * dt;
          if (car.dist < s.carDist - 120) car.dist = s.carDist + 350 + Math.random() * 200;
          if (car.dist > s.carDist + 500) car.dist = s.carDist - 100;

          if (s.ambulanceActive) {
            const ambDistToTraffic = car.dist - s.ambDist;
            if (ambDistToTraffic > 0 && ambDistToTraffic < 80 && car.lane === s.ambLane) {
              car.lane = car.lane === 1 ? 0 : (car.lane === 0 ? 2 : 0);
            }
          }
          car.visualLane += (car.lane - car.visualLane) * (4 * dt);
        }
      }

      // 10. Throttle UI Sync State (10 Hz)
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
          challanCount: s.challans.length,
          objectives: {
            glosaWave: isMatched,
            ambulanceYield: s.ambYielded || ambBehind > 300,
            signalClear: curSig.state === 'GREEN',
            speedCompliance: s.carSpeed <= activeLimit
          }
        });
      }

      // =========================================================
      // 11. ADVANCED CANVAS RENDERING ENGINE
      // =========================================================
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Sky & Horizon Gradient
      const is3D = cameraPerspective === '3d_chase';
      const horizonY = is3D ? h * 0.22 : 0;

      if (is3D) {
        const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
        skyGrad.addColorStop(0, config.weather === 'night' ? '#030712' : '#0f172a');
        skyGrad.addColorStop(1, config.weather === 'rain' ? '#1e293b' : '#334155');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, horizonY);

        // Distant Horizon Cyber Skyline silhouette
        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        for (let bx = 0; bx < w; bx += 32) {
          const bh = 15 + Math.sin(bx * 0.05) * 12;
          ctx.rect(bx, horizonY - bh, 28, bh);
        }
        ctx.fill();
      }

      // Ground (Roadside Terrain)
      ctx.fillStyle = config.weather === 'rain' ? '#0f172a' : '#1e293b';
      ctx.fillRect(0, horizonY, w, h - horizonY);

      // Road Geometry Calculation
      const roadBottomWidth = Math.min(w * 0.85, 460);
      const roadTopWidth = is3D ? roadBottomWidth * 0.42 : roadBottomWidth;
      const roadBottomX = (w - roadBottomWidth) / 2;
      const roadTopX = (w - roadTopWidth) / 2;

      // Draw Perspective Asphalt Polygon
      ctx.fillStyle = config.weather === 'rain' ? '#0b0f19' : '#141a29';
      ctx.beginPath();
      ctx.moveTo(roadTopX, horizonY);
      ctx.lineTo(roadTopX + roadTopWidth, horizonY);
      ctx.lineTo(roadBottomX + roadBottomWidth, h);
      ctx.lineTo(roadBottomX, h);
      ctx.closePath();
      ctx.fill();

      // Outer Curb / Shoulder Stripes
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = is3D ? 3.5 : 4;
      ctx.beginPath();
      ctx.moveTo(roadTopX, horizonY);
      ctx.lineTo(roadBottomX, h);
      ctx.moveTo(roadTopX + roadTopWidth, horizonY);
      ctx.lineTo(roadBottomX + roadBottomWidth, h);
      ctx.stroke();

      // Coordinate Transform: World distance to Canvas (Y & X scale)
      const carScreenY = h * 0.74;
      const pixelsPerMeter = is3D ? 3.4 : 3.6;

      const worldToScreen = (dist: number, visualLane: number) => {
        const rawY = carScreenY - (dist - s.carDist) * pixelsPerMeter;
        if (!is3D) {
          const lW = roadBottomWidth / 3;
          return {
            x: roadBottomX + lW * (visualLane + 0.5),
            y: rawY,
            scale: 1
          };
        }
        // Perspective Depth factor (t: 0 at horizon, 1 at bottom)
        const t = Math.max(0.08, Math.min(1.4, (rawY - horizonY) / (h - horizonY)));
        const curRoadW = roadTopWidth + (roadBottomWidth - roadTopWidth) * t;
        const curRoadX = roadTopX + (roadBottomX - roadTopX) * t;
        const curLaneW = curRoadW / 3;
        const curX = curRoadX + curLaneW * (visualLane + 0.5);
        return {
          x: curX,
          y: rawY,
          scale: Math.max(0.45, Math.min(1.3, t * 1.15))
        };
      };

      // Draw Scrolling Lane Dividers
      const scrollOffset = (s.carDist * 22) % 40;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([16, 20]);
      ctx.lineDashOffset = -scrollOffset;

      // Divider 1 (Left / Center)
      ctx.beginPath();
      ctx.moveTo(roadTopX + roadTopWidth / 3, horizonY);
      ctx.lineTo(roadBottomX + roadBottomWidth / 3, h);
      ctx.stroke();

      // Divider 2 (Center / Right)
      ctx.beginPath();
      ctx.moveTo(roadTopX + (roadTopWidth / 3) * 2, horizonY);
      ctx.lineTo(roadBottomX + (roadBottomWidth / 3) * 2, h);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Signals and Stop Lines
      for (const sig of config.signals) {
        const pos = worldToScreen(sig.dist, 1);
        if (pos.y < horizonY - 40 || pos.y > h + 100) continue;

        const cyclePhase = (s.simTime + (sig.dist * 0.05)) % sig.cycle;
        const isGreen = cyclePhase < sig.greenSec;
        const isYellow = !isGreen && cyclePhase < sig.greenSec + 4;
        const isRed = !isGreen && !isYellow;

        // Perspective Stop Line Striping across Road
        const curRoadW = is3D ? roadTopWidth + (roadBottomWidth - roadTopWidth) * ((pos.y - horizonY) / (h - horizonY)) : roadBottomWidth;
        const curRoadX = is3D ? roadTopX + (roadBottomX - roadTopX) * ((pos.y - horizonY) / (h - horizonY)) : roadBottomX;

        ctx.fillStyle = isRed ? '#ef4444' : '#ffffff';
        ctx.fillRect(curRoadX, pos.y + 6, curRoadW, 6 * pos.scale);

        // AI Detection Ray Vector & Stop Line Bounding Box
        if (showAiVision) {
          ctx.strokeStyle = isRed ? '#ef4444' : '#10b981';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(worldToScreen(s.carDist, s.carVisualX).x, carScreenY);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();

          // Reticle tag
          ctx.fillStyle = isRed ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)';
          ctx.beginPath();
          ctx.roundRect(curRoadX + 6, pos.y - 20 * pos.scale, 160 * pos.scale, 16 * pos.scale, 4);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.round(9 * pos.scale)}px JetBrains Mono, monospace`;
          ctx.textAlign = 'left';
          ctx.fillText(`SPaT SIGNAL • ${isRed ? 'RED' : isGreen ? 'GREEN' : 'AMBER'} 0.99 [${Math.round(sig.dist - s.carDist)}m]`, curRoadX + 10, pos.y - 8 * pos.scale);
        }

        // Overhead Signal Cantilever Head
        ctx.fillStyle = '#0a0e17';
        ctx.beginPath();
        ctx.roundRect(curRoadX - 35 * pos.scale, pos.y - 32 * pos.scale, 24 * pos.scale, 56 * pos.scale, 4);
        ctx.fill();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Lamps
        ctx.fillStyle = isRed ? '#ef4444' : '#450a0a';
        ctx.beginPath();
        ctx.arc(curRoadX - 23 * pos.scale, pos.y - 20 * pos.scale, 5 * pos.scale, 0, Math.PI * 2);
        ctx.fill();
        if (isRed) {
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = isYellow ? '#eab308' : '#422006';
        ctx.beginPath();
        ctx.arc(curRoadX - 23 * pos.scale, pos.y - 4 * pos.scale, 5 * pos.scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isGreen ? '#10b981' : '#022c22';
        ctx.beginPath();
        ctx.arc(curRoadX - 23 * pos.scale, pos.y + 12 * pos.scale, 5 * pos.scale, 0, Math.PI * 2);
        ctx.fill();
        if (isGreen) {
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Draw Zone Speed Limit Signs
      for (const zone of config.zones) {
        const pos = worldToScreen(zone.start, 2.5);
        if (pos.y > horizonY && pos.y < h + 50) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(pos.x + 16, pos.y, 14 * pos.scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 3 * pos.scale;
          ctx.stroke();

          ctx.fillStyle = '#0f172a';
          ctx.font = `bold ${Math.round(11 * pos.scale)}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${zone.limit}`, pos.x + 16, pos.y);

          // AI Vision Tag
          if (showAiVision) {
            ctx.fillStyle = 'rgba(59, 130, 246, 0.85)';
            ctx.beginPath();
            ctx.roundRect(pos.x - 30, pos.y - 28 * pos.scale, 85 * pos.scale, 14 * pos.scale, 3);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.round(8 * pos.scale)}px JetBrains Mono, monospace`;
            ctx.fillText(`IRC:67 0.96`, pos.x + 12, pos.y - 20 * pos.scale);
          }
        }
      }

      // Helper to Render Detailed Realistic Vehicle with AI Bounding Box
      const renderVehicleSprite = (
        x: number, 
        y: number, 
        baseW: number, 
        baseL: number, 
        color: string, 
        scale = 1,
        isAmbulance = false, 
        isPlayer = false,
        brakeActive = false,
        label = ''
      ) => {
        const w = baseW * scale;
        const l = baseL * scale;

        ctx.save();
        ctx.translate(x, y);

        // Steering Tilt in 3D Chase mode
        if (isPlayer && is3D && sim.current.steeringAngle !== 0) {
          ctx.rotate((sim.current.steeringAngle * Math.PI) / 180);
        }

        // Vehicle Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.roundRect(-w / 2 - 2, -l / 2 + 4, w + 4, l + 4, 8 * scale);
        ctx.fill();

        // Main Car Body
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(-w / 2, -l / 2, w, l, 6 * scale);
        ctx.fill();
        ctx.strokeStyle = isPlayer ? '#34d399' : 'rgba(255,255,255,0.2)';
        ctx.lineWidth = isPlayer ? 2 : 1;
        ctx.stroke();

        // Windshields
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-w / 2 + 3 * scale, -l / 2 + 10 * scale, w - 6 * scale, 10 * scale);
        ctx.fillRect(-w / 2 + 4 * scale, l / 2 - 14 * scale, w - 8 * scale, 7 * scale);

        // Headlight Beams
        if (config.weather === 'night' || config.weather === 'rain' || isPlayer) {
          const grad = ctx.createLinearGradient(0, -l / 2, 0, -l / 2 - 100 * scale);
          grad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
          grad.addColorStop(1, 'rgba(254, 240, 138, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(-w / 2 + 2, -l / 2);
          ctx.lineTo(-w / 2 - 22 * scale, -l / 2 - 100 * scale);
          ctx.lineTo(w / 2 + 22 * scale, -l / 2 - 100 * scale);
          ctx.lineTo(w / 2 - 2, -l / 2);
          ctx.fill();
        }

        // Brake Lights
        if (brakeActive || (isPlayer && (s.isBraking || s.isHandbrake))) {
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 16 * scale;
          ctx.fillRect(-w / 2 + 2 * scale, l / 2 - 4 * scale, 7 * scale, 4 * scale);
          ctx.fillRect(w / 2 - 9 * scale, l / 2 - 4 * scale, 7 * scale, 4 * scale);
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = '#991b1b';
          ctx.fillRect(-w / 2 + 2 * scale, l / 2 - 3 * scale, 5 * scale, 2.5 * scale);
          ctx.fillRect(w / 2 - 7 * scale, l / 2 - 3 * scale, 5 * scale, 2.5 * scale);
        }

        // Ambulance Strobe & Cross
        if (isAmbulance) {
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(-2 * scale, -5 * scale, 4 * scale, 12 * scale);
          ctx.fillRect(-6 * scale, -1 * scale, 12 * scale, 4 * scale);

          const flash = Math.floor(s.simTime * 8) % 2 === 0;
          ctx.fillStyle = flash ? '#ef4444' : '#2563eb';
          ctx.shadowColor = flash ? '#ef4444' : '#3b82f6';
          ctx.shadowBlur = 20 * scale;
          ctx.fillRect(-w / 2 + 4 * scale, -l / 2 + 2 * scale, w - 8 * scale, 5 * scale);
          ctx.shadowBlur = 0;

          // Radial Pulse Rings
          ctx.strokeStyle = flash ? 'rgba(239, 68, 68, 0.45)' : 'rgba(59, 130, 246, 0.45)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, w + 14 * scale, 0, Math.PI * 2);
          ctx.stroke();
        }

        // AI Vision Bounding Box Overlay
        if (showAiVision) {
          const pad = 4 * scale;
          ctx.strokeStyle = isAmbulance ? '#ef4444' : isPlayer ? '#10b981' : '#06b6d4';
          ctx.lineWidth = 1.5;

          // Corner brackets
          const cl = 6 * scale;
          ctx.beginPath();
          // Top-Left
          ctx.moveTo(-w / 2 - pad, -l / 2 - pad + cl);
          ctx.lineTo(-w / 2 - pad, -l / 2 - pad);
          ctx.lineTo(-w / 2 - pad + cl, -l / 2 - pad);
          // Top-Right
          ctx.moveTo(w / 2 + pad - cl, -l / 2 - pad);
          ctx.lineTo(w / 2 + pad, -l / 2 - pad);
          ctx.lineTo(w / 2 + pad, -l / 2 - pad + cl);
          // Bottom-Right
          ctx.moveTo(w / 2 + pad, l / 2 + pad - cl);
          ctx.lineTo(w / 2 + pad, l / 2 + pad);
          ctx.lineTo(w / 2 + pad - cl, l / 2 + pad);
          // Bottom-Left
          ctx.moveTo(-w / 2 - pad + cl, l / 2 + pad);
          ctx.lineTo(-w / 2 - pad, l / 2 + pad);
          ctx.lineTo(-w / 2 - pad, l / 2 + pad - cl);
          ctx.stroke();

          // Floating Target Classification Tag
          ctx.fillStyle = isAmbulance ? 'rgba(239, 68, 68, 0.9)' : isPlayer ? 'rgba(16, 185, 129, 0.9)' : 'rgba(6, 182, 212, 0.9)';
          ctx.beginPath();
          ctx.roundRect(-w / 2 - pad, -l / 2 - pad - 16 * scale, 95 * scale, 14 * scale, 3);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.round(8 * scale)}px JetBrains Mono, monospace`;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(label || (isPlayer ? 'EGO TS 09 EV 4412' : isAmbulance ? '108 AMB • PRIORITY' : 'VEHICLE 0.98'), -w / 2 - pad + 3 * scale, -l / 2 - pad - 9 * scale);
        }

        ctx.restore();
      };

      // Draw AI Traffic Cars
      for (const car of s.traffic) {
        const pos = worldToScreen(car.dist, car.visualLane);
        if (pos.y < horizonY - 40 || pos.y > h + 60) continue;
        renderVehicleSprite(pos.x, pos.y, 28, 52, car.color, pos.scale, false, false, false, `${car.type} • ${car.speed}km/h`);
      }

      // Draw 108 Emergency Ambulance
      if (s.ambulanceActive) {
        const pos = worldToScreen(s.ambDist, s.ambLane);
        if (pos.y > horizonY - 60 && pos.y < h + 80) {
          renderVehicleSprite(pos.x, pos.y, 32, 60, '#ffffff', pos.scale, true, false, false, '108 AMBULANCE (EVP)');
        }
      }

      // Draw Player Car
      const playerPos = worldToScreen(s.carDist, s.carVisualX);
      renderVehicleSprite(
        playerPos.x, 
        carScreenY, 
        30, 
        56, 
        '#059669', 
        playerPos.scale, 
        false, 
        true, 
        s.isBraking || s.isHandbrake,
        'YOU • TS 09 EV 4412'
      );

      // Rain Weather Overlay
      if (config.weather === 'rain') {
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.22)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let i = 0; i < 48; i++) {
          const rx = (s.simTime * 900 + i * 47) % w;
          const ry = (s.simTime * 1400 + i * 83) % (h - horizonY) + horizonY;
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 4, ry + 16);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [selectedScenario, isAutoPilot, cameraPerspective, showAiVision, soundEnabled, playBeep, playSirenBurst, playCameraShutter]);

  // Handle Touch / Button Pedals
  const handlePedalDown = (type: 'accel' | 'brake') => {
    initAudio();
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
    initAudio();
    if (dir === 'left' && sim.current.carLane > 0) {
      sim.current.carLane -= 1;
      sim.current.steeringAngle = -18;
      setTurnIndicator('left');
      playBeep(480, 'triangle', 0.08);
      setTimeout(() => { sim.current.steeringAngle = 0; setTurnIndicator('none'); }, 300);
    } else if (dir === 'right' && sim.current.carLane < 2) {
      sim.current.carLane += 1;
      sim.current.steeringAngle = 18;
      setTurnIndicator('right');
      playBeep(480, 'triangle', 0.08);
      setTimeout(() => { sim.current.steeringAngle = 0; setTurnIndicator('none'); }, 300);
    }
  };

  const dispatchAmbulance = () => {
    initAudio();
    sim.current.ambulanceActive = true;
    sim.current.ambDist = sim.current.carDist - 240;
    sim.current.ambYielded = false;
    playSirenBurst();
  };

  return (
    <div className={`space-y-6 ${isEmbedded ? '' : 'py-2'}`}>
      
      {/* Automated Camera Shutter White Flash (when speed trap fires) */}
      {cameraFlash && (
        <div className="fixed inset-0 z-50 bg-white pointer-events-none animate-out fade-out duration-300" />
      )}

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
                  60 FPS PERSPECTIVE ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Steer manually with WASD or activate AI Autopilot • Experience GLOSA green-waves, AI object detection, and 108 emergency preemption.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Perspective Mode 3D / 2D */}
            <button
              onClick={() => setCameraPerspective(cameraPerspective === '3d_chase' ? 'top_down' : '3d_chase')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Toggle 3D Chase Perspective vs 2D Tactical View"
            >
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>{cameraPerspective === '3d_chase' ? '3D Chase Cam' : '2D Tactical View'}</span>
            </button>

            {/* AI Vision Bounding Box Overlay Switch */}
            <button
              onClick={() => setShowAiVision(!showAiVision)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                showAiVision 
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/60 shadow-lg shadow-cyan-500/20' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showAiVision ? 'AI Vision: ON' : 'AI Vision: OFF'}</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => {
                initAudio();
                setSoundEnabled(!soundEnabled);
              }}
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
              onClick={() => {
                initAudio();
                setIsAutoPilot(!isAutoPilot);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isAutoPilot 
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{isAutoPilot ? 'Autopilot: ON' : 'Manual Driving'}</span>
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
                type="button"
                onClick={handleTogglePlay}
                className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSimRunning
                    ? 'bg-amber-500/10 text-amber-700 border-amber-300 hover:bg-amber-500/20'
                    : 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-500 shadow-md shadow-emerald-500/20'
                }`}
              >
                {isSimRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white text-white" />
                    <span>Start Driving</span>
                  </>
                )}
              </button>

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
          <div className="relative w-full h-[540px] rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair"
              style={{ touchAction: 'none' }}
            />

            {/* Paused Start Driving Overlay */}
            {!isSimRunning && (
              <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-slate-900/95 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <Play className="w-8 h-8 fill-emerald-400 text-emerald-400 ml-1" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                      SIMULATOR PAUSED &bull; STANDBY
                    </span>
                    <h3 className="text-xl font-black text-white">Live Experience Studio</h3>
                    <p className="text-xs text-slate-300">
                      60 FPS Physics Driving Engine &amp; V2X 108 Ambulance Preemption
                    </p>
                  </div>
                  <div className="p-3 bg-black/60 rounded-xl border border-white/10 text-[11px] font-mono text-slate-300 text-left space-y-1">
                    <div><b className="text-emerald-400">W / ↑</b> Accelerate &bull; <b className="text-amber-400">S / ↓</b> Brake</div>
                    <div><b className="text-cyan-400">A / D / ← / →</b> Steer Lane Left / Right</div>
                    <div><b className="text-rose-400">Space</b> Emergency Handbrake &bull; <b className="text-slate-400">P</b> Pause/Resume</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm transition-all cursor-pointer shadow-lg shadow-emerald-600/40 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white text-white" />
                    <span>CLICK TO START DRIVING</span>
                  </button>
                </div>
              </div>
            )}

            {/* Live Mission Objectives HUD Card (Top-Left of Screen) */}
            <div className="absolute top-4 left-4 z-20 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-2xl p-3 shadow-2xl text-white max-w-xs space-y-1.5 pointer-events-none">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Mission Objectives</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="space-y-1 text-[11px] font-mono">
                <div className={`flex items-center gap-1.5 ${uiStats.objectives.glosaWave ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  {uiStats.objectives.glosaWave ? <Check className="w-3 h-3 text-emerald-400" /> : <div className="w-3 h-3 rounded-full border border-slate-600" />}
                  <span>Maintain GLOSA Pace (42 km/h)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${uiStats.objectives.ambulanceYield ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  {uiStats.objectives.ambulanceYield ? <Check className="w-3 h-3 text-emerald-400" /> : <div className="w-3 h-3 rounded-full border border-slate-600" />}
                  <span>Yield Center Lane for Ambulance</span>
                </div>
                <div className={`flex items-center gap-1.5 ${uiStats.objectives.signalClear ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  {uiStats.objectives.signalClear ? <Check className="w-3 h-3 text-emerald-400" /> : <div className="w-3 h-3 rounded-full border border-slate-600" />}
                  <span>Obey Stop Lines & Signal Lights</span>
                </div>
              </div>
            </div>

            {/* Overlay Ambulance Siren Flasher Banner */}
            {uiStats.ambulanceIncoming && (
              <div className="absolute top-4 right-4 left-64 z-20 bg-red-600/90 backdrop-blur-md text-white border-2 border-white rounded-2xl p-2.5 shadow-2xl flex items-center justify-between px-4 animate-pulse">
                <div className="flex items-center gap-2.5">
                  <Siren className="w-5 h-5 animate-bounce shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-black tracking-wider uppercase block truncate">
                      🚨 108 AMBULANCE APPROACHING — {uiStats.ambulanceDistBehind}m BEHIND
                    </span>
                    <span className="text-[10px] font-mono text-red-100 truncate block">
                      V2X Priority Preemption: Clear center lane immediately!
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleLaneChange('left')}
                  className="px-3 py-1 bg-white text-red-700 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-red-50 cursor-pointer shadow-md shrink-0 ml-2"
                >
                  Yield Left ◀
                </button>
              </div>
            )}

            {/* On-Screen Steering Wheel & Interactive Touch Pedals */}
            <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
              
              {/* Left Group: Steer Buttons & Blinker */}
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={() => handleLaneChange('left')}
                  className={`w-14 h-14 rounded-2xl border shadow-2xl flex flex-col items-center justify-center font-bold text-xs active:scale-95 transition-all cursor-pointer backdrop-blur-md ${
                    turnIndicator === 'left' ? 'bg-amber-500 text-black border-amber-300 animate-pulse' : 'bg-slate-900/90 hover:bg-slate-800 text-white border-slate-700/80'
                  }`}
                  title="Steer Left (A / Left Arrow)"
                >
                  <ArrowLeft className="w-5 h-5 text-emerald-400" />
                  <span className="text-[9px] font-mono">LEFT</span>
                </button>
                <button
                  onClick={() => handleLaneChange('right')}
                  className={`w-14 h-14 rounded-2xl border shadow-2xl flex flex-col items-center justify-center font-bold text-xs active:scale-95 transition-all cursor-pointer backdrop-blur-md ${
                    turnIndicator === 'right' ? 'bg-amber-500 text-black border-amber-300 animate-pulse' : 'bg-slate-900/90 hover:bg-slate-800 text-white border-slate-700/80'
                  }`}
                  title="Steer Right (D / Right Arrow)"
                >
                  <ArrowRight className="w-5 h-5 text-emerald-400" />
                  <span className="text-[9px] font-mono">RIGHT</span>
                </button>
              </div>

              {/* Center: Interactive Steering Wheel & Telemetry */}
              <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-2xl px-5 py-2 text-center text-white pointer-events-auto shadow-2xl flex items-center gap-3">
                {/* Rotating Virtual Steering Wheel */}
                <div 
                  className="w-10 h-10 rounded-full border-4 border-slate-500 flex items-center justify-center transition-transform duration-200 shadow-inner"
                  style={{ transform: `rotate(${sim.current.steeringAngle * 1.8}deg)` }}
                >
                  <div className="w-4 h-1 bg-slate-400 rounded-full" />
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-widest text-slate-400">
                    {selectedScenario.roadName}
                  </div>
                  <div className="text-sm font-black text-emerald-400">
                    LANE {uiStats.currentLane === 0 ? '1 (LEFT)' : uiStats.currentLane === 1 ? '2 (CENTER)' : '3 (RIGHT)'}
                  </div>
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
                    className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs font-mono space-y-1 animate-in fade-in zoom-in-95 duration-200 cursor-pointer hover:bg-rose-900/50 transition-colors"
                    onClick={() => setActiveChallan(ch)}
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

      {/* 3. Violation Popup Modal (Flashes with Radar Photographic Snapshot) */}
      {activeChallan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border-2 border-red-500 shadow-2xl max-w-lg w-full p-6 text-slate-900 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-300 flex items-center justify-center text-red-600 font-black">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-red-600 font-mono tracking-wider block">
                    Statutory Optical Notice Generated
                  </span>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    Speed Radar & Signal e-Challan Dossier
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

            {/* Radar Camera Evidence Snapshot Card */}
            <div className="relative w-full h-40 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner">
              <img
                src="/images/hitec_corridor.jpg"
                alt="Radar Speed Gun Snapshot"
                className="w-full h-full object-cover brightness-75 contrast-125"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />

              {/* Radar Targeting Reticle */}
              <div className="absolute inset-x-12 inset-y-6 border-2 border-red-500/80 rounded-xl flex items-center justify-center pointer-events-none">
                <Crosshair className="w-10 h-10 text-red-500 animate-spin" style={{ animationDuration: '8s' }} />
                <span className="absolute top-2 left-2 text-[8px] font-mono text-red-400 bg-black/70 px-1 py-0.5 rounded">
                  CALIBRATED RADAR: FALCON-HR
                </span>
                <span className="absolute bottom-2 right-2 text-[10px] font-mono text-red-300 font-bold bg-black/80 px-1.5 py-0.5 rounded">
                  RECORDED: {activeChallan.speed} km/h (LIMIT {activeChallan.limit})
                </span>
              </div>

              {/* License Plate Banner */}
              <div className="absolute bottom-2 left-3 bg-white/95 px-2.5 py-1 rounded-md border border-slate-300 shadow-md flex items-center gap-1.5 font-mono text-xs font-black text-slate-900">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>TS 09 EV 4412</span>
              </div>
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
                <span className="text-slate-500">Statutory Section</span>
                <span className="font-bold text-slate-800 text-[10px]">{activeChallan.section}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Timestamp & Location</span>
                <span className="font-bold text-slate-800 text-[10px]">{activeChallan.time} • {activeChallan.location}</span>
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
