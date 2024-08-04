export type Point = {
  row: number
  col: number
}

function isValid(
  matrix: number[][],
  visited: boolean[][],
  row: number,
  col: number
): boolean {
  return (
    row >= 0 &&
    col >= 0 &&
    row < matrix.length &&
    col < matrix[0].length &&
    (matrix[row][col] === 0 ||
      matrix[row][col] === 2 ||
      matrix[row][col] === 3) &&
    !visited[row][col]
  )
}

export function findShortestPath(
  matrix: number[][],
  start: Point,
  end: Point
): Point[] | null {
  const rows = matrix.length
  const cols = matrix[0].length

  const directions = [
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: -1, col: 0 },
  ]

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false))
  const prev: (Point | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  )

  const queue: { point: Point; dist: number }[] = [{ point: start, dist: 0 }]

  visited[start.row][start.col] = true

  while (queue.length > 0) {
    const { point, dist } = queue.shift()!

    if (point.row === end.row && point.col === end.col) {
      const path: Point[] = []
      let curr: Point | null = point
      while (curr) {
        path.push(curr)
        curr = prev[curr.row][curr.col]
      }
      path.reverse()
      return path
    }

    for (const dir of directions) {
      const newRow = point.row + dir.row
      const newCol = point.col + dir.col

      if (isValid(matrix, visited, newRow, newCol)) {
        visited[newRow][newCol] = true
        prev[newRow][newCol] = point
        queue.push({ point: { row: newRow, col: newCol }, dist: dist + 1 })
      }
    }
  }

  return null
}
