@echo off
chcp 65001 >nul
echo ========================================
echo  🎯 SELETOR DE SCRIPTS - DashPMO
echo ========================================
echo.
echo Escolha o que deseja fazer:
echo.
echo [1] 🔄 Trocar de máquina (dev-switch.bat)
echo [2] ⚡ Início rápido (quick-start.bat)
echo [3] 🆘 Limpeza emergência (emergency-clean.bat)
echo [4] ❌ Sair
echo.
set /p choice="Digite sua opção (1-4): "

if "%choice%"=="1" (
    echo.
    echo 🔄 Executando dev-switch.bat...
    call "%~dp0dev-switch.bat"
) else if "%choice%"=="2" (
    echo.
    echo ⚡ Executando quick-start.bat...
    call "%~dp0quick-start.bat"
) else if "%choice%"=="3" (
    echo.
    echo 🆘 Executando emergency-clean.bat...
    call "%~dp0emergency-clean.bat"
) else if "%choice%"=="4" (
    echo Saindo...
    exit /b 0
) else (
    echo Opção inválida! Execute novamente.
    pause
    goto :eof
) 