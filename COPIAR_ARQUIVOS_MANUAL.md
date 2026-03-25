# 📋 GUIA: COPIAR ARQUIVOS MANUALMENTE

## 🎯 PASSO A PASSO COMPLETO

### **PASSO 1: Criar estrutura de pastas**

No seu computador, crie esta estrutura (exemplo: `C:\ZapDelivery\`):

```
ZapDelivery/
├── backend/
└── frontend/
    ├── public/
    └── src/
        ├── pages/
        └── components/
            └── ui/
```

---

## 📂 **ARQUIVOS DO BACKEND**

### **1. backend/server.py**
👉 Veja o conteúdo completo no arquivo `/app/backend/server.py`
- Copie TODO o conteúdo (349 linhas)
- Cole em `ZapDelivery/backend/server.py`

### **2. backend/requirements.txt**
```
fastapi==0.110.1
uvicorn==0.25.0
python-dotenv>=1.0.1
pymongo==4.5.0
pydantic>=2.6.4
pyjwt>=2.10.1
bcrypt==4.1.3
passlib>=1.7.4
motor==3.3.1
python-multipart>=0.0.9
```

### **3. backend/.env**
```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="zapdelivery"
CORS_ORIGINS="*"
JWT_SECRET_KEY="zap-delivery-secret-key-2024-change-this-in-production-1a2b3c4d5e6f"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="$2b$12$9WJs8ZhqvMimYFfW7Oo/U.23DcxxVp/pJNu8MvfvsIgIyKBSJ2weO"
```
⚠️ **Atenção:** Quando hospedar, mude MONGO_URL, JWT_SECRET_KEY

---

## 📂 **ARQUIVOS DO FRONTEND - PRINCIPAIS**

Vou listar os arquivos principais. Para os componentes UI do Shadcn, você pode baixá-los depois.

### **Arquivos que você PRECISA copiar agora:**

1. **frontend/package.json** - Ver arquivo completo abaixo
2. **frontend/.env** - Configurações
3. **frontend/src/index.js** - Entrada do React
4. **frontend/src/index.css** - Estilos globais
5. **frontend/src/App.js** - Componente principal (BEM GRANDE)
6. **frontend/src/App.css** - Estilos do app
7. **frontend/src/pages/AdminLogin.js** - Página login admin
8. **frontend/src/pages/AdminDashboard.js** - Dashboard admin
9. **frontend/public/index.html** - HTML base
10. **frontend/tailwind.config.js** - Config Tailwind
11. **frontend/postcss.config.js** - Config PostCSS
12. **frontend/craco.config.js** - Config CRACO

---

## 🚀 **MÉTODO RÁPIDO: Use o Terminal do Emergent**

Se você tem acesso ao terminal/VS Code do Emergent:

### **Opção A: Ver todos os arquivos**
```bash
# Navegue para ver cada arquivo
cd /app
```

### **Opção B: Criar um ZIP**
```bash
cd /app
# Cria ZIP do backend
zip -r backend.zip backend/

# Cria ZIP do frontend (sem node_modules)
cd frontend
zip -r ../frontend.zip . -x "node_modules/*" -x "build/*"
```

Depois baixe os arquivos ZIP pela interface do Emergent.

---

## 📝 **LISTA COMPLETA DE ARQUIVOS**

Use essa lista de checklist:

### **Backend (3 arquivos):**
- [ ] backend/server.py (349 linhas)
- [ ] backend/requirements.txt (30 linhas)
- [ ] backend/.env (6 linhas)

### **Frontend (arquivos principais):**
- [ ] frontend/package.json
- [ ] frontend/.env
- [ ] frontend/craco.config.js
- [ ] frontend/tailwind.config.js
- [ ] frontend/postcss.config.js
- [ ] frontend/public/index.html
- [ ] frontend/public/manifest.json
- [ ] frontend/src/index.js
- [ ] frontend/src/index.css
- [ ] frontend/src/App.js (600+ linhas - GRANDE!)
- [ ] frontend/src/App.css
- [ ] frontend/src/pages/AdminLogin.js
- [ ] frontend/src/pages/AdminDashboard.js

### **Componentes UI Shadcn (muitos arquivos):**
Pasta: `frontend/src/components/ui/`
- [ ] button.jsx
- [ ] input.jsx
- [ ] textarea.jsx
- [ ] sheet.jsx
- [ ] dialog.jsx
- [ ] sonner.jsx
- [ ] use-toast.js (hook)
- ... e outros componentes

---

## 💡 **RECOMENDAÇÃO**

**Mais fácil:** Use a opção de salvar no GitHub do Emergent.

**Se não tiver GitHub:** Vou te passar os arquivos principais um por um nas próximas mensagens.

**Quer que eu mostre o conteúdo de quais arquivos primeiro?**

Opções:
1. Ver todos os arquivos do frontend agora (vai ser longo)
2. Ver só os arquivos principais (package.json, App.js, AdminDashboard.js)
3. Criar um script para você baixar tudo de uma vez

**Me diga qual opção prefere!**
