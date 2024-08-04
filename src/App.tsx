import { useEffect, useState } from "react"
import useWindowDimensions from "./hooks/viewport"
import "./App.css"
import { findShortestPath, Point } from "./functions/dijkstra"

function App() {
  const { width, height } = useWindowDimensions()
  const SELECT_START = "SELECT_START"
  const SELECT_END = "SELECT_END"
  const ADD_WALL = "ADD_WALL"
  const NO_EDIT = "NO_EDIT"
  const ANIMATION_SPEED = 50
  type Mode =
    | typeof SELECT_START
    | typeof SELECT_END
    | typeof ADD_WALL
    | typeof NO_EDIT
  const rows = Math.floor((height - 60) / 25)
  const cols = Math.floor((width - 36) / 22)

  const [mode, setMode] = useState<Mode>(SELECT_START)
  const [start, setStart] = useState<Point>({ row: 0, col: 0 })
  const [end, setEnd] = useState<Point>({ row: rows - 1, col: cols - 1 })
  const [grid, setGrid] = useState<number[][]>(
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0))
  )

  const [isSolving, setIsSolving] = useState(false)

  useEffect(() => {
    const newGrid = JSON.parse(JSON.stringify(grid))
    newGrid[start.row][start.col] = 2
    newGrid[end.row][end.col] = 3
    setGrid(newGrid)
  }, [])

  const handleCellSelect = (i: number, j: number) => {
    const newGrid = JSON.parse(JSON.stringify(grid))
    switch (mode) {
      case SELECT_START:
        newGrid[start.row][start.col] = 0
        newGrid[i][j] = 2
        setStart({ row: i, col: j })
        break
      case SELECT_END:
        newGrid[end.row][end.col] = 0
        newGrid[i][j] = 3
        setEnd({ row: i, col: j })
        break
      case ADD_WALL:
        newGrid[i][j] = newGrid[i][j] === 1 ? 0 : 1
        break
    }
    setGrid(newGrid)
  }

  const getBackground = (cell: number) => {
    switch (cell) {
      case 0:
        return "white"
      case 1:
        return "black"
      case 2:
        return "green"
      case 3:
        return "red"
      case 4:
        return "aqua"
    }
  }

  function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  const handleSolve = async () => {
    setMode(NO_EDIT)
    setIsSolving(true)
    const path = findShortestPath(grid, start, end)
    if (path) {
      for (const point of path) {
        setGrid((grid) => addWaypoint(grid, point.row, point.col))
        await delay(ANIMATION_SPEED)
      }
    } else {
      alert("No path found")
    }
    setIsSolving(false)
  }

  const addWaypoint = (grid: number[][], i: number, j: number) => {
    const newGrid = JSON.parse(JSON.stringify(grid))
    newGrid[i][j] = newGrid[i][j] === 0 ? 4 : newGrid[i][j]
    return newGrid
  }

  return (
    <>
      <div className="grid-container">
        {grid.map((row, i) => (
          <div key={i} className="row">
            {row.map((_, j) => (
              <div
                key={j}
                className="cell"
                style={{ backgroundColor: getBackground(grid[i][j]) }}
                onClick={() => handleCellSelect(i, j)}
              >
                {/* {cell} */}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        className="controls"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <button
          onClick={() => {
            setMode(SELECT_START)
          }}
          disabled={mode === NO_EDIT}
          className={mode === SELECT_START ? "selected" : ""}
        >
          Select start point
        </button>
        <button
          onClick={() => {
            setMode(SELECT_END)
          }}
          disabled={mode === NO_EDIT}
          className={mode === SELECT_END ? "selected" : ""}
        >
          Select end point
        </button>
        <button
          onClick={() => {
            setMode(ADD_WALL)
          }}
          disabled={mode === NO_EDIT}
          className={mode === ADD_WALL ? "selected" : ""}
        >
          Add wall
        </button>
        <button onClick={handleSolve} disabled={isSolving}>
          Solve
        </button>
        <button
          onClick={() => {
            setGrid(
              Array.from({ length: rows }, () =>
                Array.from({ length: cols }, () => 0)
              )
            )
            setGrid((grid) => {
              grid[start.row][start.col] = 2
              grid[end.row][end.col] = 3
              return grid
            })
            setMode(SELECT_START)
          }}
          disabled={isSolving}
        >
          Clear
        </button>
      </div>
    </>
  )
}

export default App
