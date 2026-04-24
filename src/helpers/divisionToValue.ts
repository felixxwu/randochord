export function divisionToValue({
  division,
  maxDivisions,
  minValue,
  maxValue,
  exp = 1,
}: {
  division: number
  maxDivisions: number
  minValue: number
  maxValue: number
  exp?: number
}) {
  const span = maxValue - minValue
  const percentage = division / maxDivisions

  return minValue + span * Math.pow(percentage, exp)
}
