# Contributing to RailFlow Optimizer

Thank you for your interest in contributing to **RailFlow Optimizer**!

## Development Workflow

1. **Fork & Clone** the repository.
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Install dependencies and configure environment variables**:
   ```bash
   npm install
   cp .env.example .env.local
   ```
4. **Make your changes** following the codebase conventions:
   - Use TypeScript with strict typing (`src/lib/types.ts`).
   - Keep UI components modular under `src/components/`.
   - Define Zod input/output schemas for any new Genkit AI flows under `src/ai/flows/`.
   - Do not commit `.env`, `.env.local`, API keys, or service account credentials.
5. **Run verification checks** before opening a pull request:
   ```bash
   npm run typecheck
   npm run build
   ```
   *(Optional: run `npm run lint` if ESLint is configured in your environment.)*
6. **Commit & Push** with clear, descriptive commit messages (e.g., `feat: add Firestore sync for live trains`).
7. **Open a Pull Request** describing the motivation, changes made, and verification steps performed.
