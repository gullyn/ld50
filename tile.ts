class Tile {
	public x: number;
	public y: number;

	public displayX: number;
	public displayY: number;

	public type: string;
	
	constructor(x: number, y: number, type: string, displayX: number, displayY: number) {
		this.x = x;
		this.y = y;
		this.type = type;
		this.displayX = displayX;
		this.displayY = displayY;
	}
}