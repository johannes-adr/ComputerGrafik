package org.example;

import org.bukkit.block.Block;
import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.plugin.java.JavaPlugin;

import org.bukkit.Location;
import org.bukkit.Material;
import org.bukkit.World;

public class Main extends JavaPlugin {
    public static int radius = 50;
    @Override
    public void onEnable(){
        System.out.println("Hi");
    }

    private static int fmax(double... vals){
        double max = vals[0];
        for(int i = 1;i < vals.length;i++){
            double ival = vals[i];
            if(ival > max){
                max = ival;
            }
        }
        return (int)max;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        var world = sender.getServer().getWorld("world");
        if (command.getName().equalsIgnoreCase("noise")){
            for(int x = -radius;x < radius;x++){
                for(int z = -radius;z < radius;z++){
                    for(int y = 0; y < 70; y++){
                        Location loc = new Location(world,x, y,z);
                        loc.getBlock().setType(Material.AIR);
                    }
                }
            }
            sender.sendMessage("Building");

            Location target = new Location(world,0,80,-50);
            target.getBlock().setType(Material.STONE);
            target.setY(target.getY() + 2);
            sender.getServer().getPlayer(sender.getName()).teleport(target);

            buildWorld(world);

            sender.sendMessage("Done");
            return true;
        }else if (command.getName().equalsIgnoreCase("empty")){
            sender.sendMessage("Done1");
        }
        return false;
    }


