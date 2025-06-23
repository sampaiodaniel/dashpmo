@echo off
chcp 65001 >nul
echo ========================================
echo  🚀 PREPARANDO AMBIENTE MULTI-MÁQUINA
echo  🏠 DashPMO - ASA
echo ========================================
echo.
echo 🧹 Limpando arquivos de cache e dependências...

cd /d "%~dp0.."

if exist node_modules (
    echo    - Removendo node_modules...
    rmdir /s /q node_modules
)
if exist .vite (
    echo    - Removendo cache do Vite...
    rmdir /s /q .vite
)
if exist dist (
    echo    - Removendo build anterior...
    rmdir /s /q dist
)
if exist package-lock.json (
    echo    - Removendo package-lock.json...
    del package-lock.json
)
if exist bun.lockb (
    echo    - Removendo bun.lockb...
    del bun.lockb
)

echo.
echo 📦 Instalando dependências...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Erro na instalação das dependências!
    echo 💡 Tente executar emergency-clean.bat
    pause
    exit /b 1
)

echo.
echo ✅ Ambiente preparado com sucesso!
echo 🌐 Iniciando servidor de desenvolvimento...
echo.
echo 📋 O servidor será aberto em: http://localhost:5173
echo 🔄 Se der erro de porta, será usado: http://localhost:3000
echo.
call npm run dev

pause 