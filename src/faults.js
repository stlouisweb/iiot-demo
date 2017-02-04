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
    faultType === 'valve-fault' ? valve.fault :
    faultType === 'pressure-fault' ? valve.pressure > limits.pressure :
    faultType === 'lifecycle' ? valve.cycles > limits.cycles :
    false;
}
