import {useEffect, useState} from "react";

interface ResultProps {
    func: ((x: number, y: number) => number)[]
    delimeter: number
    flag: boolean
    hasPoint: (x: number, y: number) => boolean
    box: number[] | undefined
}

function Result({func, delimeter, flag, hasPoint, box}: ResultProps) {

    useEffect(() => {
        if (box && flag) {
            calculateIntegral()
        }
        if (!flag) {
            setResult(0)
            setError(0)
        }
    }, [func, delimeter, flag])

    const [result, setResult] = useState(0)
    const [error, setError] = useState(0)

    const hasRectangle = (x: number, y: number, x_width: number, y_width: number) => {
        return hasPoint(x - x_width / 2, y - y_width / 2) &&
            hasPoint(x + x_width / 2, y + y_width / 2) &&
            hasPoint(x - x_width / 2, y + y_width / 2) &&
            hasPoint(x + x_width / 2, y - y_width / 2)
    }

    const calculateIntegral = () => {
        let result_ = 0
        let error_ = 0

        let x_width = (box![2] - box![0]) / delimeter
        let y_width = (box![1] - box![3]) / delimeter
        console.log(box, x_width, y_width, delimeter)
        for (let i = 0; i < delimeter; i++) {
            for (let j = 0 ; j < delimeter; j++) {
                const x = box![0] + i * x_width + x_width / 2
                const y = box![3] + j * y_width + y_width / 2
                if (hasRectangle(x, y, x_width, y_width)) {
                    result_ += func[0](x, y) * x_width * y_width
                    error_ += (x_width * x_width * func[1](x, y) + y_width * y_width * func[2](x, y))
                }
            }
        }

        setResult(result_)
        setError((1/24) * x_width * y_width * error_)
    }

    return (
        <>
            <div className="m-3 p-2 rounded-xl bg-white shadow-lg flex flex-row justify-around">
                <div className="flex flex-col items-center m-1">
                    <p className="font-semibold text-xl">
                        Результат
                    </p>
                    <p className="font-bold text-2xl">
                        {result}
                    </p>
                </div>
                <div className="flex flex-col items-center m-1">
                    <p className="font-semibold text-xl">
                        Ошибка
                    </p>
                    <p className="font-bold text-2xl">
                        {error}
                    </p>
                </div>
            </div>
        </>
    )
}

export default Result