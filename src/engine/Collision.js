// LexiQuest Axis-Aligned Sliding Collision System
export class Collision {
    static isTileSolid(mapGrid, tileCols, tileRows, tileSize, x, y) {
        const col = Math.floor(x / tileSize);
        const row = Math.floor(y / tileSize);

        if (row < 0 || row >= tileRows || col < 0 || col >= tileCols) {
            return true;
        }

        const tile = mapGrid[row][col];
        // Tile 1 (Deep Water), Tile 3 (Outer Wall), Tile 4 (Dense Forest Tree) are solid!
        return tile === 1 || tile === 3 || tile === 4;
    }

    static resolveMovement(entity, dx, dy, speed, mapGrid, tileCols, tileRows, tileSize) {
        if (dx === 0 && dy === 0) return { x: entity.x, y: entity.y };

        const stepX = dx * speed;
        const stepY = dy * speed;

        const margin = 12;
        const footY = 48; // Foot bounding level for 48x64 sprite

        let newX = entity.x;
        let newY = entity.y;

        // Test X Movement independently for smooth wall sliding
        if (stepX !== 0) {
            const targetX = entity.x + stepX;
            const canMoveX = !this.isTileSolid(mapGrid, tileCols, tileRows, tileSize, targetX + margin, entity.y + footY) &&
                             !this.isTileSolid(mapGrid, tileCols, tileRows, tileSize, targetX + entity.width - margin, entity.y + footY);
            if (canMoveX) {
                newX = targetX;
            }
        }

        // Test Y Movement independently
        if (stepY !== 0) {
            const targetY = entity.y + stepY;
            const canMoveY = !this.isTileSolid(mapGrid, tileCols, tileRows, tileSize, entity.x + margin, targetY + footY) &&
                             !this.isTileSolid(mapGrid, tileCols, tileRows, tileSize, entity.x + entity.width - margin, targetY + footY);
            if (canMoveY) {
                newY = targetY;
            }
        }

        return { x: newX, y: newY };
    }
}
