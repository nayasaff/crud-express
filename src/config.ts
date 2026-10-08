import { SSMClient, GetParametersByPathCommand } from "@aws-sdk/client-ssm";

const ssm = new SSMClient({ region: process.env.AWS_REGION || "us-east-1" });

export async function loadEnvFromParameterStore(path = "/production/") {
  try {
    const command = new GetParametersByPathCommand({
      Path: path,
      WithDecryption: true, // Automatically decrypts SecureString parameters
      Recursive: true
    });

    const response = await ssm.send(command);

    if (response.Parameters) {
      response.Parameters.forEach((param : any) => {
        // Example: Converts '/production/DB_HOST' -> 'DB_HOST'
        const key = param.Name.split("/").pop();
        process.env[key] = param.Value;
      });
      console.log("Successfully loaded environment variables from SSM Parameter Store.");
    }
  } catch (error) {
    console.error("Failed to fetch parameters from SSM:", error);
    throw error;
  }
}