# Clone TabNews

Implementação de estudo do TabNews. Este documento é o glossário de domínio: fixa o vocabulário de autenticação e de conteúdo para que código, testes e conversas usem as mesmas palavras.

## Linguagem

### Autenticação

**Usuário**:
Pessoa com conta no sistema, identificada por um username único.
_Avoid_: conta, perfil, user

**Sessão**:
Vínculo autenticado entre um Usuário e um cliente, com prazo de validade absoluto — não é renovado pelo uso.
_Avoid_: login, token

**Token de sessão**:
Valor opaco pelo qual um cliente se identifica em uma requisição. É trocado por um Usuário.
_Avoid_: session id, credencial, password

**Cookie de sessão**:
Veículo que transporta o Token de sessão entre cliente e servidor.
_Avoid_: cookie de login

**Sessão válida**:
Sessão que existe e cujo prazo de validade ainda não venceu. Só uma Sessão válida identifica o Usuário atual.
_Avoid_: sessão ativa, sessão autenticada

**Usuário atual**:
O Usuário identificado pela Sessão válida da requisição.
_Avoid_: usuário logado, me, self

**Senha**:
Segredo escolhido pelo Usuário para provar a própria identidade. Não é armazenada nem devolvida por nenhuma interface.
_Avoid_: password, credencial

**Hash de senha**:
Verificador derivado irreversivelmente da Senha, usado para conferi-la em uma autenticação. Não é a Senha.
_Avoid_: password, senha criptografada, senha
