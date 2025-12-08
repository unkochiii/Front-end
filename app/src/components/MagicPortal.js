import Svg, { Circle, Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';

const MagicPortal = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Defs>
        <LinearGradient id="portalGradient" x1="0" y1="0" x2="64" y2="64">
          <Stop offset="0%" stopColor="#8e2de2" />
          <Stop offset="50%" stopColor="#4a00e0" />
          <Stop offset="100%" stopColor="#00d4ff" />
        </LinearGradient>
      </Defs>
      
      {/* Cercle extérieur du portail */}
      <Circle cx="32" cy="32" r="30" stroke="url(#portalGradient)" strokeWidth="4" />
      
      {/* Éclats magiques */}
      <G stroke="url(#portalGradient)" strokeWidth="2" strokeLinecap="round">
        <Path d="M32 2 L32 12" />
        <Path d="M32 52 L32 62" />
        <Path d="M2 32 L12 32" />
        <Path d="M52 32 L62 32" />
        <Path d="M10 10 L18 18" />
        <Path d="M46 46 L54 54" />
        <Path d="M10 54 L18 46" />
        <Path d="M46 18 L54 10" />
      </G>
      
      {/* Spirales intérieures pour effet magique */}
      <Path
        d="M32 16 C38 16, 38 48, 32 48 C26 48, 26 16, 32 16 Z"
        stroke="url(#portalGradient)"
        strokeWidth="2"
        fill="none"
      />
      <Path
        d="M32 20 C36 20, 36 44, 32 44 C28 44, 28 20, 32 20 Z"
        stroke="url(#portalGradient)"
        strokeWidth="2"
        fill="none"
      />
    </Svg>
  );
};

export default MagicPortal;
