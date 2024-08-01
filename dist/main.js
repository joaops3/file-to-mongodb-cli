#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_module_1 = require("./app.module");
const nest_commander_1 = require("nest-commander");
process.on('unhandledRejection', (reason) => {
    console.error(reason);
    process.exit(-1);
});
process.on('uncaughtException', (reason) => {
    console.error(reason);
    process.exit(-1);
});
async function bootstrap() {
    await nest_commander_1.CommandFactory.run(app_module_1.AppModule);
}
bootstrap();
//# sourceMappingURL=main.js.map