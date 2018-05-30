import * as React from "react";
import { MineSweeperGrid } from "../component/mineSweeperGrid";

interface MineSweeperScreenState {
	width: number;
	height: number;
	mineProbability: number;
	cells: number[][];
	frozen: boolean;
	won: boolean;
	timer: number;
	startTime: number;
	score: number;
	mineCount: number;
	remainingCells: number;
}
export class MineSweeperScreen extends React.Component<{}, MineSweeperScreenState> {

	constructor(props: {}) {
		super(props);
		this.state = {
			mineProbability: 0.1,
			width: 10,
			height: 10,
			cells: [],
			frozen: false,
			won: false,
			timer: 0,
			startTime: 0,
			score: 0,
			mineCount: 0,
			remainingCells: 0
		};
	}

	componentDidMount() {
		this.restart();
	}

	render() {
		const { width, height, cells } = this.state;
		return <div style={styles.container}>
			<div style={styles.content}>
				<div style={styles.header}>
					<div style={styles.score}>
						{this.state.score}
					</div>
					<div style={styles.restart} onClick={this.restart}>
						{this.state.frozen ? this.state.won ? "😎" : "😬" : "🙂"}
					</div>
					<div style={styles.score}>
						{Math.floor(this.state.timer / 1000)}
					</div>
				</div>
				<MineSweeperGrid
					width={width}
					height={height}
					cells={cells}
					onMineActivated={this.freeze}
					frozen={this.state.frozen}
					onFlagAdded={this.decreaseScore}
					onFlagRemoved={this.increaseScore}
					onCellActivated={this.decreaseRemainingCells}
				/>
			</div>
		</div>;
	}

		generateCells = () => {
		const { width, height, mineProbability } = this.state;
		const cells: number[][] = [];
		for (let i = 0; i < height; i++) {
			cells[i] = [];
			for (let j = 0; j < width; j++) {
				cells[i][j] = Math.random() < mineProbability ? 10 : 0;
			}
		}
		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				if (cells[i][j] < 10) {
					for (let k = i - 1; k < i + 2; k ++) {
						for (let l = j - 1; l < j + 2; l ++) {
							if (k > -1 && k < height && l > -1 && l < width && (k !== i || l !== j)) {
								if (cells[k][l] === 10) {
									cells[i][j] ++;
								}
							}
						}
					}
				}
			}
		}
		return cells;
	}

	freeze = () => {
		this.setState({ frozen: true });
	}

	decreaseScore = () => {
		this.setState(state => ({ score: state.score - 1}));
	}

	increaseScore = () => {
		this.setState(state => ({ score: state.score + 1}));
	}

	decreaseRemainingCells = () => {
		this.setState(state => ({ remainingCells: state.remainingCells - 1}), () => {
			if (this.state.remainingCells === this.state.mineCount) {
				this.setState({ frozen: true, won: true });
			}
		});
	}

	restart = () => {
		const cells = this.generateCells();
		const mineCount = this.flatten(cells).reduce((acc, cell) => acc + (cell === 10), 0);
		const remainingCells = this.state.width * this.state.height;
		this.setState({
			cells,
			frozen: false,
			timer: 0,
			startTime: Date.now(),
			mineCount,
			score: mineCount,
			remainingCells,
			won: false
		});
		requestAnimationFrame(this.updateTimer);
	}

	updateTimer = () => {
		if (this.state.frozen) {
			return;
		}
		this.setState(state => {
			const timer = (new Date()).getTime() - state.startTime;
			return { timer };
		});
		requestAnimationFrame(this.updateTimer);
	}

	flatten = (array: any[]): any[] => {
		return array.reduce((flat, toFlatten) => flat.concat(Array.isArray(toFlatten) ? this.flatten(toFlatten) : toFlatten), []);
	}
}

const styles = {
	container: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	},
	content: {
		display: "flex",
		flexDirection: "column" as "column",
		MozUserSelect: "none" as "none",
		WebkitUserSelect: "none" as "none",
		msUserSelect: "none" as "none"

	},
	header: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 5,
		fontSize: 20,
		alignSelf: "stretch"
	},
	score: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "black",
		color: "red",
		border: "solid 1px #e2e2e2",
		borderRadius: 5,
		width: "100px",
		padding: 2
	},
	restart: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		padding: 2,
		border: "solid 1px #e2e2e2",
		borderRadius: 5,
		cursor: "pointer"
	}
};
