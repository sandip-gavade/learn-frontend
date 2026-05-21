// Import specific items by name (must match exactly)

import { PI, add, capitalize } from './04-import-export.js';

console.log(PI); // 3.14159
console.log(add(2, 3)); // 5
console.log(capitalize('sandip')); // "React"

// You can rename on import:
import { add as sum } from './04-import-export.js';
console.log(sum(2, 3)); // 5

import Logger from './04-import-export.js'; // works
import MyLogger from './04-import-export.js'; // also works — same thing
import Whatever from './04-import-export.js'; // still works!

Logger.info('Server started');
MyLogger.info('Server started');
Whatever.info('Server started');
