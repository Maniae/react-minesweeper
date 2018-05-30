import * as React from "react";

enum CellStatus { HIDDEN, FLAGGED, ACTIVATED }
interface CellProps {
	frozen: boolean;
	value: number;
	onMineActivated: () => void;
	onFlagAdded: () => void;
	onFlagRemoved: () => void;
	onCellActivated: (activatedIndexes: number[]) => void;
}
interface CellState {
	status: CellStatus;
}
export class Cell extends React.PureComponent<CellProps, CellState> {
	constructor(props: CellProps) {
		super(props);
		this.state = { status: CellStatus.HIDDEN };
	}

	render() {
		const status = this.state.status;
		return <div
			style={{...styles.cell, backgroundColor: status === CellStatus.ACTIVATED ? "#a0a0a0" : "#e2e2e2"}}
			onClick={() => this.activateCell([])} onContextMenu={this.setStatus}
		>
			{this.renderCellContent()}
		</div>;
	}

	private renderCellContent = () => {
		switch (this.state.status) {
			case CellStatus.HIDDEN:
				return null;
			case CellStatus.FLAGGED:
				return <div>
					🏴󠁧󠁢󠁥󠁮󠁧󠁿
				</div>;
			case CellStatus.ACTIVATED:
				return <div>
				{this.props.value === 10 ? "💣" : this.props.value || ""}
			</div>;
		}
	}

	componentWillReceiveProps(props: CellProps) {
		if (!props.frozen) {
			this.setState({ status: CellStatus.HIDDEN });
		}
	}

	private setStatus = (e: React.MouseEvent<HTMLDivElement>) => {
		if (this.props.frozen) {
			return;
		}
		e.preventDefault();
		const currentStatus = this.state.status;
		if (currentStatus === CellStatus.ACTIVATED) {
			return;
		}
		if (currentStatus === CellStatus.FLAGGED) {
			this.setState({ status: CellStatus.HIDDEN });
			this.props.onFlagRemoved();
		} else {
			if (currentStatus === CellStatus.HIDDEN) {
				this.setState({ status: CellStatus.FLAGGED });
				this.props.onFlagAdded();
			}
		}
	}

	activateCell = (activatedIndexes: number[]) => {
		if (this.props.frozen) {
			return;
		}
		const currentStatus = this.state.status;
		if (currentStatus === CellStatus.ACTIVATED) {
			return;
		}
		this.setState({ status: CellStatus.ACTIVATED }, () => {
			if (this.props.value === 10) {
				this.props.onMineActivated();
			} else {
				this.props.onCellActivated(activatedIndexes);
				if (currentStatus === CellStatus.FLAGGED) {
					this.props.onFlagRemoved();
				}
			}
		});
	}
}

const styles = {
	cell: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "40px",
		height: "40px",
		margin: "2px",
		cursor: "pointer"
	},
	activated: {
		backgroundColor: "#a0a0a0"
	}
};
