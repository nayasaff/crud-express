"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnvFromParameterStore = loadEnvFromParameterStore;
const client_ssm_1 = require("@aws-sdk/client-ssm");
const ssm = new client_ssm_1.SSMClient({ region: process.env.AWS_REGION || "us-east-1" });
async function loadEnvFromParameterStore(path = "/production/") {
    try {
        const command = new client_ssm_1.GetParametersByPathCommand({
            Path: path,
            WithDecryption: true, // Automatically decrypts SecureString parameters
            Recursive: true
        });
        const response = await ssm.send(command);
        if (response.Parameters) {
            response.Parameters.forEach((param) => {
                // Example: Converts '/production/DB_HOST' -> 'DB_HOST'
                const key = param.Name.split("/").pop();
                process.env[key] = param.Value;
            });
            console.log("Successfully loaded environment variables from SSM Parameter Store.");
        }
    }
    catch (error) {
        console.error("Failed to fetch parameters from SSM:", error);
        throw error;
    }
}
