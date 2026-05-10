import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { Camera, useCameraDevice, PhotoFile, useCameraPermission } from 'react-native-vision-camera';
import { X, Zap } from 'lucide-react-native';
import { COLORS, SPACING } from '../../theme';
import Typography from '../shared/Typography';

interface CameraCaptureProps {
  onCapture: (photo: PhotoFile) => void;
  onClose: () => void;
  children?: React.ReactNode;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onClose,
  children,
}) => {
  const camera = useRef<any>(null);
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [flash, setFlash] = useState<'off' | 'on'>('off');

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const takePhoto = async () => {
    if (!camera.current) {
      Alert.alert('Error', 'Camera is not ready yet. Please wait a moment.');
      return;
    }

    try {
      // DEBUG: Snapshot is more compatible than takePhoto on Emulators
      const photo = await camera.current.takeSnapshot({
        flash: device?.hasFlash ? flash : 'off',
      });

      if (photo) {
        onCapture(photo);
      }
    } catch (e: any) {
      console.error('Capture Error:', e);
      Alert.alert('Capture Failed', 'Failed to capture image. If you are on an emulator, ensure the camera is configured in settings.');
    }
  };

  if (!hasPermission) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Typography>No Camera Permission</Typography>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Typography>No Camera Device Found</Typography>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Typography color={COLORS.primary}>Go Back</Typography>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        enableZoomGesture={true}
      />
      
      {children}

      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.iconButton}>
          <X color={COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setFlash(f => f === 'on' ? 'off' : 'on')} 
          style={styles.iconButton}
        >
          <Zap color={flash === 'on' ? COLORS.primary : COLORS.textPrimary} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={takePhoto} style={styles.captureButton}>
          <View style={styles.captureInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
  },
});
