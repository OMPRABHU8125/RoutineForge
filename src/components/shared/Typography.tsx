import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { COLORS } from '../../theme';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'bold' | 'semi-bold';
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  color = COLORS.textPrimary,
  align = 'left',
  weight = 'normal',
  style,
  ...props
}) => {
  const getFontWeight = () => {
    if (weight === 'bold') return '700';
    if (weight === 'semi-bold') return '600';
    return '400';
  };

  return (
    <Text
      style={[
        styles[variant],
        { color, textAlign: align, fontWeight: getFontWeight() },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: COLORS.textTertiary,
  },
});

export default Typography;
