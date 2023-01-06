import {useEffect} from "react";
// @ts-ignore
import Plotly from "plotly.js/dist/plotly";

interface IntegralPlotProps {
    delimeter: number
    hasPoint: (x: number, y: number) => boolean
    func: (x: number, y: number) => number
    flag: boolean
    box: number[] | undefined
}

function IntegralPlot({delimeter, hasPoint, func, flag, box}: IntegralPlotProps) {

    useEffect(() => {
        if (box && flag && delimeter < 500) {
            let x_temp = []
            let y_temp = []
            let z_temp = []
            let c_temp = []
            let cnt = 1
            let x_step = (box[2] - box[0]) / delimeter
            let y_step = (box[1] - box[3]) / delimeter
            for (let i = box[0] + x_step / 2; i <= box[2]; i = i + x_step) {
                for (let j = box[3] + y_step / 2; j <= box[1]; j = j + y_step) {
                    if (hasPoint(i, j)) {
                        x_temp.push(i)
                        y_temp.push(j)
                        z_temp.push(func(i, j))
                        c_temp.push(cnt++)
                    }
                }
            }

            let layout = {
                title: 'График',
                autosize: true,
                margin: {
                    l: 65,
                    r: 50,
                    b: 65,
                    t: 90,
                }
            };

            Plotly.newPlot('integralPlot', [{
                x: x_temp,
                y: y_temp,
                z: z_temp,
                type: "scatter3d",
                mode: "markers",
                marker: {
                    color: c_temp,
                    size: delimeter > 50 ? 1 : 3,
                    symbol: 'circle',
                }
            }], layout, {showSendToCloud: true})
        }
    }, [flag, delimeter, func])

    return (
        <div className="m-3 p-2 bg-white rounded-xl shadow-lg">
            {(flag && delimeter <= 500) &&
                <div id="integralPlot"/>
            }
            {(flag && delimeter > 500) &&
                <p className="m-2 w-full text-center font-semibold text-neutral-700">
                     К сожалению, при количестве деления больше 500 3D-график не строится :(
                </p>
            }
            {!flag &&
                <p className="m-2 w-full text-center text-xl font-semibold text-neutral-700">Здесь будет 3D-график :)</p>
            }
        </div>
    )
}

export default IntegralPlot;

