"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LiveCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setPlaying(true);
        setError("");
      }
    } catch (err: any) {
      setError("Não foi possível acessar a câmera. Verifique as permissões.");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setPlaying(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-white">Câmera ao Vivo</span>
          </div>
          
          <Button onClick={playing ? stopCamera : startCamera} variant={playing ? "destructive" : "default"}>
            {playing ? (
              <>
                <Pause className="mr-2 h-4 w-4" /> Parar
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Iniciar Câmera
              </>
            )}
          </Button>
        </div>

        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          {!playing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/70">
              <Camera className="h-16 w-16 mb-4" />
              <p className="text-lg">Câmera desligada</p>
              <p className="text-sm mt-1">Clique em "Iniciar Câmera" acima</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}