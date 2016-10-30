@echo off
echo Testing exprs (Ersatz)
echo.
SET CUR_DIR=%~dp0
SET ERSATZ_DIR=%CUR_DIR%\ersatz
java -DPID=42 -jar %ERSATZ_DIR%\picolisp.jar %ERSATZ_DIR%\lib.l %CUR_DIR%interexpr.l %1 -bye
IF NOT DEFINED NO_PAUSE pause>nul|set/p="Une touche pour quitter."&echo(
