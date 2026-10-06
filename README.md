Boi-Gestor-4.0

#🐂 BoiGestor A ponte entre o campo e produtor. O BoiGestor é um software brasileiro focado em tirar a gestão da fazenda do papel e do "olhômetro". Ele organiza o ciclo de vida do rebanho, garantindo que o suor do dia a dia no curral se transforme em dados para decisões inteligentes.

#🎯 O que ele resolve? Fim do "Cemitério de Dados": Transforma anotações físicas em histórico digital útil.

Controle Sanitário: Gestão de vacinas e medicamentos sem perda de prazos.

Decisão Precisa: Sai o "olho" e entra o GMD (Ganho de Peso Médio Diário).

Comunicação Real: Elimina o "telefone sem fio" entre o capataz e o proprietário.

#✨ Funcionalidades Cadastro: Identificação individual, raça e genealogia.

Produção: Pesagens periódicas e controle leiteiro.

Saúde: Calendário sanitário e carência de medicamentos.

Offline: Pensado para a realidade da conectividade no campo.

#💡 Diferencial Interface humanizada e simples, feita para quem não quer perder tempo na frente de uma tela, mas sim aumentar a rentabilidade do seu gado. Focado em todos os produtores brasileiros — do familiar ao grande confinamento.

---

## 🚀 Como rodar o projeto (primeira vez)

Esse projeto tem duas partes:
- **Front-end** (`index.html`, `Login/login.html` etc.) — roda no navegador via Live Server.
- **Backend** (pasta `backend/`) — servidor Node.js que conecta no MongoDB Atlas.

### 1. Pegue o arquivo `.env`

O arquivo `backend/.env` **não vem pelo GitHub** (fica de fora por segurança, ele tem a senha do banco). Peça esse arquivo pra quem te passou o projeto, por fora do GitHub (WhatsApp, e-mail, etc.), e coloque ele dentro da pasta `backend/`.

Se você não tiver esse arquivo, crie um `backend/.env` com base no `backend/.env.example`, preenchendo com sua própria string de conexão do MongoDB Atlas.

### 2. Instale as dependências do backend

```bash
cd backend
npm install
```

### 3. Ligue o backend

```bash
npm start
```

Deixe esse terminal aberto. Você deve ver:
```
✅ Conectado ao MongoDB Atlas! Banco: boiGestorDB
🚀 Servidor rodando em http://localhost:3000
```

Se aparecer `Cannot find module` → você pulou o passo 2 (`npm install`).
Se aparecer `❌ Erro ao conectar no MongoDB Atlas` → confira o `.env` (passo 1) e se o seu IP está liberado no Atlas em **Network Access**.

### 4. Abra o site

Com o backend rodando, abra `Login/login.html` (ou `index.html`) com o Live Server, normalmente.

**Não abra `http://localhost:3000` no navegador** — ali é só a API, não o site.

---

## Scripts úteis (dentro da pasta `backend/`)

| Comando | O que faz |
|---|---|
| `npm start` | Liga o servidor (precisa estar rodando pra usar o site) |
| `npm run migrar` | Copia dados do Supabase antigo pro MongoDB (rodar só uma vez, no início) |
| `npm run verificar` | Mostra quantos usuários/bois estão salvos no MongoDB, pra conferir |

