import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { COLORS } from '../../theme';

const { width, height } = Dimensions.get('window');

interface PoseGuideProps {
  regionId: 'arms' | 'abdomen' | 'fullbody';
}

export const PoseGuide: React.FC<PoseGuideProps> = ({ regionId }) => {
  const renderGuide = () => {
    switch (regionId) {
      case 'arms':
        return (
          <G scale="1.5" translate={`${width / 4}, ${height / 6}`}>
             {/* Simple flexed arm silhouette placeholder */}
            <Path
              d="M50,100 C70,80 90,80 110,100 C130,120 120,150 100,160 C80,170 60,160 50,140 Z"
              stroke={COLORS.primary}
              strokeWidth="2"
              fill="rgba(208, 253, 62, 0.1)"
              strokeDasharray="5,5"
            />
          </G>
        );
      case 'abdomen':
        return (
          <G scale="2" translate={`${width / 6}, ${height / 5}`}>
            {/* Torso/Abdomen silhouette placeholder */}
            <Path
              d="M40,50 L100,50 L120,150 L20,150 Z"
              stroke={COLORS.primary}
              strokeWidth="2"
              fill="rgba(208, 253, 62, 0.1)"
              strokeDasharray="5,5"
            />
          </G>
        );
      default:
        return (
          <G scale="0.8" translate={`${width / 4}, 50`}>
            {/* Full body standing silhouette placeholder */}
            <Path
              d="M100,20 L120,50 L110,100 L120,200 L80,200 L90,100 L80,50 Z"
              stroke={COLORS.primary}
              strokeWidth="2"
              fill="rgba(208, 253, 62, 0.1)"
              strokeDasharray="5,5"
            />
          </G>
        );
    }
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height}>
        {renderGuide()}
      </Svg>
    </View>
  );
};
