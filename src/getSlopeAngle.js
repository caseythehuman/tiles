export function getSlopeAngle(s1, s2) {
  return (Math.atan((s2[1] - s1[1]) / (s2[0] - s1[0])) * 180) / Math.PI;
}
