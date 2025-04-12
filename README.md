# MCP SANDBOX


Ensure that you have configured Claude Desktop as shown below. For more details, refer to the [Document](https://modelcontextprotocol.io/quickstart/server#testing-your-server-with-claude-for-desktop-2)

`claude_desktop_config.json`
```json
{
  "mcpServers": {
      "weather": {
          "command": "node",
          "args": [
              "/Users/foxy/mcp-sandbox/build/weather.js"
          ]
      }
  }
}
```
