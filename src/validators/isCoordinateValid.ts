export const isCoordinatesStringValid = (coordinates: string) => {
  return (
    coordinates.length === 2 && coordinates.split('').every(isCoordinateValid)
  );
};

export const isCoordinateValid = (coordinate: string) => {
  return !isNaN(coordinate as any) && coordinate.length === 1;
};
