import { Collisions, Polygon, Result, Circle } from 'detect-collisions'

const getBox = (opt: { x?: number; y?: number; w?: number; h?: number }) => {
  const { x = 0, y = 0, w = 1, h = 1 } = opt
  return new Polygon(
    x,
    y,
    [
      [0, 0],
      [w, 0],
      [w, h],
      [0, h],
    ],
    0,
    1,
    1,
    0.25,
  )
}

describe('Test collision library', () => {
  let system: Collisions
  let result: Result

  beforeEach(() => {
    system = new Collisions()
    result = system.createResult()
  })

  //  bb
  // foof
  // ffff
  // b = box; o = overlaping; f = floor
  test('Box colliding vertically into floor', () => {
    const box = getBox({
      w: 2,
      h: 2,
      x: -1,
      y: -1,
    })
    system.insert(box)
    const floor = getBox({
      w: 4,
      h: 1,
      x: -2,
      y: -1,
    })
    system.insert(floor)

    system.update()

    const boxPotentials = box.potentials()
    expect(boxPotentials).toHaveLength(1)
    const boxIsColliding = box.collides(boxPotentials[0], result)
    expect(boxIsColliding).toStrictEqual(true)
    expect(result.overlap).toBeCloseTo(1)
    expect(result.overlap_x).toBeCloseTo(0)
    expect(result.overlap_y).toBeCloseTo(-1)

    // when testing the collided object with the collider, result vector is opposite
    const floorPotentials = floor.potentials()
    expect(floorPotentials).toHaveLength(1)
    const floorIsColliding = floor.collides(floorPotentials[0], result)
    expect(floorIsColliding).toStrictEqual(true)
    expect(result.overlap).toBeCloseTo(1)
    expect(result.overlap_x).toBeCloseTo(0)
    expect(result.overlap_y).toBeCloseTo(1)
  })

  // bbb
  // bbofff
  // bbofff
  //   ffff
  //   ffff
  // b = box; o = overlaping; f = floor
  test('Box colliding partially into floor', () => {
    const box = getBox({
      w: 3,
      h: 3,
      x: -2,
      y: -2,
    })
    system.insert(box)
    const floor = getBox({
      w: 4,
      h: 4,
      x: 0,
      y: -4,
    })
    system.insert(floor)

    system.update()

    // with two AABB polygon the overlap is not diagonal but the shortest side of the overlapping area
    // !! even if overlaping area is perfectly square, one of the two side is chosen arbitrarily
    const boxPotentials = box.potentials()
    expect(boxPotentials).toHaveLength(1)
    const boxIsColliding = box.collides(boxPotentials[0], result)
    expect(boxIsColliding).toStrictEqual(true)
    expect(result.overlap).toBeCloseTo(1)
    expect(result.overlap_x).toBeCloseTo(1)
    expect(result.overlap_y).toBeCloseTo(0)
  })

  test('Box should not collide twice after moving, without updating system', () => {
    const box = getBox({
      w: 2,
      h: 2,
      x: -1,
      y: -1,
    })
    system.insert(box)
    const floor = getBox({
      w: 4,
      h: 1,
      x: -2,
      y: -1,
    })
    system.insert(floor)

    system.update()

    const boxPotentials = box.potentials()
    expect(boxPotentials).toHaveLength(1)
    const boxIsColliding = box.collides(boxPotentials[0], result)
    expect(boxIsColliding).toStrictEqual(true)
    expect(result.overlap).toBeCloseTo(1)
    expect(result.overlap_x).toBeCloseTo(0)
    expect(result.overlap_y).toBeCloseTo(-1)

    box.x -= result.overlap_x * result.overlap
    box.y -= result.overlap_y * result.overlap

    const boxIsColliding2 = box.collides(boxPotentials[0], result)
    expect(boxIsColliding2).toStrictEqual(false)
    expect(result.overlap).toBeNull() // !! vector norm is null (and not 0)
    expect(result.overlap_x).toBeCloseTo(0)
    expect(result.overlap_y).toBeCloseTo(0)
  })

  test('Collision with ball', () => {
    const ball = new Circle(-1, 1, 2, 1, 0.25)
    system.insert(ball)

    const floor = new Polygon(
      0,
      0,
      [
        [-4, -2],
        [4, -2],
        [4, 0],
        [-4, 0],
      ],
      Math.PI / 4,
      1,
      1,
      0.25,
    )
    system.insert(floor)

    system.update()
    const ballPotentials = ball.potentials()
    expect(ballPotentials).toHaveLength(1)
    ball.collides(ballPotentials[0], result)
    expect(result.collision).toStrictEqual(true)

    expect(result.overlap).toBeCloseTo(0.585)
    expect(result.overlap_x).toBeCloseTo(Math.sqrt(2) / 2)
    expect(result.overlap_y).toBeCloseTo(-Math.sqrt(2) / 2)
  })
})
