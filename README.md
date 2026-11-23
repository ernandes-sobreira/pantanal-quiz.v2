# Pantanal Quiz (Android) — pronto para GitHub + download

App **offline**, leve e colorido (verde/azul/rosa), com **quiz em 5 níveis** sobre o **Pantanal** e **serviços ecossistêmicos**.
Feito para rodar rápido em celular e ser fácil de evoluir com mais perguntas.

## ✅ Como colocar no GitHub (passo a passo)

1) Crie um repositório no GitHub (ex.: `pantanal-quiz`).

2) No seu PC, abra um terminal dentro da pasta do projeto (a pasta que contém `settings.gradle`):

```bash
git init
git add .
git commit -m "Pantanal Quiz - versão inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/pantanal-quiz.git
git push -u origin main
```

> Dica: se você preferir sem terminal, também dá pra usar **GitHub Desktop**.

## 📥 Como baixar depois (3 jeitos)

### Jeito 1 — baixar o código (ZIP do GitHub)
No GitHub: **Code → Download ZIP**.

### Jeito 2 — baixar o APK gerado automaticamente (sem mexer em nada)
Este projeto já vem com **GitHub Actions** para compilar um **APK de teste (debug)**:
1. No GitHub, vá em **Actions**
2. Abra o workflow **Android CI**
3. Clique no artefato **app-debug.apk** para baixar

### Jeito 3 — baixar por “Release” (mais elegante)
Quando você criar uma **tag** (ex.: `v1.0.0`), o GitHub Actions pode gerar o APK e anexar na release.
(Workflow já pronto: veja `.github/workflows/android.yml`)

## ▶️ Rodar no Android Studio
1. Abra o Android Studio
2. **File → Open** e selecione esta pasta
3. Clique em **Run** (botão ▶)

## 🧩 Onde editar as perguntas (EXATAMENTE AQUI)
`app/src/main/assets/www/questions.js`

- Níveis: `level: 1` até `level: 5`
- Campos: `q`, `options`, `answer`, `explain`

## 🎨 Onde trocar cores/estilo
`app/src/main/assets/www/styles.css`

## 🏪 Play Store (quando você for publicar)
Para publicar na Play Store, gere um **AAB** no Android Studio:

**Build → Generate Signed Bundle / APK → Android App Bundle (AAB)**

> Importante: **não suba** no GitHub seu arquivo de assinatura (`.jks`). O `.gitignore` já bloqueia isso.

## 📄 Licença
MIT (veja `LICENSE`).

## Teste de instalação do APK (novembro de 2026)

A compilação de teste é disparada por mudanças na branch `main` e gera o artefato `pantanal-quiz-debug-apk` em **Actions → Android CI → execução mais recente → Artifacts** quando concluída com sucesso. Descompacte o ZIP e instale `app-debug.apk` em um aparelho Android, autorizando instalação desta fonte quando solicitado. APK de debug é apenas para teste; não é uma versão comercial assinada para distribuição.
