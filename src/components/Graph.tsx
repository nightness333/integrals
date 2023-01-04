import {useEffect, useState} from "react";
import * as JXG from "jsxgraph";

interface GraphProps {
    integralPolygon: JXG.Polygon | undefined
    setPolygon: (polygon: JXG.Polygon) => void
    board: JXG.Board | undefined
    setBoard: (board: JXG.Board) => void
}

const graphStyles = {
    height: '300px',
    width: '100%'
}

function Graph({integralPolygon, setPolygon, board, setBoard}: GraphProps) {

    const [points, setPoints] = useState<JXG.Point[]>([])

    useEffect(() => {
        if (!board && !integralPolygon) {
            setPoints([])
            setBoard(JXG.JSXGraph.initBoard('jxgbox', {axis: true, boundingbox: [-5, 5, 5, -5]}))
        }
    }, [integralPolygon, board])

    const getMouseCoords = (e: React.MouseEvent, i: number): JXG.Coords => {
        let cPos = board!.getCoordsTopLeftCorner()
        let absPos = JXG.getPosition(e, i)
        let dx = absPos[0] - cPos[0]
        let dy = absPos[1] - cPos[1];
        return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], board!)
    }

    const drawPoint = (e: React.MouseEvent) => {
        let coords: JXG.Coords = getMouseCoords(e, 0)
        let point: JXG.Point = board!.create('point', [coords.usrCoords[1] * 100 / 100, coords.usrCoords[2] * 100 / 100], {name: '', size: 2, fixed: true, color: 'red'})
        if (points.length === 2) {
            setPolygon(board!.create('polygon', [...points, point], {
                borders: {strokeColor: 'black'},
                fixed: true,
                hasInnerPoints: true
            }))
        }
        if (integralPolygon) {
            integralPolygon.addPoints(point)
        }
        setPoints([...points, point])
    }



    return (
        <div className="m-3 p-2 bg-white rounded-xl shadow-lg">
            <div onClick={drawPoint} id="jxgbox" style={graphStyles}></div>
        </div>
    )
}

export default Graph