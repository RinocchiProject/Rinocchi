import { readFileSync } from 'fs';
import Parse from './src/util/ConfigParser';
import { ShardingManager } from 'discord.js';

const content = readFileSync('./CONFIG', 'utf-8'),
    obj = Object.assign({}, ...Parse(content));

global.settings = obj;

// Sharding
new ShardingManager('./build/main.js', {
    token: obj.TOKEN,
    totalShards: 'auto',
}).on('shardCreate', (shard) => {
    console.log(`Shard # ${shard.id + 1}`);
});
