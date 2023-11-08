import { INestiaConfig } from "@nestia/sdk";
 
const config: INestiaConfig = {
    input: "apps/core/src/modules",
    output: "api-client",
    distribute: "packages/api-client",
};
export default config;