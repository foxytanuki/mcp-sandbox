import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ethers } from "ethers"; // Import ethers

// RPC URL provided by the user
const ETHEREUM_MAINNET_RPC_URL = "https://ethereum-rpc.publicnode.com";

// Create MCP server instance
const server = new McpServer({
  name: "ethereum-gas", // Server name specific to this functionality
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Initialize ethers provider with the specified RPC URL
const provider = new ethers.JsonRpcProvider(ETHEREUM_MAINNET_RPC_URL);

// Register the tool to get gas price
server.tool(
  "get-gas-price",
  "Get current Ethereum gas price information on the Ethereum mainnet", // Updated description
  {}, // No input schema needed for this tool
  async () => {
    try {
      // Fetch fee data from the provider
      const feeData = await provider.getFeeData();

      // Validate that feeData and necessary properties exist
      if (
        !feeData ||
        feeData.gasPrice === null ||
        feeData.maxFeePerGas === null ||
        feeData.maxPriorityFeePerGas === null
      ) {
        return {
          content: [
            {
              type: "text",
              text: "Failed to retrieve complete gas price data from the RPC provider. Some values might be missing.",
            },
          ],
        };
      }

      // Format the BigInt values to Gwei strings
      const gasPriceGwei = ethers.formatUnits(feeData.gasPrice, "gwei");
      const maxFeePerGasGwei = ethers.formatUnits(feeData.maxFeePerGas, "gwei");
      const maxPriorityFeePerGasGwei = ethers.formatUnits(
        feeData.maxPriorityFeePerGas,
        "gwei"
      );

      // Prepare the response text
      const gasPriceText = `Current Ethereum Mainnet Gas Price:
Gas Price: ${gasPriceGwei} Gwei
Max Fee Per Gas: ${maxFeePerGasGwei} Gwei
Max Priority Fee Per Gas: ${maxPriorityFeePerGasGwei} Gwei`;

      return {
        content: [
          {
            type: "text",
            text: gasPriceText,
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching gas price:", error);
      let errorMessage = "Failed to retrieve gas price data.";
      // Add specific error message if available
      if (error instanceof Error) {
        errorMessage += ` Error: ${error.message}`;
      }
      return {
        content: [
          {
            type: "text",
            text: errorMessage,
          },
        ],
      };
    }
  }
);

// Main function to start the server using StdioTransport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Ethereum Gas MCP Server running on stdio"); // Updated console message
}

// Execute main and handle potential errors
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
