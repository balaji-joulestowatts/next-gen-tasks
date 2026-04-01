import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Camera,
  Download,
  Mic,
  Square,
  SwitchCamera,
} from "lucide-react";

function stopStream(stream: MediaStream | null) {
  if (!stream) return;
  for (const track of stream.getTracks()) track.stop();
}

function pickSupportedMimeType(candidates: string[]) {
  if (typeof MediaRecorder === "undefined") return undefined;
  for (const mimeType of candidates) {
    if (MediaRecorder.isTypeSupported(mimeType)) return mimeType;
  }
  return undefined;
}

export function MediaToolsCard() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<"user" | "environment">("user");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const micChunksRef = useRef<BlobPart[]>([]);

  const audioMimeType = useMemo(
    () =>
      pickSupportedMimeType([
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
      ]),
    [],
  );

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    return () => {
      stopStream(cameraStream);
      stopStream(micStream);
      if (photoUrl) URL.revokeObjectURL(photoUrl);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // Intentionally omit URLs from deps so cleanup runs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraStream, micStream]);

  const canUseMediaDevices =
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function";

  async function startCamera() {
    setCameraError(null);

    if (!canUseMediaDevices) {
      setCameraError("Camera is not supported in this browser/environment.");
      return;
    }

    try {
      stopStream(cameraStream);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacingMode },
        audio: false,
      });
      setCameraStream(stream);
    } catch (e) {
      setCameraError(e instanceof Error ? e.message : "Failed to access camera.");
      setCameraStream(null);
    }
  }

  function stopCamera() {
    stopStream(cameraStream);
    setCameraStream(null);
  }

  async function switchCamera() {
    const next = cameraFacingMode === "user" ? "environment" : "user";
    setCameraFacingMode(next);

    if (!cameraStream) return;

    try {
      stopStream(cameraStream);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: next },
        audio: false,
      });
      setCameraStream(stream);
    } catch (e) {
      setCameraError(e instanceof Error ? e.message : "Failed to switch camera.");
      setCameraStream(null);
    }
  }

  async function takePhoto() {
    setCameraError(null);

    const video = videoRef.current;
    if (!video) return;

    if (!cameraStream) {
      setCameraError("Start the camera first.");
      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) {
      setCameraError("Camera is not ready yet. Try again in a moment.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setCameraError("Unable to capture photo.");
      return;
    }

    ctx.drawImage(video, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );

    if (!blob) {
      setCameraError("Unable to capture photo.");
      return;
    }

    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(blob));
  }

  async function startMicRecording() {
    setMicError(null);

    if (!canUseMediaDevices) {
      setMicError("Microphone is not supported in this browser/environment.");
      return;
    }

    if (typeof MediaRecorder === "undefined") {
      setMicError("Audio recording is not supported in this browser.");
      return;
    }

    try {
      stopStream(micStream);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });

      const recorder = new MediaRecorder(stream, audioMimeType ? { mimeType: audioMimeType } : undefined);
      micChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) micChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(micChunksRef.current, {
          type: audioMimeType ?? "audio/webm",
        });

        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(URL.createObjectURL(blob));

        stopStream(stream);
        setMicStream(null);
        setIsRecording(false);
      };

      mediaRecorderRef.current = recorder;
      setMicStream(stream);
      setIsRecording(true);
      recorder.start();
    } catch (e) {
      setMicError(e instanceof Error ? e.message : "Failed to access microphone.");
      setMicStream(null);
      setIsRecording(false);
    }
  }

  function stopMicRecording() {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    if (recorder.state !== "inactive") {
      recorder.stop();
    }
  }

  return (
    <Card className="glass">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Camera & Mic</CardTitle>
        <CardDescription>
          Use your device camera/microphone in-browser (works on HTTPS or localhost).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="camera">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="camera" className="gap-2">
              <Camera className="h-4 w-4" />
              Camera
            </TabsTrigger>
            <TabsTrigger value="mic" className="gap-2">
              <Mic className="h-4 w-4" />
              Mic
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-3">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-video rounded-md bg-muted object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {cameraStream ? (
                <Button variant="secondary" onClick={stopCamera} className="gap-2">
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
              ) : (
                <Button onClick={startCamera} className="gap-2">
                  <Camera className="h-4 w-4" />
                  Start
                </Button>
              )}

              <Button
                variant="outline"
                onClick={switchCamera}
                className="gap-2"
                disabled={!canUseMediaDevices}
              >
                <SwitchCamera className="h-4 w-4" />
                Switch
              </Button>

              <Button
                variant="outline"
                onClick={takePhoto}
                className="gap-2"
                disabled={!cameraStream}
              >
                Take photo
              </Button>

              {photoUrl ? (
                <Button asChild variant="outline" className="gap-2">
                  <a href={photoUrl} download="photo.png">
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </Button>
              ) : null}
            </div>

            {cameraError ? (
              <div className="text-sm text-destructive">{cameraError}</div>
            ) : null}

            {photoUrl ? (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Last photo</div>
                <img
                  src={photoUrl}
                  alt="Captured"
                  className="w-full rounded-lg border bg-muted/30"
                />
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="mic" className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {isRecording ? (
                <Button variant="secondary" onClick={stopMicRecording} className="gap-2">
                  <Square className="h-4 w-4" />
                  Stop recording
                </Button>
              ) : (
                <Button onClick={startMicRecording} className="gap-2">
                  <Mic className="h-4 w-4" />
                  Start recording
                </Button>
              )}

              {audioUrl ? (
                <Button asChild variant="outline" className="gap-2">
                  <a href={audioUrl} download="recording.webm">
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </Button>
              ) : null}
            </div>

            {micError ? <div className="text-sm text-destructive">{micError}</div> : null}

            {audioUrl ? (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Last recording</div>
                <audio src={audioUrl} controls className="w-full" />
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                {isRecording ? "Recording…" : "No recording yet."}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
