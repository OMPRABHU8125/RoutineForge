import { useState, useCallback } from 'react';
import { PhotoFile } from 'react-native-vision-camera';

export type CameraStep = 'idle' | 'capturing' | 'preview' | 'analyzing' | 'result';

export const useCameraSystem = () => {
  const [step, setStep] = useState<CameraStep>('idle');
  const [capturedPhoto, setCapturedPhoto] = useState<PhotoFile | null>(null);

  const startCapture = useCallback(() => setStep('capturing'), []);
  const cancelCapture = useCallback(() => {
    setStep('idle');
    setCapturedPhoto(null);
  }, []);

  const onCapture = useCallback((photo: PhotoFile) => {
    setCapturedPhoto(photo);
    setStep('analyzing');
  }, []);

  const finishAnalysis = useCallback(() => {
    setStep('result');
  }, []);

  const reset = useCallback(() => {
    setStep('idle');
    setCapturedPhoto(null);
  }, []);

  return {
    step,
    setStep,
    capturedPhoto,
    startCapture,
    cancelCapture,
    onCapture,
    finishAnalysis,
    reset,
  };
};
