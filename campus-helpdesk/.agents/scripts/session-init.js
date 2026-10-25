import fs from 'node:fs';

/**
 * Antigravity Lifecycle Hook: Session Initializer (SessionStart)
 * Injects welcome context and policy notification when a conversation session starts.
 */

try {
  // Read stdin to consume payload
  try {
    fs.readFileSync(0, 'utf-8');
  } catch {
    // Stdin might be empty
  }

  const output = {
    injectSteps: [
      {
        systemMessage: {
          systemMessage:
            '🎓 Campus Helpdesk Lifecycle Hooks active: Safety Guard and Code Quality reminders are loaded.',
        },
      },
    ],
  };

  console.log(JSON.stringify(output));
} catch {
  console.log(JSON.stringify({ injectSteps: [] }));
}
