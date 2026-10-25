import fs from 'node:fs';

/**
 * Antigravity Lifecycle Hook: Safety Guard (PreToolUse)
 * Intercepts `run_command` tool calls and blocks dangerous or destructive commands.
 */

try {
  const rawInput = fs.readFileSync(0, 'utf-8');
  const payload = rawInput ? JSON.parse(rawInput) : {};

  const toolCall = payload.toolCall || {};
  const commandLine = toolCall.args?.CommandLine || '';

  // Patterns for dangerous or destructive commands
  const dangerousPatterns = [
    /git\s+reset\s+--hard/i,
    /git\s+clean\s+-[a-zA-Z]*f/i,
    /git\s+push\s+.*(--force|-f\b)/i,
    /rm\s+-rf\s+[/\\]/i,
    /rmdir\s+\/s\s+\/q\s+[c-zC-Z]:\\/i,
    /drop\s+database/i,
    /drop\s+table/i,
  ];

  const matchedPattern = dangerousPatterns.find((pattern) => pattern.test(commandLine));

  if (matchedPattern) {
    console.log(
      JSON.stringify({
        decision: 'deny',
        reason: `Blocked by Campus Helpdesk Safety Guard: Destructive command detected ("${commandLine.trim()}").`,
      })
    );
  } else {
    console.log(
      JSON.stringify({
        decision: 'allow',
      })
    );
  }
} catch (error) {
  // Gracefully fallback to allow if stdin parsing fails
  console.log(
    JSON.stringify({
      decision: 'allow',
      reason: `Hook error: ${error.message}`,
    })
  );
}
