# Extensões Recomendadas do VS Code/Cursor

Este projeto inclui um arquivo `.vscode/extensions.json` com extensões recomendadas que melhoram a experiência de desenvolvimento e ajudam a detectar erros.

## Extensões Instaladas

Quando você abrir este projeto no VS Code ou Cursor, você receberá uma notificação sugerindo a instalação das seguintes extensões:

### Essenciais

1. **ESLint** (`dbaeumer.vscode-eslint`)
   - Detecta erros de código JavaScript/React em tempo real
   - Mostra problemas de linting diretamente no editor
   - Corrige automaticamente problemas ao salvar

2. **Prettier** (`esbenp.prettier-vscode`)
   - Formata código automaticamente
   - Mantém consistência no estilo do código
   - Integrado com as configurações do projeto

3. **Error Lens** (`usernamehw.errorlens`)
   - Mostra erros e avisos diretamente na linha do código
   - Facilita a identificação rápida de problemas
   - Melhora significativamente a visibilidade de erros

### Suporte ao Next.js e React

4. **TypeScript and JavaScript Language Features** (`ms-vscode.vscode-typescript-next`)
   - Suporte aprimorado para JavaScript
   - IntelliSense melhorado
   - Detecção de erros de tipo e sintaxe

5. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
   - Autocomplete para classes Tailwind CSS
   - Validação de classes
   - Sugestões de classes

### Testes

6. **Jest** (`orta.vscode-jest`)
   - Executa testes Jest diretamente do editor
   - Mostra status dos testes inline
   - Debug de testes integrado

7. **Playwright Test for VSCode** (`ms-playwright.playwright`)
   - Suporte para testes Playwright (se usado no futuro)
   - Debug de testes E2E

### DevOps e Ferramentas

8. **Docker** (`ms-azuretools.vscode-docker`)
   - Gerenciamento de containers Docker
   - Visualização de imagens e containers
   - Útil para o ambiente de desenvolvimento com Docker Compose

9. **GitLens** (`eamodio.gitlens`)
   - Visualização avançada do Git
   - Histórico de commits inline
   - Facilita o trabalho com Conventional Commits

10. **Path Intellisense** (`christian-kohler.path-intellisense`)
    - Autocomplete para caminhos de arquivos
    - Facilita imports e referências

## Como Instalar

1. Abra o projeto no VS Code ou Cursor
2. Você receberá uma notificação perguntando se deseja instalar as extensões recomendadas
3. Clique em "Install All" ou "Instalar Todas"
4. Alternativamente, você pode instalar manualmente através da aba Extensions (Ctrl+Shift+X)

## Configurações do Projeto

As configurações do projeto estão em `.vscode/settings.json` e incluem:

- Formatação automática ao salvar
- Correção automática de problemas do ESLint
- Validação de código em tempo real
- Formatação com Prettier

## Solução de Problemas

Se os erros não estiverem aparecendo:

1. Certifique-se de que a extensão ESLint está instalada e habilitada
2. Verifique se o ESLint está rodando: abra o Output (Ctrl+Shift+U) e selecione "ESLint"
3. Recarregue a janela: Ctrl+Shift+P → "Developer: Reload Window"
4. Verifique se o Node.js está instalado e acessível no PATH
5. Execute `npm install` para garantir que todas as dependências estão instaladas
