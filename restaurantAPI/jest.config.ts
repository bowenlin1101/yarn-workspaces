import type {Config} from '@jest/types';

// Sync object

export default {
    verbose:true,
    moduleDirectories: ["node_modules", "src"],
    globals: {
        "ts-jest": {
          isolatedModules: true,
        },
    },
    transform:{}
  };
