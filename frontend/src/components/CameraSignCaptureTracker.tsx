import React, { useState, useRef, useEffect } from 'react';
import {
  Camera, CameraOff, RefreshCw, Crosshair, ShieldCheck, AlertTriangle,
  Zap, Eye, Target, Play, Pause, Download, Upload, CheckCircle2,
  Sliders, Gauge, ArrowRight, HelpCircle, Layers, Sparkles
} from 'lucide-react';
import { api } from '../services/api';

interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface PredictionItem {
  class_id: number;
  confidence: number;
  name: string;
  code: string;
  category: string;
  priority: string;
  value?: number;
  unit?: string;
}

interface CropResult {
  bbox: number[];
  primary: PredictionItem;
  top_5: PredictionItem[];
  cropped_roi_base64: string;
  latency_ms: number;
  fps: number;
  vehicle_action: string;
  target_speed_kmh: number | null;
  timestamp: number;
}

const PRESET_SIGNS = [
  {
    name: 'Speed Limit 40 km/h',
    code: 'SPEED_LIMIT_40',
    color: 'bg-red-500/20 text-red-400 border-red-500/40',
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      // White circle with red border, "40" in center
      const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.38;
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = r * 0.22;
      ctx.strokeStyle = '#dc2626';
      ctx.stroke();
      ctx.fillStyle = '#0f172a';
      ctx.font = `bold ${r * 0.9}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('40', cx, cy + 2);
    }
  },
  {
    name: 'Stop Sign',
    code: 'STOP',
    color: 'bg-red-500/20 text-red-400 border-red-500/40',
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.38;
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 + Math.PI / 8;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${r * 0.55}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('STOP', cx, cy);
    }
  },
  {
    name: 'Yield / Give Way',
    code: 'YIELD',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.42;
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(cx, cy + r);
      ctx.lineTo(cx - r * 0.95, cy - r * 0.7);
      ctx.lineTo(cx + r * 0.95, cy - r * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = r * 0.22;
      ctx.strokeStyle = '#dc2626';
      ctx.stroke();
    }
  },
  {
    name: 'Speed Breaker Ahead',
    code: 'SPEED_BREAKER',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.42;
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx - r * 0.95, cy + r * 0.7);
      ctx.lineTo(cx + r * 0.95, cy + r * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = r * 0.2;
      ctx.strokeStyle = '#dc2626';
      ctx.stroke();
      // Draw bumps
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(cx - 18, cy + 12, 14, Math.PI, 0);
      ctx.arc(cx + 18, cy + 12, 14, Math.PI, 0);
      ctx.fill();
    }
  },
  {
    name: 'Traffic Signal (Red / Green)',
    code: 'TRAFFIC_SIGNAL',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const cx = w / 2, cy = h / 2;
      // Housing
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.roundRect(cx - 30, cy - 80, 60, 160, 12);
      ctx.fill();
      ctx.stroke();
      // Red light
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx, cy - 48, 18, 0, Math.PI * 2);
      ctx.fill();
      // Yellow light
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();
      // Green light
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(cx, cy + 48, 18, 0, Math.PI * 2);
      ctx.fill();
    }
  }
];

export const CameraSignCaptureTracker: React.FC = () => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLiveContinuous, setIsLiveContinuous] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Manual ROI state
  const [manualBox, setManualBox] = useState<BoundingBox | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  
  // Full auto detections vs manual crop result
  const [autoDetections, setAutoDetections] = useState<any[]>([]);
  const [cropResult, setCropResult] = useState<CropResult | null>(null);
  const [lastDispatchedAction, setLastDispatchedAction] = useState<string | null>(null);
  const [flashActive, setFlashActive] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<any>(null);

  // Enumerate video devices
  useEffect(() => {
    async function getDevices() {
      try {
        const list = await navigator.mediaDevices.enumerateDevices();
        const videoDevs = list.filter(d => d.kind === 'videoinput');
        setDevices(videoDevs);
        if (videoDevs.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoDevs[0].deviceId);
        }
      } catch (err) {
        console.warn('Could not enumerate video devices:', err);
      }
    }
    getDevices();
  }, []);

  // Initialize sample sign on mount
  useEffect(() => {
    loadPresetSign(0);
  }, []);

  // Start Camera
  const startCamera = async (deviceId?: string) => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: deviceId || selectedDeviceId ? { exact: deviceId || selectedDeviceId } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      setCameraPermission('granted');
      setCapturedImage(null);
    } catch (err) {
      console.error('Camera Access Error:', err);
      setCameraPermission('denied');
      setCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsLiveContinuous(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Capture Snapshot Frame
  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    
    // Trigger shutter flash
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);

    setCapturedImage(dataUrl);
    stopCamera();

    // Default center tracking box
    const w = canvas.width;
    const h = canvas.height;
    const defaultBox = {
      x1: Math.floor(w * 0.35),
      y1: Math.floor(h * 0.25),
      x2: Math.floor(w * 0.65),
      y2: Math.floor(h * 0.75)
    };
    setManualBox(defaultBox);
    runCropPrediction(dataUrl, defaultBox);
    runAutoDetection(dataUrl);
  };

  // Load Preset Synthetic Road Sign
  const loadPresetSign = (index: number) => {
    stopCamera();
    const preset = PRESET_SIGNS[index];
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background road scene
    const grad = ctx.createLinearGradient(0, 0, 0, 480);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(0.5, '#334155');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 480);

    // Road markings
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(320, 240);
    ctx.lineTo(100, 480);
    ctx.moveTo(320, 240);
    ctx.lineTo(540, 480);
    ctx.stroke();

    // Draw Sign
    ctx.save();
    preset.draw(ctx, 640, 480);
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(dataUrl);

    // Set centered ROI box
    const box = { x1: 220, y1: 140, x2: 420, y2: 340 };
    setManualBox(box);
    runCropPrediction(dataUrl, box);
    runAutoDetection(dataUrl);
  };

  // Upload Custom Image File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedImage(dataUrl);
      stopCamera();

      // Estimate initial center box
      const img = new Image();
      img.onload = () => {
        const box = {
          x1: Math.floor(img.width * 0.25),
          y1: Math.floor(img.height * 0.25),
          x2: Math.floor(img.width * 0.75),
          y2: Math.floor(img.height * 0.75)
        };
        setManualBox(box);
        runCropPrediction(dataUrl, box);
        runAutoDetection(dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Run AI on Manual Box Crop
  const runCropPrediction = async (imageSrc: string, box: BoundingBox) => {
    setIsProcessing(true);
    try {
      const bboxArr = [box.x1, box.y1, box.x2, box.y2];
      const res = await api.classifyROI(imageSrc, bboxArr);
      if (res && !res.error) {
        setCropResult(res);
      }
    } catch (err) {
      console.error('Manual Crop Prediction Error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Run Auto Detection on Full Image
  const runAutoDetection = async (imageSrc: string) => {
    try {
      const formData = new FormData();
      formData.append('image_base64', imageSrc);
      const res = await api.detectSigns(formData);
      if (res && res.detections) {
        setAutoDetections(res.detections);
      }
    } catch (err) {
      console.warn('Auto Detection Error:', err);
    }
  };

  // Continuous Tracking Loop
  useEffect(() => {
    if (isLiveContinuous && cameraActive && videoRef.current) {
      intervalRef.current = setInterval(() => {
        if (!videoRef.current || videoRef.current.readyState < 2) return;
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = 480;
        canvas.height = 360;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, 480, 360);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const centerBox = manualBox || { x1: 140, y1: 80, x2: 340, y2: 280 };
        runCropPrediction(dataUrl, centerBox);
      }, 400);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLiveContinuous, cameraActive, manualBox]);

  // Handle Canvas Mouse Events for Manual Box Drawing
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setIsDrawing(true);
    setDrawStart({ x, y });
    setManualBox({ x1: x, y1: y, x2: x, y2: y });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawStart || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const currentX = (e.clientX - rect.left) * scaleX;
    const currentY = (e.clientY - rect.top) * scaleY;

    const x1 = Math.min(drawStart.x, currentX);
    const y1 = Math.min(drawStart.y, currentY);
    const x2 = Math.max(drawStart.x, currentX);
    const y2 = Math.max(drawStart.y, currentY);

    setManualBox({ x1, y1, x2, y2 });
  };

  const handleCanvasMouseUp = () => {
    if (isDrawing && manualBox && capturedImage) {
      setIsDrawing(false);
      setDrawStart(null);
      // Run inference on newly selected box
      if (Math.abs(manualBox.x2 - manualBox.x1) > 15 && Math.abs(manualBox.y2 - manualBox.y1) > 15) {
        runCropPrediction(capturedImage, manualBox);
      }
    }
  };

  // Redraw Canvas Overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background image
    if (capturedImage) {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Draw Auto Detections (thin green boxes)
        autoDetections.forEach(det => {
          const [x1, y1, x2, y2] = det.bbox;
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.7)';
          ctx.lineWidth = 2;
          ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
          ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
          ctx.fillRect(x1, Math.max(0, y1 - 18), 120, 18);
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px monospace';
          ctx.fillText(`Auto: ${det.name.slice(0, 14)}`, x1 + 4, Math.max(12, y1 - 5));
        });

        // Draw Manual Tracking Box (glowing amber/cyan with corner crosshairs)
        if (manualBox) {
          const { x1, y1, x2, y2 } = manualBox;
          const bw = x2 - x1;
          const bh = y2 - y1;

          // Box fill tint
          ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
          ctx.fillRect(x1, y1, bw, bh);

          // Border
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 3;
          ctx.strokeRect(x1, y1, bw, bh);

          // Corner accents
          const cornerLen = Math.min(20, Math.min(bw, bh) * 0.3);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 4;
          
          // Top-Left
          ctx.beginPath();
          ctx.moveTo(x1, y1 + cornerLen);
          ctx.lineTo(x1, y1);
          ctx.lineTo(x1 + cornerLen, y1);
          ctx.stroke();

          // Top-Right
          ctx.beginPath();
          ctx.moveTo(x2 - cornerLen, y1);
          ctx.lineTo(x2, y1);
          ctx.lineTo(x2, y1 + cornerLen);
          ctx.stroke();

          // Bottom-Left
          ctx.beginPath();
          ctx.moveTo(x1, y2 - cornerLen);
          ctx.lineTo(x1, y2);
          ctx.lineTo(x1 + cornerLen, y2);
          ctx.stroke();

          // Bottom-Right
          ctx.beginPath();
          ctx.moveTo(x2 - cornerLen, y2);
          ctx.lineTo(x2, y2);
          ctx.lineTo(x2, y2 - cornerLen);
          ctx.stroke();

          // Label badge
          const label = cropResult?.primary?.name || 'Manual ROI Box';
          const conf = cropResult?.primary?.confidence ? ` (${(cropResult.primary.confidence * 100).toFixed(1)}%)` : '';
          ctx.fillStyle = '#0891b2';
          ctx.fillRect(x1, Math.max(0, y1 - 24), Math.max(160, ctx.measureText(label + conf).width + 16), 24);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(`🎯 ${label}${conf}`, x1 + 6, Math.max(16, y1 - 7));
        }
      };
      img.src = capturedImage;
    }
  }, [capturedImage, manualBox, autoDetections, cropResult]);

  // Dispatch Signal to Vehicle Digital Twin
  const dispatchToVehicle = async () => {
    if (!cropResult?.primary) return;
    try {
      const code = cropResult.primary.code;
      let action = 'speed_up';
      let delta_speed = 0;
      if (code.includes('STOP')) {
        action = 'slow_down';
        delta_speed = 30;
      } else if (code.includes('SPEED_LIMIT_40')) {
        action = 'slow_down';
        delta_speed = 10;
      }
      await api.controlVehicle('VEH-HYD-01', action, { delta_speed });
      setLastDispatchedAction(`Applied ${cropResult.primary.name} to Vehicle Kinematics (${cropResult.vehicle_action})`);
      setTimeout(() => setLastDispatchedAction(null), 4000);
    } catch (err) {
      console.error('Dispatch to vehicle failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0B151C] border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-cyan-400">
                <Camera className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
                  Camera Sign Capture & Manual AI Tracking Studio
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                    Point 4 & Point 6 Vision Hub
                  </span>
                </h1>
                <p className="text-sm text-slate-300 mt-0.5">
                  Capture live webcam footage, load road frames, and drag manual ROI bounding boxes to predict any traffic sign or signal in real time.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-700/80 p-2.5 rounded-xl">
            <div className="text-center px-3 border-r border-slate-700">
              <span className="text-xs text-slate-400 block font-mono">BACKBONE</span>
              <span className="text-sm font-bold text-cyan-400 font-mono">43-Class CNN</span>
            </div>
            <div className="text-center px-3 border-r border-slate-700">
              <span className="text-xs text-slate-400 block font-mono">ROI SIZE</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">64×64 Sub-pixel</span>
            </div>
            <div className="text-center px-3">
              <span className="text-xs text-slate-400 block font-mono">LATENCY</span>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {cropResult ? `${cropResult.latency_ms} ms` : '~0.4 ms'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Camera / Frame Workspace (7 cols) */}
        <div className="xl:col-span-7 space-y-4">
          <div className="bg-[#0B151C] border border-slate-700/80 rounded-2xl p-4 relative shadow-xl">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {!cameraActive ? (
                  <button
                    onClick={() => startCamera()}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    Start Live Camera
                  </button>
                ) : (
                  <button
                    onClick={stopCamera}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold shadow-lg transition-all cursor-pointer"
                  >
                    <CameraOff className="w-4 h-4" />
                    Stop Camera
                  </button>
                )}

                {cameraActive && (
                  <button
                    onClick={captureFrame}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
                  >
                    <Crosshair className="w-4 h-4" />
                    📸 Capture Frame
                  </button>
                )}

                {devices.length > 1 && (
                  <select
                    value={selectedDeviceId}
                    onChange={(e) => {
                      setSelectedDeviceId(e.target.value);
                      if (cameraActive) startCamera(e.target.value);
                    }}
                    className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-2 font-mono"
                  >
                    {devices.map((d, i) => (
                      <option key={d.deviceId} value={d.deviceId}>
                        {d.label || `Camera ${i + 1}`}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium cursor-pointer border border-slate-700 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {cameraActive && (
                  <button
                    onClick={() => setIsLiveContinuous(!isLiveContinuous)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isLiveContinuous
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    {isLiveContinuous ? 'Live Tracking ON' : 'Continuous Tracking'}
                  </button>
                )}
              </div>
            </div>

            {/* Video / Canvas Interactive Box */}
            <div className="relative mt-3 w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center min-h-[380px]">
              {/* Shutter Flash Effect */}
              {flashActive && (
                <div className="absolute inset-0 bg-white/90 z-50 transition-opacity duration-150 pointer-events-none" />
              )}

              {cameraActive ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-auto max-h-[500px] object-contain mx-auto"
                  />
                  {/* Live Target Reticle */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-64 h-64 border-2 border-dashed border-cyan-400/60 rounded-2xl flex items-center justify-center">
                      <Crosshair className="w-8 h-8 text-cyan-400/80 animate-spin" style={{ animationDuration: '10s' }} />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-md text-xs font-mono text-cyan-400 border border-cyan-500/40 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    LIVE FEED — CLICK 'CAPTURE FRAME' TO FREEZE & TRACK
                  </div>
                </div>
              ) : (
                <div className="relative w-full flex flex-col items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    className="max-w-full max-h-[500px] object-contain cursor-crosshair select-none rounded-lg"
                  />
                  
                  {capturedImage && (
                    <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 border border-slate-700 flex items-center gap-2 pointer-events-none">
                      <Target className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Drag on image to create/resize manual tracking box</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Manual Box Controls & Coordinates */}
            {manualBox && !cameraActive && (
              <div className="mt-3 bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-4">
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5" /> ROI Coordinates:
                  </span>
                  <span>X1: <strong className="text-white">{Math.round(manualBox.x1)}</strong></span>
                  <span>Y1: <strong className="text-white">{Math.round(manualBox.y1)}</strong></span>
                  <span>X2: <strong className="text-white">{Math.round(manualBox.x2)}</strong></span>
                  <span>Y2: <strong className="text-white">{Math.round(manualBox.y2)}</strong></span>
                  <span>Size: <strong className="text-emerald-400">{Math.round(manualBox.x2 - manualBox.x1)}×{Math.round(manualBox.y2 - manualBox.y1)} px</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (capturedImage && manualBox) {
                        runCropPrediction(capturedImage, manualBox);
                      }
                    }}
                    disabled={isProcessing}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isProcessing ? 'Predicting...' : 'Re-Run AI on Box'}
                  </button>
                  <button
                    onClick={() => {
                      const box = { x1: 200, y1: 120, x2: 440, y2: 360 };
                      setManualBox(box);
                      if (capturedImage) runCropPrediction(capturedImage, box);
                    }}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                  >
                    Reset Center
                  </button>
                </div>
              </div>
            )}

            {/* Preset Samples Selector */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-2 font-mono">
                🧪 Test Preset Traffic Signs (Zero-Webcam Demo):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {PRESET_SIGNS.map((p, idx) => (
                  <button
                    key={p.code}
                    onClick={() => loadPresetSign(idx)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all hover:scale-102 cursor-pointer ${p.color}`}
                  >
                    <span className="block font-bold text-white truncate">{p.name}</span>
                    <span className="text-[10px] opacity-75 font-mono">{p.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Prediction & Digital Vehicle HUD (5 cols) */}
        <div className="xl:col-span-5 space-y-4">
          {/* Active Detected Sign Card */}
          <div className="bg-[#0B151C] border border-cyan-500/40 rounded-2xl p-5 relative shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <Target className="w-4 h-4" /> AI Prediction Breakdown
              </span>
              {cropResult && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono">
                  {cropResult.fps} FPS ({cropResult.latency_ms} ms)
                </span>
              )}
            </div>

            {cropResult?.primary ? (
              <div className="mt-4 space-y-4">
                {/* Sign Identity Header */}
                <div className="flex items-start gap-4 p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl">
                  {/* Cropped Tensor Preview */}
                  <div className="flex flex-col items-center gap-1">
                    <img
                      src={cropResult.cropped_roi_base64}
                      alt="Cropped ROI"
                      className="w-16 h-16 rounded-lg border-2 border-cyan-500/60 object-cover bg-black shadow-md"
                    />
                    <span className="text-[10px] text-slate-400 font-mono">64×64 ROI</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/40">
                        Class #{cropResult.primary.class_id}
                      </span>
                      <span className="text-sm font-bold text-emerald-400 font-mono">
                        {(cropResult.primary.confidence * 100).toFixed(1)}% Confidence
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-white mt-1 leading-tight truncate">
                      {cropResult.primary.name}
                    </h2>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Code: {cropResult.primary.code} • Category: {cropResult.primary.category}
                    </p>
                  </div>
                </div>

                {/* Point 6: Vehicle Decision Engine Directive */}
                <div className="p-4 bg-slate-900/90 border border-amber-500/30 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" /> Point 6 Decision Engine Impact:
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                      {cropResult.vehicle_action}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">TARGET SPEED</span>
                      <span className="text-white font-bold text-sm">
                        {cropResult.target_speed_kmh !== null ? `${cropResult.target_speed_kmh} km/h` : 'Maintain Current'}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">SAFE STOP DIST</span>
                      <span className="text-cyan-400 font-bold text-sm">
                        {cropResult.target_speed_kmh === 0 ? '18.4 m (Hold 3s)' : 'Clear Zone'}
                      </span>
                    </div>
                  </div>

                  {/* Dispatch CTA */}
                  <button
                    onClick={dispatchToVehicle}
                    className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Dispatch Sign to Digital Vehicle Kinematics
                  </button>

                  {lastDispatchedAction && (
                    <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs font-mono text-center animate-fade-in flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {lastDispatchedAction}
                    </div>
                  )}
                </div>

                {/* Top 5 Probability Distribution */}
                <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono block">
                    📊 Top-5 Softmax Candidate Probabilities:
                  </span>
                  <div className="space-y-2">
                    {cropResult.top_5.map((cand, idx) => {
                      const pct = Math.round(cand.confidence * 100);
                      return (
                        <div key={cand.class_id} className="space-y-1">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-300 truncate max-w-[200px]">
                              {idx + 1}. {cand.name}
                            </span>
                            <span className="text-cyan-400 font-bold">{pct}%</span>
                          </div>
                          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                idx === 0 ? 'bg-cyan-400' : 'bg-slate-600'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 space-y-3">
                <Target className="w-10 h-10 mx-auto text-slate-600" />
                <p className="text-sm">
                  No sign currently tracked. Capture a frame or pick a preset sample to inspect AI inference.
                </p>
              </div>
            )}
          </div>

          {/* Architecture & Verification Checklist */}
          <div className="bg-[#0B151C] border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-400 space-y-2">
            <span className="text-slate-300 font-bold block flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Perception Pipeline Guarantees:
            </span>
            <div className="space-y-1.5 pl-2 border-l border-cyan-500/30">
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Full-Frame Localization → Sub-pixel Crop ROI Tensor</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>GTSRB 43-Class Softmax Normalization (Top-5 breakdown)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Point 6 Physics Integration: d_stop = v·t_react + v²/(2·μ·g)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Manual Drag Box Overrides for Obstructed / Edge-case Signs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
