import { obj } from './src/util/ConfigParser';
import { ShardingManager } from 'discord.js';

// Sharding
const shard = new ShardingManager('./build/main.js', {
    token: obj.TOKEN,
    totalShards: 'auto',
});
shard.on('shardCreate', (shard) => {
    console.log(`Shard # ${shard.id + 1}`);
});

shard.spawn();
