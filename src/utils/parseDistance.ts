const parseDistance = (distance?: number): string => {
  if (distance === null || distance === undefined) return '- m';

  if (distance > 1000) {
    return `${Math.round((distance / 1000) * 10) / 10} km`;
  }

  return `${distance} m`;
};

export default parseDistance;
