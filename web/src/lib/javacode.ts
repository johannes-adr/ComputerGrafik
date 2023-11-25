export const PERLIN_INIT = 
`PerlinNouse noise1 = new PerlinNouse("TheFirstNoise".hashCode());
PerlinNouse noise2 = new PerlinNouse("TheSecondPerlinNoise".hashCode());
PerlinNouse noise3 = new PerlinNouse("TheWaterPerlinNoise".hashCode());`


export const ITERATE_2D_COORDS = 
`int terrain_base = 50;
int world_bottom = 25;
int radius = 50;
for(int x = -radius;x < radius;x++){
    for(int z = -radius;z < radius;z++){
        calculate(x,z,...);
    }
}`

export const CALCULATE_TERRAIN_HEIGHT = 
`float xf = (float)x;
float zf = (float)z;
double flat_y = noise1.noise(xf / 4,zf / 4) * 6;//Calculate a relatively flat wold
double hilly_y = noise2.noise(xf ,zf ) * 20;
double water_noise = noise3.noise(xf,zf);
int y = fmax(flat_y, hilly_y);
y += terrain_base;
int topLevelY = y;`

export const SET_TOPLEVEL_BLOCK =
`Block topLevelBlock = new Location(world, x, topLevelY, z).getBlock();
if(water_noise < 0.4 || flat_y < hilly_y){
    topLevelBlock.setType(Material.GRASS_BLOCK);
}else if(water_noise < 0.6){
    topLevelBlock.setType(Material.SAND);
}else{
    topLevelBlock.setType(Material.WATER);
}`;

export const BUILD_CAVES = 
`y-=1;
//Fill to bottom with dirt and stone
for(;y > world_bottom;y--){
    new Location(world, x, y, z).getBlock().setType(y > topLevelY-5?Material.DIRT:Material.STONE);
}

//Build caves
for(;topLevelY > world_bottom;topLevelY--){
    float yf = (float)topLevelY - world_bottom; //around 50 to 0
    double noise = noise1.noise(xf,yf,zf);
    if(noise * (1.0 - yf / 50) > 0.3){
        new Location(world, x, topLevelY, z).getBlock().setType(Material.AIR);
    }
}`