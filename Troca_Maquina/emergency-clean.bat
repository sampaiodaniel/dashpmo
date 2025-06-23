@echo off
chcp 65001 >nul
echo ========================================
echo  🆘 LIMPEZA DE EMERGÊNCIA
echo  🏠 DashPMO - ASA
echo ========================================
echo.
echo ⚠️  Este script vai limpar TUDO e reinstalar!
echo 🗑️  Vai deletar: node_modules, cache, builds...
echo.
set /p confirm="Tem certeza? (s/N): "
if /i not "%confirm%"=="s" (
    echo Operação cancelada.
    pause
    exit /b 0
)

cd /d "%~dp0.."

echo.
echo 🛑 Matando processos do Node/NPM...
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.exe 2>nul

echo 🧹 Limpeza completa...
if exist node_modules rmdir /s /q node_modules
if exist .vite rmdir /s /q .vite
if exist dist rmdir /s /q dist
if exist package-lock.json del package-lock.json
if exist bun.lockb del bun.lockb

echo 🔄 Limpando cache do NPM...
call npm cache clean --force

echo 📦 Reinstalando tudo...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Erro na instalação! Verifique sua conexão.
    pause
    exit /b 1
)

echo.
echo ✅ Limpeza completa finalizada!
echo 🌐 Iniciando servidor...
call npm run dev

pause 