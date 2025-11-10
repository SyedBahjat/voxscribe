import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TranscriptionSegment {
  text: string;
  start: number;
  end: number;
  start_time: string;
  end_time: string;
}

/**
 * Converts seconds to WebVTT timestamp format (HH:MM:SS.mmm)
 */
function formatWebVTTTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}

/**
 * Converts transcription segments to WebVTT format
 */
export function segmentsToWebVTT(segments: TranscriptionSegment[]): string {
  let vtt = "WEBVTT\n\n";
  
  segments.forEach((segment, index) => {
    const startTime = formatWebVTTTimestamp(segment.start);
    const endTime = formatWebVTTTimestamp(segment.end);
    
    vtt += `${index + 1}\n`;
    vtt += `${startTime} --> ${endTime}\n`;
    vtt += `${segment.text}\n\n`;
  });
  
  return vtt;
}

/**
 * Converts transcription segments to SRT format
 */
export function segmentsToSRT(segments: TranscriptionSegment[]): string {
  let srt = "";
  
  segments.forEach((segment, index) => {
    const startTime = formatSRTTimestamp(segment.start);
    const endTime = formatSRTTimestamp(segment.end);
    
    srt += `${index + 1}\n`;
    srt += `${startTime} --> ${endTime}\n`;
    srt += `${segment.text}\n\n`;
  });
  
  return srt;
}

/**
 * Converts seconds to SRT timestamp format (HH:MM:SS,mmm)
 */
function formatSRTTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
}
