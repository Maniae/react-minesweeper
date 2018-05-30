import * as React from "react";
import { Cell } from "./cell";

interface MineSweeperGridProps {
	width: number;
	height: number;
	cells: number[][];
	frozen: boolean;
	onMineActivated: () => void;
	onFlagAdded: () => void;
	onFlagRemoved: () => void;
	onCellActivated: () => void;
}
export class MineSweeperGrid extends React.PureComponent<MineSweeperGridProps> {

	private cells: (Cell | null)[] = [];
	render() {
		const { onMineActivated, onFlagAdded, onFlagRemoved, cells, width, height, frozen } = this.props;
		return <div style={{display: "flex", flexDirection: "column"}}>
			{cells.map((row, rowIndex) =>
				<div style={{display: "flex"}} key={rowIndex}>
					{row.map((cell, index) =>
						<Cell
							ref={c => this.cells[rowIndex * width + index] = c}
							key={index}
							frozen={frozen}
							value={cell}
							onMineActivated={onMineActivated}
							onFlagAdded={onFlagAdded}
							onFlagRemoved={onFlagRemoved}
							onCellActivated={(activatedIndexes) => this.activateCell(rowIndex, index, activatedIndexes)}
						/>
					)}
				</div>
			)}
		</div>;
	}

	getCells = () => {
		return this.props.cells;
	}

	activateCell = (i: number, j: number, activatedIndexes: number[]) => {
		const { onCellActivated, cells, width, height } = this.props;
		onCellActivated();
		if (cells[i][j] === 0) {
			for (let k = i - 1; k < i + 2; k ++) {
				for (let l = j - 1; l < j + 2; l ++) {
					if (k > -1 && k < this.props.height && l > -1 && l < this.props.width && (k !== i || l !== j)) {
						const cell = this.cells[k * width + l];
						if (cell && !activatedIndexes[k * width + l]) {
							activatedIndexes[k * width + l] = 1;
							cell.activateCell(activatedIndexes);
						}
					}
				}
			}
		}
	}
}
