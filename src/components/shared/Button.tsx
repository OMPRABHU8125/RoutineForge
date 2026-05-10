import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import Typography from './Typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  icon,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? COLORS.background : COLORS.primary} />
      ) : (
        <>
          {icon && <ActivityIndicator />} 
          <Typography
            variant={size === 'sm' ? 'caption' : 'body'}
            weight="semi-bold"
            color={
              variant === 'primary'
                ? COLORS.background
                : variant === 'outline' || variant === 'ghost'
                ? COLORS.primary
                : COLORS.textPrimary
            }
          >
            {title}
          </Typography>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.surfaceElevated,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  sm: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    height: 36,
  },
  md: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    height: 48,
  },
  lg: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
