# Supabase MCP 서버 문제 해결 가이드

## 문제: Cannot find module 'ee-first' 에러

### 증상
Cursor에서 Supabase MCP 서버를 사용할 때 다음과 같은 에러가 발생합니다:

```
Error: Cannot find module 'ee-first'
```

### 원인
- npx 캐시에 있는 `@supabase/mcp-server-supabase` 패키지의 의존성이 손상됨
- Node.js 버전 호환성 문제
- npx 캐시 불일치

### 해결 방법

#### 방법 1: npx 캐시 정리 (권장)

1. **npx 캐시 정리**
   ```bash
   # Windows (PowerShell)
   Remove-Item -Recurse -Force "$env:LOCALAPPDATA\npm-cache\_npx"
   
   # macOS/Linux
   rm -rf ~/.npm/_npx
   ```

2. **Cursor 재시작**
   - Cursor를 완전히 종료
   - Cursor 재실행

3. **MCP 서버 재연결**
   - Cursor에서 자동으로 MCP 서버 재설치 시도
   - 설치 완료까지 약간 시간 소요 가능

#### 방법 2: MCP 설정 수정

전역 MCP 설정 파일을 수정합니다:

**Windows**: `C:\Users\[사용자명]\.cursor\mcp.json`
**macOS/Linux**: `~/.cursor/mcp.json`

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref",
        "zltlchafanslyrdcqnnk"
      ]
    }
  }
}
```

변경 후 Cursor 재시작.

#### 방법 3: MCP 서버 임시 비활성화

MCP 서버가 필요 없다면 비활성화:

1. `C:\Users\[사용자명]\.cursor\mcp.json` 열기
2. `supabase` 섹션 제거 또는 주석 처리
3. Cursor 재시작

```json
{
  "mcpServers": {
    // "supabase": {
    //   "command": "npx",
    //   "args": [...]
    // }
  }
}
```

#### 방법 4: 수동 설치

1. **패키지 전역 설치**
   ```bash
   npm install -g @supabase/mcp-server-supabase
   ```

2. **MCP 설정 수정**
   
   `mcp.json` 파일에서 `command`를 변경:
   
   ```json
   {
     "mcpServers": {
       "supabase": {
         "command": "supabase-mcp-server",
         "args": [
           "--project-ref",
           "zltlchafanslyrdcqnnk"
         ]
       }
     }
   }
   ```

3. **Cursor 재시작**

## 추가 문제 해결

### Node.js 버전 확인

MCP 서버는 Node.js 18 이상이 필요합니다:

```bash
node --version
```

18.0.0 미만이면 Node.js 업데이트:
- [Node.js 공식 웹사이트](https://nodejs.org/)에서 최신 LTS 버전 다운로드

### npm 캐시 정리

npm 전체 캐시 정리:

```bash
npm cache clean --force
```

### Cursor 로그 확인

Cursor의 MCP 로그 확인:

1. Cursor에서 `Ctrl+Shift+P` (Windows/Linux) 또는 `Cmd+Shift+P` (macOS)
2. "Developer: Show Logs" 검색
3. MCP 관련 에러 메시지 확인

## MCP 서버가 정상 작동하는지 확인

### 1. Cursor에서 확인

Cursor의 채팅 창에서:
```
@supabase
```
입력 후 자동완성이 나타나면 정상 작동

### 2. 로그 확인

MCP 로그에 다음과 같은 메시지가 나타나면 정상:
```
[info] Client started successfully
```

## 대안: MCP 없이 사용

MCP 서버가 필요 없다면:

1. **Supabase Dashboard 사용**
   - [Supabase Dashboard](https://supabase.com/dashboard)에서 직접 SQL 실행
   - Table Editor에서 데이터 관리

2. **Supabase CLI 사용**
   ```bash
   # Supabase CLI 설치
   npm install -g supabase
   
   # 로그인
   supabase login
   
   # 프로젝트 연결
   supabase link --project-ref zltlchafanslyrdcqnnk
   ```

3. **VS Code Extension 사용**
   - Supabase 공식 VS Code Extension 설치
   - GUI로 데이터베이스 관리

## 참고 자료

- [Supabase MCP 서버 GitHub](https://github.com/supabase-community/supabase-mcp)
- [Cursor MCP 문서](https://docs.cursor.com/context/model-context-protocol)
- [Model Context Protocol 공식 문서](https://modelcontextprotocol.io/)

## 요약

가장 간단한 해결 방법:

1. npx 캐시 정리: `Remove-Item -Recurse -Force "$env:LOCALAPPDATA\npm-cache\_npx"` (Windows)
2. Cursor 재시작
3. 문제 지속 시 MCP 서버 비활성화

프로젝트 개발에는 MCP 서버가 필수가 아니므로, 문제가 계속되면 비활성화하고 Supabase Dashboard를 직접 사용하는 것을 권장합니다.

