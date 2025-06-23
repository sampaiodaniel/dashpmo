@echo off
chcp 65001 >nul
echo ========================================
echo  ⚡ INÍCIO RÁPIDO - DashPMO
echo  🏠 ASA
echo ========================================
echo.

cd /d "%~dp0.."

if not exist node_modules (
    echo 📦 Node modules não encontrado. Instalando dependências...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Erro na instalação! Use dev-switch.bat
        pause
        exit /b 1
    )
)

echo 🌐 Iniciando servidor de desenvolvimento...
echo 📋 Aguarde... O navegador será aberto automaticamente
echo.
call npm run dev

pause 