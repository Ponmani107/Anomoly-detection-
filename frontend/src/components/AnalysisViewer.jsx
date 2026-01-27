import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AlertTriangle, CheckCircle, Activity, Terminal, AlertOctagon, User } from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const AnalysisViewer = ({ filename }) => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentFrame, setCurrentFrame] = useState(0);
    const videoRef = useRef(null);

    useEffect(() => {
        if (filename) {
            fetchAnalysis();
        }
    }, [filename]);

    useEffect(() => {
        if (analysis && videoRef.current) {
            const video = videoRef.current;
            const handleTimeUpdate = () => {
                const progress = video.currentTime / video.duration;
                const frameIdx = Math.floor(progress * analysis.frame_count);
                if (frameIdx !== currentFrame) {
                    setCurrentFrame(frameIdx);
                }
            };
            video.addEventListener('timeupdate', handleTimeUpdate);
            return () => video.removeEventListener('timeupdate', handleTimeUpdate);
        }
    }, [analysis, currentFrame]);

    const fetchAnalysis = async () => {
        try {
            setLoading(true);
            const res = await axios.post(`http://localhost:8001/api/analyze/${filename}`);
            setAnalysis(res.data.results);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Analysis failed. Network unreachable.");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 h-full w-full">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-6"></div>
                <p className="text-blue-200 font-semibold text-sm tracking-wider animate-pulse">Processing Video Stream...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 flex flex-col items-center justify-center h-full text-red-300">
                <AlertOctagon className="w-12 h-12 mb-4" />
                <p className="font-semibold text-lg">{error}</p>
            </div>
        );
    }

    const chartData = (analysis?.scores || []).map((score, index) => ({
        frame: index,
        score: score
    }));

    const isCurrentFrameAnomaly = analysis.scores && analysis.scores[currentFrame] > 0.8;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 h-full">

            {/* Primary Video Feed */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                <div className={`relative camera-feed ${isCurrentFrameAnomaly ? 'anomaly-active-border' : ''}`}>
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                        <div className={`anomaly-status ${analysis.is_anomaly ? 'anomaly-status-anomaly' : 'anomaly-status-normal'}`}>
                            {analysis.is_anomaly ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
                            {analysis.is_anomaly ? 'ANOMALY DETECTED' : 'SYSTEM NORMAL'}
                        </div>
                    </div>

                    <video
                        ref={videoRef}
                        src={`http://localhost:8001/uploads/${filename}`}
                        controls
                        autoPlay
                        loop
                        muted
                        className="video-element"
                    />

                    {/* Detection Overlays - Only show during anomaly */}
                    {isCurrentFrameAnomaly && analysis.detections && analysis.detections[currentFrame] && analysis.detections[currentFrame].map((det, idx) => (
                        <div key={idx} className="detection-bounding-box" style={{
                            position: 'absolute',
                            left: `${(det.bbox[0] / 640) * 100}%`,
                            top: `${(det.bbox[1] / 480) * 100}%`,
                            width: `${((det.bbox[2] - det.bbox[0]) / 640) * 100}%`,
                            height: `${((det.bbox[3] - det.bbox[1]) / 480) * 100}%`,
                        }}>
                            {/* Corner Marks */}
                            <div className="corner-mark top-left"></div>
                            <div className="corner-mark top-right"></div>
                            <div className="corner-mark bottom-left"></div>
                            <div className="corner-mark bottom-right"></div>
                            
                            {/* Red Pulse Border */}
                            <div className="pulse-border"></div>

                            <div className="detection-label">
                                <User size={10} /> {det.label} ({(det.confidence * 100).toFixed(0)}%)
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="stats-card">
                        <span className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">Total Frames</span>
                        <span className="text-2xl font-bold text-white">{analysis.frame_count}</span>
                    </div>
                    <div className="stats-card">
                        <span className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">Latency</span>
                        <span className="text-2xl font-bold text-white">42ms</span>
                    </div>
                    <div className="stats-card">
                        <span className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">Max Score</span>
                        <span className={`text-2xl font-bold ${analysis.is_anomaly ? 'text-red-400' : 'text-emerald-400'}`}>{(analysis.max_score * 100).toFixed(1)}%</span>
                    </div>
                    <div className="stats-card">
                        <span className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">Object Class</span>
                        <span className="text-2xl font-bold text-blue-400">Person</span>
                    </div>
                </div>
            </div>

            {/* Analytics Column */}
            <div className="flex flex-col gap-6 h-full">
                <div className="analytics-panel">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white uppercase flex gap-2 items-center">
                            <Activity className="w-5 h-5 text-blue-400" /> Anomaly Score History
                        </h3>
                    </div>

                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="gradientScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#60a5fa' }}
                                    labelStyle={{ color: '#94a3b8' }}
                                />
                                <ReferenceLine y={0.8} stroke="#ef4444" strokeDasharray="3 3" />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#60a5fa"
                                    strokeWidth={3}
                                    fill="url(#gradientScore)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="logs-panel">
                    <div className="flex items-center gap-2 mb-3 text-blue-300 border-b border-white/10 pb-2 font-bold">
                        <Terminal className="w-4 h-4" /> SYSTEM LOGS
                    </div>
                    <div className="log-entry">
                        <p><span className="log-info">[INFO]</span> Stream initialized (CAM_01)</p>
                        <p><span className="log-processing">[INFO]</span> Model loaded: AE_ResNet50</p>
                        <p><span className="log-processing">[INFO]</span> Inference started at {new Date().toLocaleTimeString()}</p>
                        {analysis.is_anomaly && <p className="log-warning">[WARN] Threshold exceeded &gt; 0.8</p>}
                        {isCurrentFrameAnomaly && analysis.detections && analysis.detections[currentFrame] && analysis.detections[currentFrame].length > 0 && (
                            <p className="log-warning" style={{color: '#f87171'}}>[ALERT] Detected: {analysis.detections[currentFrame][0].label}</p>
                        )}
                        <p><span className="log-info">[INFO]</span> Processing complete.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisViewer;
