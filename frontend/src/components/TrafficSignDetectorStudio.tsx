import React, { useState, useRef } from 'react';
import { 
  Upload, Camera, Cpu, Sparkles, CheckCircle2, 
  AlertTriangle, ArrowRight, Zap, RefreshCw, Layers 
} from 'lucide-react';
import { api } from '../services/api';
import { DetectionResponse } from '../types';

export const TrafficSignDetectorStudio: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset sample test images
  const presetSamples = [
    { name: 'Speed Limit 40 km/h (Cyber Towers)', code: 'SPEED_LIMIT_40', classId: 2 },
    { name: 'Speed Breaker / Bump (Mindspace)', code: 'SPEED_BREAKER', classId: 16 },
    { name: 'Stop Sign (Bio-Diversity)', code: 'STOP', classId: 7 },
    { name: 'Pedestrian Crossing (Gachibowli)', code: 'PEDESTRIAN_CROSSING', classId: 12 },
    { name: 'Road Work in Progress (Jubilee Hills)', code: 'ROAD_WORK', classId: 14 }
  ];

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
      // Fetch synthetic sample from backend or generate dynamic canvas
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw highway scene
        ctx.fillStyle = '#475569';
        ctx.fillRect(0, 0, 640, 220);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 220, 640, 260);

        // Sign Badge
        ctx.fillStyle = sample.code === 'STOP' ? '#ef4444' : '#ffffff';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(480, 260, 48, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sample.code.includes('40') ? '40' : sample.code.replace('_', ' ').slice(0, 5), 480, 260);
      }

      canvas.toBlob(async (blob) => {
        if (blob) {
          const dataUrl = canvas.toDataURL('image/jpeg');
          setSelectedImage(dataUrl);
          await runInference(blob);
        }
      }, 'image/jpeg');
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

  const captureWebcamFrame = () => {
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
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-400" />
            AI Computer Vision & Context Fusion Studio
          </h2>
          <p className="text-xs text-slate-400">
            Real PyTorch / YOLO traffic sign recognition engine with live multi-source digital fusion.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            <Upload className="w-4 h-4 text-brand-400" />
            Upload Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={isWebcamActive ? captureWebcamFrame : startWebcam}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-500/10 border border-brand-500/30 hover:bg-brand-500/20 text-brand-400 text-xs font-semibold transition-all"
          >
            <Camera className="w-4 h-4" />
            {isWebcamActive ? 'Capture & Detect' : 'Enable Webcam'}
          </button>
        </div>
      </div>

      {/* Preset Test Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-mono text-slate-400 shrink-0">Sample Captures:</span>
        {presetSamples.map((sample, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectPreset(sample)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-brand-500/50 text-slate-300 hover:text-white text-xs whitespace-nowrap transition-all"
          >
            {sample.name}
          </button>
        ))}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Visual Canvas / Output */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-3xl border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800/60">
            <span>Visual Frame Input & Bounding Overlays</span>
            {detectionResult && (
              <span className="text-brand-400 font-bold">
                Latency: {detectionResult.latency_ms} ms ({detectionResult.fps} FPS)
              </span>
            )}
          </div>

          <div className="relative w-full aspect-video rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
            {isWebcamActive && (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            )}

            {!isWebcamActive && selectedImage && (
              <img
                src={detectionResult?.annotated_image_base64 || selectedImage}
                alt="Detection Frame"
                className="w-full h-full object-contain"
              />
            )}

            {!isWebcamActive && !selectedImage && (
              <div className="text-center p-8 text-slate-500 space-y-2">
                <Camera className="w-12 h-12 mx-auto stroke-1 text-slate-600" />
                <p className="text-xs">Upload an image or select a sample above to test AI detection.</p>
              </div>
            )}

            {isLoading && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-8 h-8 text-brand-500 animate-spin" />
                <span className="text-xs font-mono text-white">Running Deep Neural Inference...</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: AI Telemetry & Multi-Source Fusion Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Detections List */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              Vision Detections ({detectionResult?.count || 0})
            </h3>

            {detectionResult?.detections && detectionResult.detections.length > 0 ? (
              <div className="space-y-2">
                {detectionResult.detections.map((det, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{det.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        Category: <b className="text-slate-300">{det.category}</b> • Code: {det.code}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">
                        {(det.confidence * 100).toFixed(1)}% Conf
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
                No active traffic signs identified in current frame.
              </div>
            )}
          </div>

          {/* Context Fusion Pipeline Result */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Context Fusion Engine Output
            </h3>

            {detectionResult?.fused_events && detectionResult.fused_events.length > 0 ? (
              <div className="space-y-3">
                {detectionResult.fused_events.map((fe, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{fe.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        {fe.source_count} Sources Fused
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <span>Sources: <b>{fe.sources.join(' + ')}</b></span>
                      <span>• Confidence: <b>{(fe.confidence * 100).toFixed(0)}%</b></span>
                    </div>

                    {fe.conflict_detected && (
                      <div className="p-2 rounded-lg bg-rose-500/20 text-rose-300 text-xs flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{fe.conflict_note}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
                Awaiting fusion inputs from vision & infrastructure layers.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
