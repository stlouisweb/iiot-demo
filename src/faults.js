export function anyHasFault(faultType, manifolds) {
  return Object.keys(manifolds).some(
    id => manifoldHasFault(faultType, manifolds[id]));
}

export function manifoldHasFault(faultType, manifold) {
  return manifold.some(valve => valveHasFault(faultType, valve));
}

export function valveHasFault(faultType, valve) {
  return !valve ? false :
    faultType === 'leak-fault' ? valve.leak :
    faultType === 'valve-fault' ? valve.fault :
    faultType === 'pressure-fault' ? valve.pressure > 100 : //TODO: FIX ME
    faultType === 'lifecycle' ? valve.cycles > 100 : //TODO: FIX ME
    false;
}
