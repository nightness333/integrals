import React, {useState} from 'react';
import './App.css';
import Result from "./components/Result";
import Graph from "./components/Graph";
import IntegralPlot from "./components/IntegralPlot";
import Latex from "react-latex";

function App() {

  const [polygon, setPolygon] = useState<JXG.Polygon>()
  const [board, setBoard] = useState<JXG.Board>()
  const [showPlot, setShowPlot] = useState(false)

  const [delimeter, setDelimeter] = useState(10)

  const func1_init = (x: number, y: number): number => {
    return x*x + x*y + y*y
  }

  const func1_diff_x = (x: number, y: number): number => {
    return 2*x + y
  }

  const func1_diff_y = (x: number, y: number): number => {
    return x + 2*y
  }

  const func1_error = (x: number, y: number): number => {
    return 2
  }

  const func2_init = (x: number, y: number): number => {
    return y*Math.cos(x*y)
  }

  const func2_diff_x = (x: number, y: number): number => {
    return - (y * y) * Math.sin(x*y)
  }

  const func2_diff_y = (x: number, y: number): number => {
    return Math.cos(x*y) - x * y * Math.sin(x*y)
  }

  const func2_error = (x: number, y: number): number => {
    return Math.max(Math.abs(-y * (2 + x * y)), Math.abs(-y * y * y), Math.abs(-x * (2 + x * y)))
  }

  const func3_init = (x: number, y: number): number => {
    return (1/9)*y*Math.exp(x)
  }

  const func3_diff_x = (x: number, y: number): number => {
    return (1/9)*y*Math.exp(x)
  }

  const func3_diff_y = (x: number, y: number): number => {
    return (1/9)*Math.exp(x)
  }

  const func3_error = (x: number, y: number): number => {
    return y / 9 * Math.exp(x)
  }

  const [selectedFunc, setFunc] = useState<((x: number, y: number) => number)[]>([func1_init, func1_diff_x, func1_diff_y])

  const hasPoint = (x: number, y: number): boolean => {
    if (board && polygon) {
      let c = new JXG.Coords(JXG.COORDS_BY_USER, [x, y], board)
      return polygon.hasPoint(c.scrCoords[1], c.scrCoords[2])
    }
    return false
  }

  const onChangeDelimeter = (e: React.FormEvent<HTMLInputElement>) => {
    let newValue = Number(e.currentTarget.value)
    if (!isNaN(newValue)) {
      setDelimeter(newValue as number)
    }
  }

  const clear = () => {
    setPolygon(undefined)
    setBoard(undefined)
    setShowPlot(false)
    setDelimeter(10)
  }

  return (
      <div className="flex flex-col items-center bg-zinc-200 h-full bg-repeat">
        <div className="transition duration-300 m-3 shadow-lg bg-neutral-800 rounded-xl hover:bg-neutral-500 hover:translate-y-1 hover:scale-110">
          <p className="m-2 p-1 font-semibold text-zinc-200 ">
            Вычисление интеграла по области
          </p>
        </div>
        <div className="flex w-full">
          <div className="w-1/2">
            <Graph integralPolygon={polygon} setPolygon={setPolygon} board={board} setBoard={setBoard}/>
            <div className="m-3 p-4 rounded-xl bg-white shadow-lg flex flex-col items-center">
              <div className="w-full flex flex-col">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="delimeter">
                  Разбиение области
                </label>
                <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-zinc-500"
                    value={delimeter} onChange={onChangeDelimeter} type="text"/>
              </div>
              <div className="inline-flex w-full m-1 my-3" role="group">
                <button type="button" onClick={() => setFunc([func1_init, func1_diff_x, func1_diff_y, func1_error])}
                        className="w-1/3 rounded-lg inline-block m-2 p-2 bg-neutral-600 text-white hover:bg-neutral-800 focus:bg-neutral-800 focus:outline-none focus:ring-0 active:bg-neutral-800 transition duration-300">
                  <Latex>$x^2 + xy + y^2$</Latex>
                </button>
                <button type="button" onClick={() => setFunc([func2_init, func2_diff_x, func2_diff_y, func2_error])}
                        className="w-1/3 rounded-lg inline-block m-2 p-2 bg-neutral-600 text-white hover:bg-neutral-800 focus:bg-neutral-800 focus:outline-none focus:ring-0 active:bg-neutral-800 transition duration-300">
                  <Latex>$ycos(xy)$</Latex>
                </button>
                <button type="button" onClick={() => setFunc([func3_init, func3_diff_x, func3_diff_y, func3_error])}
                        className="w-1/3 rounded-lg inline-block m-2 p-2 bg-neutral-600 text-white hover:bg-neutral-800 focus:bg-neutral-800 focus:outline-none focus:ring-0 active:bg-neutral-800 transition duration-300">
                  <Latex displayMode={true}>{'$\\frac{1}{9}ye^x$'}</Latex>
                </button>
              </div>
              <div className="flex w-full">
                <button className="transition duration-300 m-3 shadow-lg bg-neutral-800 rounded-xl hover:bg-neutral-500 hover:translate-y-1 hover:scale-110 w-1/2"
                  onClick={() => setShowPlot(true)}>
                  <p className="m-2 font-semibold text-zinc-200">
                    Вычислить
                  </p>
                </button>
                <button className="transition duration-300 m-3 shadow-lg bg-neutral-800 rounded-xl hover:bg-neutral-500 hover:translate-y-1 hover:scale-110 w-1/2"
                  onClick={clear}>
                  <p className="m-2 font-semibold text-zinc-200">
                    Очистить
                  </p>
                </button>
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <Result func={selectedFunc} delimeter={delimeter} flag={showPlot} hasPoint={hasPoint} box={polygon?.boundingBox()}/>
            <IntegralPlot delimeter={delimeter} hasPoint={hasPoint} func={selectedFunc[0]} flag={showPlot} box={polygon?.boundingBox()}/>
            <div className="m-3 p-4 rounded-xl bg-white shadow-lg">
              <p className="w-full text-center text-xl font-semibold m-1">Описание работы</p>
              <p>Прямоугольник в котором находится функция разбивается по каждой из координат на число разбиения области. После значение интеграла находится методом ячеек. Значение ошибки находится с помощью суммирования погрешности интегрирования каждой ячейки.</p>
            </div>
          </div>
        </div>
      </div>
  );
}

export default App;
