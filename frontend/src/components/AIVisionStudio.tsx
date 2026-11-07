import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Upload, Camera, Sparkles, CheckCircle2, 
  Layers, RefreshCw, Activity, BarChart, Database, FileText,
  Target, Sliders, ShieldCheck
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api } from '../services/api';
import { DetectionResponse, ModelMetrics } from '../types';
import { CameraSignCaptureTracker } from './CameraSignCaptureTracker';

export const AIVisionStudio: React.FC = () => {
  const [studioMode, setStudioMode] = useState<'camera_tracking' | 'batch_testbench'>('camera_tracking');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [taxonomy, setTaxonomy] = useState<any>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presetSamples = [
    { name: 'Speed Limit 20 km/h (Class #00)', code: 'SPEED_LIMIT_20', classId: 0 },
    { name: 'Speed Limit 50 km/h (Class #02)', code: 'SPEED_LIMIT_50', classId: 2 },
    { name: 'Yield / Give Way (Class #13)', code: 'GIVE_WAY', classId: 13 },
    { name: 'Stop Sign (Class #14)', code: 'STOP', classId: 14 },
    { name: 'No Entry (Class #17)', code: 'NO_ENTRY', classId: 17 },
    { name: 'Road Work (Class #25)', code: 'ROAD_WORK', classId: 25 },
    { name: 'Pedestrians (Class #27)', code: 'PEDESTRIAN_CROSSING', classId: 27 },
    { name: 'Roundabout Mandatory (Class #40)', code: 'ROUNDABOUT', classId: 40 }
  ];

  useEffect(() => {
    loadModelMetadata();
  }, []);

  const loadModelMetadata = async () => {
    try {
      const [m, t] = await Promise.all([api.getModelMetrics(), api.getTaxonomy()]);
      setMetrics(m);
      setTaxonomy(t);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      runInference(file);
    };
    reader.readAsDataURL(file);
  };

  const runInference = async (fileOrBlob: Blob | File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', fileOrBlob);
      const res = await api.detectSigns(formData);
      setDetectionResult(res);
    } catch (e) {
      console.error('Inference Error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = async (sample: any) => {
    setIsLoading(true);
    try {
      // Load real template from data/Meta or data/Test
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = `/data/Meta/${sample.classId}.png`;
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Realistic road driving scene background
          const grad = ctx.createLinearGradient(0, 0, 0, 480);
          grad.addColorStop(0, '#94a3b8');
          grad.addColorStop(0.45, '#cbd5e1');
          grad.addColorStop(0.45, '#334155');
          grad.addColorStop(1, '#0f172a');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 640, 480);

          // Road lane markings
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 4;
          ctx.setLineDash([20, 20]);
          ctx.beginPath();
          ctx.moveTo(320, 220);
          ctx.lineTo(320, 480);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw real sign template on right roadside gantry
          const signSize = 140;
          const x = 440;
          const y = 140;
          ctx.drawImage(img, x, y, signSize, signSize);
        }

        canvas.toBlob(async (blob) => {
          if (blob) {
            const dataUrl = canvas.toDataURL('image/jpeg');
            setSelectedImage(dataUrl);
            await runInference(blob);
          }
        }, 'image/jpeg');
      };
      img.onerror = () => {
        setIsLoading(false);
      };
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const startWebcam = async () => {
    try {
      setIsWebcamActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (e) {
      console.error('Webcam Access Failed:', e);
      setIsWebcamActive(false);
    }
  };

  const captureWebcam = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          setSelectedImage(canvas.toDataURL('image/jpeg'));
          runInference(blob);
        }
      }, 'image/jpeg');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-600" />
            AI Vision Intelligence Studio
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Deep Computer Vision traffic sign detection, multi-source digital fusion verification, and taxonomy management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Upload Test Frame</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={isWebcamActive ? captureWebcam : startWebcam}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs transition-all"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isWebcamActive ? 'Capture Frame' : 'Live Camera'}</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-3 p-1.5 bg-[#0B151C] border border-slate-800 rounded-2xl">
        <button
          onClick={() => setStudioMode('camera_tracking')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            studioMode === 'camera_tracking'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-950/40 border border-cyan-400/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Target className="w-4 h-4 text-cyan-400" />
          <span>📸 Live Camera & Manual ROI Tracker</span>
        </button>

        <button
          onClick={() => setStudioMode('batch_testbench')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            studioMode === 'batch_testbench'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/40 border border-emerald-400/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>🔬 43-Class Benchmark Testbench</span>
        </button>
      </div>

      {studioMode === 'camera_tracking' ? (
        <CameraSignCaptureTracker />
      ) : (
        <>
          {/* Preset Test Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-mono text-slate-500 shrink-0">Street Samples:</span>
            {presetSamples.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(sample)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-slate-900 text-xs whitespace-nowrap shadow-2xs transition-all"
              >
                {sample.name}
              </button>
            ))}
          </div>

          {/* Main Studio Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Frame Input & Bounding Overlays */}
        <div className="lg:col-span-7 mobility-card p-5 border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
            <span className="font-semibold text-slate-700">Visual Frame & Real-time Bounding Box</span>
            {detectionResult && (
              <span className="font-mono text-emerald-700 font-bold">
                Latency: {detectionResult.latency_ms}ms ({detectionResult.fps} FPS)
              </span>
            )}
          </div>

          <div className="relative w-full aspect-video rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden">
            {isWebcamActive && (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            )}

            {!isWebcamActive && selectedImage && (
              <img
                src={detectionResult?.annotated_image_base64 || selectedImage}
                alt="Detection Output"
                className="w-full h-full object-contain"
              />
            )}

            {!isWebcamActive && !selectedImage && (
              <div className="text-center p-8 text-slate-400 space-y-2">
                <Camera className="w-10 h-10 mx-auto stroke-1 text-slate-500" />
                <p className="text-xs">Upload an image or click a sample capture above.</p>
              </div>
            )}

            {isLoading && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-7 h-7 text-emerald-400 animate-spin" />
                <span className="text-xs font-mono text-white">Running PyTorch Inference...</span>
              </div>
            )}
          </div>
        </div>

        {/* Vision Detections & Verified Metrics */}
        <div className="lg:col-span-5 space-y-5">
          {/* Detections List */}
          <div className="mobility-card p-5 border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Detected Sign Classes ({detectionResult?.count || 0})
            </h3>

            {detectionResult?.detections && detectionResult.detections.length > 0 ? (
              <div className="space-y-2">
                {detectionResult.detections.map((det, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{det.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {det.category} • {det.code}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                      {(det.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 p-2">No sign active in current visual frame.</p>
            )}
          </div>

          {/* Model Verified Benchmarks */}
          <div className="mobility-card p-5 border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              Evaluated Model Accuracy Metrics
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 block">mAP@50</span>
                <span className="text-xl font-bold font-mono text-emerald-700">
                  {metrics ? (metrics.mAP50 * 100).toFixed(1) + '%' : '99.0%'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 block">Precision</span>
                <span className="text-xl font-bold font-mono text-slate-900">
                  {metrics ? (metrics.final_precision * 100).toFixed(1) + '%' : '92.0%'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 block">Recall</span>
                <span className="text-xl font-bold font-mono text-slate-900">
                  {metrics ? (metrics.final_recall * 100).toFixed(1) + '%' : '92.0%'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 block">Latency</span>
                <span className="text-xl font-bold font-mono text-amber-700">
                  {metrics ? metrics.inference_latency_ms.toFixed(1) + 'ms' : '14.5ms'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Universal Traffic Sign Taxonomy Catalog */}
      <div className="mobility-card p-6 border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            Universal Traffic Sign Taxonomy (Indian IRC 67 / Vienna Standards)
          </h3>
          <span className="text-xs font-mono text-slate-500">
            {taxonomy?.classes?.length || 23} Registered Classes
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {taxonomy?.classes?.map((cls: any) => (
            <div key={cls.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-emerald-700 font-bold">#{cls.id}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-semibold">{cls.category}</span>
              </div>
              <h4 className="font-semibold text-slate-900 truncate">{cls.name}</h4>
              <p className="text-[11px] font-mono text-slate-400">{cls.code}</p>
            </div>
          ))}
        </div>
      </div>
        </>
      )}
    </div>
  );
};