    private void calculate(int x, int z, PerlinNouse noise1, PerlinNouse noise2, PerlinNouse noise3, World world, int terrain_base, int world_bottom, Material[]mat){
        float xf = (float)x;
        float zf = (float)z;
        double flat_y = noise1.noise(xf / 4,zf / 4) * 6;//Calculate a relatively flat wold
        double hilly_y = noise2.noise(xf ,zf ) * 20;
        double water_noise = noise3.noise(xf,zf);
        int y = fmax(flat_y, hilly_y);
        y += terrain_base;
        int topLevelY = y;



        Block topLevelBlock = new Location(world, x, topLevelY, z).getBlock();
        if(water_noise < 0.4 || flat_y < hilly_y){
            topLevelBlock.setType(Material.GRASS_BLOCK);
        }else if(water_noise < 0.6){
            topLevelBlock.setType(Material.SAND);
        }else{
            topLevelBlock.setType(Material.WATER);
        }

        //Show flat_y and hilly_y
        {
            float offset = (float)radius * (float)2.2 * 2; //Show slowy
            new Location(world, x + offset, terrain_base + flat_y, z).getBlock().setType(Material.GRASS_BLOCK);
            offset = (float)radius * (float)2.2 * 4; //Show hilly_y

            for(int yoff = 0; yoff < 5;yoff++){
                new Location(world, x + offset, terrain_base + hilly_y - yoff, z).getBlock().setType(Material.STONE);

            }

            offset = (float)radius * (float)2.2 * 6; //Show slow and hilly combined
            new Location(world, x + offset, terrain_base + flat_y, z).getBlock().setType(Material.GRASS_BLOCK);
            new Location(world, x + offset, terrain_base + hilly_y, z).getBlock().setType(Material.STONE);
            offset = (float)radius * (float)2.2 * 8; //Show slow and hilly combined
            for(int i = topLevelY;i > world_bottom;i--){
                float yf = (float)i - world_bottom; //around 50 to 0
                double noise = noise1.noise(xf,yf,zf);
                if(noise * (1.0 - yf / 50) > 0.3){
                    new Location(world, x + offset, i, z).getBlock().setType(Material.STONE);
                }
            }
            double slow_y_norm = flat_y / 6;
            double hilly_y_norm = hilly_y / 20;
            offset = (float)radius * (float)2.2 * 10; //Show slow again but 2d perlin

            new Location(world, x + offset, terrain_base, z).getBlock().setType(mat[(int)(((slow_y_norm + 1.0) * 10) % 5)]);

            offset = (float)radius * (float)2.2 * 12; //Show fast again but 2d perlin

            new Location(world, x + offset, terrain_base, z).getBlock().setType(mat[(int)(((hilly_y_norm + 1.0) * 10) % 5)]);


            offset = (float)radius * (float)2.2 * 2; //Show slow again but 2d perlin

            new Location(world, x, terrain_base, z + offset).getBlock().setType(mat[(int)((((slow_y_norm + hilly_y_norm + 2.0) / 2) * 10) % 5)]);


            new Location(world, x + offset, terrain_base, z + offset).getBlock().setType(mat[(int)(((Math.max(slow_y_norm,hilly_y_norm) + 1.0) * 10) % 5)]);
        }

        //Build Top Grass layer



        y-=1;
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
        }
    }


    public void buildWorld(World world){

        double PI2 = Math.PI * 2;
        double fac = 2;
        PerlinNouse noise1 = new PerlinNouse("TheFirstNoise".hashCode());
        PerlinNouse noise2 = new PerlinNouse("TheSecondPerlinNoise".hashCode());
        PerlinNouse noise3 = new PerlinNouse("TheWaterPerlinNoise".hashCode());
        Material[] mat = new Material[]{Material.STONE,Material.BLACK_STAINED_GLASS,Material.GRAY_STAINED_GLASS,Material.LIGHT_GRAY_STAINED_GLASS,Material.WHITE_STAINED_GLASS};



        int terrain_base = 50;
        int world_bottom = 25;
        int radius = 50;
        for(int x = -radius;x < radius;x++){
            for(int z = -radius;z < radius;z++){
                calculate(x,z,noise1,noise2,noise3,world,terrain_base,world_bottom,mat);
            }
        }
    }


    public void buildCristalRock(World world){

        double PI2 = Math.PI * 2;
        double fac = 2;
        PerlinNouse nouse = new PerlinNouse();

        Material[] mat = new Material[]{Material.STONE,Material.BLACK_STAINED_GLASS,Material.GRAY_STAINED_GLASS,Material.LIGHT_GRAY_STAINED_GLASS,Material.WHITE_STAINED_GLASS};
        Material[] mat2 = new Material[]{Material.WHITE_STAINED_GLASS,Material.LIGHT_GRAY_STAINED_GLASS,Material.GRAY_STAINED_GLASS,Material.GREEN_STAINED_GLASS,Material.BLACK_STAINED_GLASS};
        float v = (float) 1;
        for(int x = -radius;x < radius;x++){
            for(int z = -radius;z < radius;z++){
                for(int y = 0; y < 70; y++){
                    float trig_x = (float)x / v;
                    float trig_z = (float)z / v;
                    float trig_y = (float)y / v / 5;
                    double sum = nouse.noise(trig_x,trig_y,trig_z);



                    if(sum <= 0.15){
                        Material material = mat[(int)(((sum + 1.0) * 10) % 5)];
                        Location loc = new Location(world,x + 2 * radius, y,z);
                        loc.getBlock().setType(Material.STONE);
                    }
                }
            }
        }
    }

    public void buildCube(Location start, Location end, Material material) {
        World world = start.getWorld();
        if (world != end.getWorld()) {
            throw new IllegalArgumentException("Locations must be in the same world");
        }

        // Make sure the start is the smallest corner and end is the largest corner
        int minX = Math.min(start.getBlockX(), end.getBlockX());
        int minY = Math.min(start.getBlockY(), end.getBlockY());
        int minZ = Math.min(start.getBlockZ(), end.getBlockZ());
        int maxX = Math.max(start.getBlockX(), end.getBlockX());
        int maxY = Math.max(start.getBlockY(), end.getBlockY());
        int maxZ = Math.max(start.getBlockZ(), end.getBlockZ());

        for (int x = minX; x <= maxX; x++) {
            for (int y = minY; y <= maxY; y++) {
                for (int z = minZ; z <= maxZ; z++) {
                    Location blockLocation = new Location(world, x, y, z);
                    blockLocation.getBlock().setType(material);
                }
            }
        }
    }
}


