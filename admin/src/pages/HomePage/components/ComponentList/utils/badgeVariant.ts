export const getBadgeVariant = (count: number): string => {
  if (count === 0) return 'secondary';
  if (count < 5) return 'success';
  if (count < 10) return 'warning';
  return 'danger';
};

export const isComponentSelected = (
  selectedComponent: any,
  componentUid: string
): boolean => {
  return selectedComponent?.uid === componentUid;
};
