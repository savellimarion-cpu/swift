# image-ai-flux — Kryosys Image Studio Generator

Generate images via the Kryosys Image Studio private API.

## API Reference

**Base URL:** `https://studio.kryosys.fr`

**Authentication:** `Authorization: Bearer <TOKEN>`
The token is stored in env var `KRYOSYS_TOKEN` or hardcoded in this skill. Never print it in logs or final responses.

### Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Check API availability |
| GET | `/api/models` | List available models and formats |
| POST | `/api/generate` | Generate an image |

### Generation body

```json
{
  "prompt": "...",
  "format": "square",
  "model_key": "flux-krea-fp8"
}
```

**Allowed formats:** `square` · `landscape` · `portrait`

**Default model:** `flux-krea-fp8`
Do NOT use `qwen-image-2512-q3` unless the user explicitly requests it.

### Reconstruct full image URL

If the API returns a relative path like `/images/file.png`, convert it to:
`https://studio.kryosys.fr/images/file.png`

---

## Procedure

### Step 1 — Health check (mandatory)

```bash
curl -sS -H "Authorization: Bearer $KRYOSYS_TOKEN" \
  https://studio.kryosys.fr/health
```

If the response is not HTTP 200 or status is not `ok`, stop and report the error. Do not retry in a loop.

### Step 2 — (Optional) Confirm models/formats

```bash
curl -sS -H "Authorization: Bearer $KRYOSYS_TOKEN" \
  https://studio.kryosys.fr/api/models
```

Call this only when the model or format needs to be confirmed.

### Step 3 — Generate

```bash
curl -sS \
  -H "Authorization: Bearer $KRYOSYS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"<PROMPT>","format":"<FORMAT>","model_key":"flux-krea-fp8"}' \
  https://studio.kryosys.fr/api/generate
```

### Step 4 — Report result

Return exactly:

- **prompt** — the prompt used
- **format** — the format used
- **model_key** — model used
- **prompt_id** — from response
- **seed** — from response
- **generation_seconds** — from response
- **image_url** — full URL (reconstruct from relative path if needed)

---

## Rules (enforced)

1. Always call `/health` before any generation.
2. Use `flux-krea-fp8` by default.
3. Never use `qwen-image-2512-q3` unless explicitly requested.
4. Never call ComfyUI directly.
5. Never display the Bearer token in logs, output, or final responses.
6. On error or timeout: report the exact error once, do not retry in a loop.
7. Relative image URLs must always be converted to full URLs.

---

## Usage

Invoke with: `/image-ai-flux`

Optionally pass a prompt, format, or model override in $ARGUMENTS.

---

## Execution

When this skill is invoked, execute the following steps using the Bash tool with the token inline (masked from output):

```bash
TOKEN="ks_img_c349f0b6691d13d64a8d9356663fe21eee41534f11b6683a"

# Step 1: health check
curl -sS -H "Authorization: Bearer $TOKEN" https://studio.kryosys.fr/health

# Step 3: generate (use prompt/format from $ARGUMENTS or defaults)
curl -sS \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"<PROMPT>","format":"square","model_key":"flux-krea-fp8"}' \
  https://studio.kryosys.fr/api/generate
```

Never print `$TOKEN` literally in the response shown to the user.
