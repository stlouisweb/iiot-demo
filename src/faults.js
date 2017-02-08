export function anyHasSpecificFault(limits, faultType, manifolds) {
  return Object.keys(manifolds).some(
    id => manifoldHasSpecificFault(limits, faultType, manifolds[id]));
}

export function manifoldHasSpecificFault(limits, faultType, manifold) {
  return manifold.some(valve => valveHasSpecificFault(limits, faultType, valve));
}

export function valveHasAnyFault(limits, valve) {
  return !valve ? false :
    valve.fault ||
    valve.leak ||
    valve.cycles > limits.cycles ||
    valve.pressure < limits.pressureMin ||
    valve.pressure > limits.pressureMax;
}

export function valveHasSpecificFault(limits, faultType, valve) {
  return !valve ? false :
    faultType === 'leak-fault' ? valve.leak :
    faultType === 'lifecycle' ? valve.cycles > limits.cycles :
    faultType === 'pressure-fault' ?
      valve.pressure < limits.pressureMin ||
      valve.pressure > limits.pressureMax :
    faultType === 'valve-fault' ? valve.fault :
    false;
}
