import React from 'react';
import { View, StyleSheet, ViewProps, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

interface CardProps extends ViewProps {
  onPress?: () => void;
  variant?: 'elevated' | 'outline' | 'flat';
  padding?: keyof typeof SPACING;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  variant = 'elevated',
  padding = 'md',
  style,
  ...props
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.base,
        styles[variant],
        { padding: SPACING[padding] },
        style,
      ]}
      {...props}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  elevated: {
    backgroundColor: COLORS.surface,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  flat: {
    backgroundColor: COLORS.surfaceElevated,
  },
});

export default Card;
