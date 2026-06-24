import React, { useState, useEffect, useRef } from "react";
import {
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiDownload,
  FiRotateCcw,
  FiRotateCw,
  FiPlay,
  FiPause,
  FiX,
} from "react-icons/fi";
import videoDemoThumb from "../../assets/video-demo.png";

const VideoDemo = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isDownloading, setDownloading] = useState(false);

  const videoRef = useRef(null);
  const videoWrapperRef = useRef(null);

  const videoUrl = import.meta.env.VITE_DEMO_VIDEO_URL;

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      setTotalDuration(video.duration || 0);
    };

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const onPlaying = () => {
      setIsPlaying(true);
      setIsVideoLoading(false);
    };

    const onPause = () => {
      setIsPlaying(false);
      setIsVideoLoading(false);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setIsVideoLoading(false);
      setCurrentTime(0);
    };

    const onWaiting = () => {
      setIsVideoLoading(true);
    };

    const onCanPlay = () => {
      setIsVideoLoading(false);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      setIsVideoLoading(true);
      video.play();
    }
  };

  const handleRewind = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(video.currentTime - 10, 0);
  };

  const handleForward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(video.currentTime + 10, totalDuration);
  };

  const handleVolumeToggle = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleSpeedChange = () => {
    const video = videoRef.current;
    if (!video) return;
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    video.playbackRate = nextSpeed;
    setPlaybackSpeed(nextSpeed);
  };

  const handleFullscreen = () => {
    if (!videoWrapperRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoWrapperRef.current.requestFullscreen().catch((err) => {
        console.error("Fullscreen error", err);
      });
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    const response = await fetch(videoUrl);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "queue-cure-demo.mp4";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setDownloading(false);
  };

  const formatTime = (timeInSecs) => {
    if (isNaN(timeInSecs) || timeInSecs === null) return "00:00";
    const minutes = Math.floor(timeInSecs / 60);
    const seconds = Math.floor(timeInSecs % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const progressPercent =
    totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-[32px] shadow-2xl p-5 sm:p-7 md:p-8 flex flex-col gap-6 relative animate-scale-fade-in border border-slate-100/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
              <FiPlay className="w-5 h-5 fill-current ml-0.5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight leading-snug">
                Watch Queue Cure in Action
              </h3>
              <p className="text-slate-500 text-[11px] sm:text-xs leading-normal mt-0.5 font-medium">
                See how Queue Cure makes clinic queue management simple and
                smart.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer shrink-0"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div
          ref={videoWrapperRef}
          onClick={handlePlayPause}
          className="relative w-full aspect-video rounded-[24px] overflow-hidden border border-slate-100 bg-slate-950 shadow-inner group cursor-pointer"
        >
          <video
            ref={videoRef}
            src={videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            preload="metadata"
            playsInline
          />

          {!isPlaying && (
            <div
              className="absolute inset-0 z-20 cursor-pointer overflow-hidden flex items-center justify-center select-none"
              onClick={(e) => {
                e.stopPropagation();
                handlePlayPause();
              }}
            >
              <img
                src={videoDemoThumb}
                alt="Video Thumbnail"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                {isVideoLoading ? (
                  <div className="size-24 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-[0_12px_32px_rgba(49,92,240,0.4)] border-[8px] border-white/30">
                    <svg
                      className="animate-spin h-8 w-8 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  <button className="size-24 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-[0_12px_32px_rgba(49,92,240,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
                    <svg
                      className="w-8 h-8 fill-current ml-1"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {isPlaying && isVideoLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20">
              <div className="size-16 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-[0_12px_32px_rgba(49,92,240,0.4)] border-[6px] border-white/30">
                <svg
                  className="animate-spin h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 w-full">
            <span className="text-[11px] font-semibold text-slate-500 font-mono w-10 text-left">
              {formatTime(currentTime)}
            </span>
            <div className="flex-grow h-1.5 bg-slate-100 rounded-full relative overflow-hidden">
              <div
                className="absolute left-0 top-0 bottom-0 bg-blue-600 rounded-full transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-slate-500 font-mono w-10 text-right">
              {formatTime(totalDuration)}
            </span>
          </div>


          <div className="hidden sm:flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleVolumeToggle}
                className="size-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer border border-slate-100/50">
                {isMuted ? <FiVolumeX className="w-4 h-4" /> : <FiVolume2 className="w-4 h-4" />}
              </button>
              <button type="button" onClick={handleSpeedChange}
                className="h-10 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 font-mono text-xs font-bold transition-colors flex items-center justify-center cursor-pointer border border-slate-100/50">
                {playbackSpeed}x
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button type="button" onClick={(e) => { e.stopPropagation(); handleRewind(); }}
                className="size-11 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-all flex items-center justify-center cursor-pointer shadow-sm border border-slate-100/80 active:scale-95"
                title="Rewind 10 seconds">
                <FiRotateCcw className="w-4 h-4" />
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
                className="size-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
                {isPlaying ? <FiPause className="w-6 h-6 fill-current" /> : <FiPlay className="w-6 h-6 fill-current ml-1" />}
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); handleForward(); }}
                className="size-11 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-all flex items-center justify-center cursor-pointer shadow-sm border border-slate-100/80 active:scale-95"
                title="Forward 10 seconds">
                <FiRotateCw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={handleFullscreen}
                className="size-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer border border-slate-100/50"
                title="Toggle Fullscreen">
                <FiMaximize className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleDownload}
                className="size-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer border border-slate-100/50"
                title="Download video">
                <FiDownload className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex sm:hidden flex-col items-center gap-3 w-full">
            <div className="flex items-center justify-center gap-4">
              <button type="button" onClick={(e) => { e.stopPropagation(); handleRewind(); }}
                className="size-10 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-all flex items-center justify-center cursor-pointer shadow-sm border border-slate-100/80 active:scale-95"
                title="Rewind 10 seconds">
                <FiRotateCcw className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
                className="size-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
                {isPlaying ? <FiPause className="w-5 h-5 fill-current" /> : <FiPlay className="w-5 h-5 fill-current ml-0.5" />}
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); handleForward(); }}
                className="size-10 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-all flex items-center justify-center cursor-pointer shadow-sm border border-slate-100/80 active:scale-95"
                title="Forward 10 seconds">
                <FiRotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <button type="button" onClick={handleVolumeToggle}
                  className="size-9 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer border border-slate-100/50">
                  {isMuted ? <FiVolumeX className="w-3.5 h-3.5" /> : <FiVolume2 className="w-3.5 h-3.5" />}
                </button>
                <button type="button" onClick={handleSpeedChange}
                  className="h-9 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 font-mono text-xs font-bold transition-colors flex items-center justify-center cursor-pointer border border-slate-100/50">
                  {playbackSpeed}x
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" onClick={handleFullscreen}
                  className="size-9 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer border border-slate-100/50"
                  title="Toggle Fullscreen">
                  <FiMaximize className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={handleDownload}
                  className="size-9 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer border border-slate-100/50"
                  title="Download video">
                  <FiDownload className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDemo;
