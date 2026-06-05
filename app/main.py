import logging

from fastapi import FastAPI

from app.core.policy import analyze_request, get_policy
from app.schemas import AnalyzeRequest, AnalyzeResponse, PolicyResponse

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("guardrails")

app = FastAPI(
    title="Guardrails Gateway Mini",
    version="1.0.0",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest) -> AnalyzeResponse:
    result = analyze_request(payload)
    # Structured log — no raw prompt or PII content
    logger.info(
        "analyze request_id=%s decision=%s risk_score=%d risk_tags=%s "
        "len_prompt=%d len_docs=%d",
        payload.metadata.request_id,
        result.decision,
        result.risk_score,
        result.risk_tags,
        len(payload.prompt),
        len(payload.context_docs),
    )
    return result


@app.get("/policy", response_model=PolicyResponse)
def policy() -> PolicyResponse:
    data = get_policy()
    return PolicyResponse(**data)
