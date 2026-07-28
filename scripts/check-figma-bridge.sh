#!/usr/bin/env bash
# Диагностика моста к Figma Dev Mode MCP Server. Подробности и разбор
# причин — в mcp/SETUP.md, раздел «Диагностика зависшего моста».
set -u

PORT=3845
URL="http://127.0.0.1:${PORT}/mcp"

echo "1. Порт ${PORT} на сервере:"
if ss -tlnp 2>/dev/null | grep -q ":${PORT} "; then
  ss -tlnp 2>/dev/null | grep ":${PORT} "
else
  echo "   не слушает — туннель не поднят. Запустите на локальной машине:"
  echo "   ssh -R ${PORT}:127.0.0.1:${PORT} -p 2222 root@72.56.97.73"
  exit 1
fi

echo
echo "2. Ответ MCP-сервера (таймаут 8с):"
HTTP_CODE=$(curl -s -m 8 -o /dev/null -w "%{http_code}" -X POST "$URL" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"probe","version":"1"}}}')

if [ "$HTTP_CODE" = "200" ]; then
  echo "   200 — мост живой, можно работать."
  exit 0
else
  echo "   нет ответа (код: ${HTTP_CODE:-таймаут}) — порт слушает, но сервер за ним не отвечает."
  echo
  echo "   Вероятная причина: старая SSH-сессия держит порт, новый туннель не смог"
  echo "   его перебиндить. Кандидаты (закрывать по одному, начиная со старых):"
  ps aux | grep 'sshd: root@' | grep -v grep
  echo
  echo "   Если после закрытия старых сессий и нового туннеля всё ещё не отвечает —"
  echo "   на локальной машине переключить Figma → Preferences →"
  echo "   Enable Dev Mode MCP Server (выключить/включить)."
  exit 1
fi
