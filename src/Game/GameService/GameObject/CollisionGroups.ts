
// A collision group or solver group is described as a pair of bit masks:

// The group's membership indicates what groups the collider is part of (one bit per group).
// The group's filter indicates what groups the collider can interact with (one bit per group).
// The membership and filter are both 16-bit bit masks packed into a single 32-bit value.
// The 16 left-most bits contain the memberships whereas the 16 right-most bits contain the filter.

// For example, let's say we want our collider A to be part of the groups [0, 2, 3]
// and to be able to interact with the groups [2],
// then its groups membership is 0b0000_0000_0000_1101 = 0x000D
// and its groups filter is 0b0000_0000_0000_0100 = 0x0004.
// The corresponding packed bit mask is 0x000D0004.

export enum CollisionGroups {
  WALLS = 0x0001000F,
  BALL = 0x00020007,
  SOLID_CHARACTERS = 0x00040007,
  GHOST_CHARACTERS = 0x00080001,
}
