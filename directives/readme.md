# Directives

This folder contains Standard Operating Procedures (SOPs) for the AI agent.

## Structure
Each directive should follow this template:

- **Goal**: What is the purpose of this directive?
- **Inputs**: What information/files are needed?
- **Execution**: Which scripts in `execution/` should be called?
- **Outputs**: What are the expected results?
- **Edge Cases**: What should be handled if things go wrong?

## Usage
When the AI is asked to perform a task, it should first check this folder for a relevant directive.
If one exists, it follows the SOP. If not, it may create a new one based on the task.
