export function anyHasFault(limits, faultType, manifolds) {
  return Object.keys(manifolds).some(
    id => manifoldHasFault(limits, faultType, manifolds[id]));
}

export function manifoldHasFault(limits, faultType, manifold) {
  return manifold.some(valve => valveHasFault(limits, faultType, valve));
}

export function valveHasFault(limits, faultType, valve) {
  return !valve ? false :
    faultType === 'leak-fault' ? valve.leak :
    faultType === 'lifecycle' ? valve.cycles > limits.cycles :
    faultType === 'pressure-fault' ?
      valve.pressure < limits.pressureMin ||
      valve.pressure > limits.pressureMax :
    faultType === 'valve-fault' ? valve.fault :
    false;
}
