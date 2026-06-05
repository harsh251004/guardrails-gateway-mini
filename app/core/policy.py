from typing import Dict, List, Literal

from app.core.detectors import (
    DetectionResult,
    detect_pii,
    detect_prompt_injection,
    detect_rag_injection,
    redact_pii,
)
from app.schemas import AnalyzeRequest, AnalyzeResponse, ContextDoc, Reason


POLICY_CONFIG = {
    "version": "1",
    "detectors": ["prompt_injection", "pii", "rag_injection"],
    "thresholds": {"block_score": 80, "transform_score": 40},
}


def _decision(score: int) -> Literal["allow", "block", "transform"]:
    if score >= POLICY_CONFIG["thresholds"]["block_score"]:
        return "block"
    if score >= POLICY_CONFIG["thresholds"]["transform_score"]:
        return "transform"
    return "allow"


def analyze_request(payload: AnalyzeRequest) -> AnalyzeResponse:
    prompt_res = detect_prompt_injection(payload.prompt)
    pii_res_prompt, _, _ = detect_pii(payload.prompt)
    rag_res = detect_rag_injection(doc.text for doc in payload.context_docs)
    pii_docs_detected = any(detect_pii(doc.text)[0].triggered for doc in payload.context_docs)

    pii_triggered = pii_res_prompt.triggered or pii_docs_detected
    pii_weight = pii_res_prompt.weight if pii_triggered else 0
    pii_evidence = pii_res_prompt.evidence if pii_res_prompt.triggered else "matched in context docs"

    detections: List[DetectionResult] = [prompt_res, rag_res]
    if pii_triggered:
        detections.append(DetectionResult(tag="pii", triggered=True, evidence=pii_evidence, weight=pii_weight))
    else:
        detections.append(DetectionResult(tag="pii", triggered=False, weight=0))

    score = min(100, sum(item.weight for item in detections if item.triggered))
    decision = _decision(score)

    if decision == "block":
        # P0-1: block branch must be fully opaque — never leak raw content downstream
        sanitized_prompt = "[BLOCKED]"
        sanitized_context_docs: List[ContextDoc] = []
    elif decision == "transform":
        sanitized_prompt = redact_pii(payload.prompt)
        sanitized_context_docs = [ContextDoc(id=doc.id, text=redact_pii(doc.text)) for doc in payload.context_docs]
    else:  # allow
        # P0-2: still redact PII even when score falls below transform threshold
        if pii_triggered:
            sanitized_prompt = redact_pii(payload.prompt)
            sanitized_context_docs = [ContextDoc(id=doc.id, text=redact_pii(doc.text)) for doc in payload.context_docs]
        else:
            sanitized_prompt = payload.prompt
            sanitized_context_docs = list(payload.context_docs)

    reasons = [
        Reason(tag=item.tag, evidence=item.evidence)
        for item in detections
        if item.triggered and item.evidence
    ]
    risk_tags = sorted({item.tag for item in detections if item.triggered})

    return AnalyzeResponse(
        decision=decision,
        risk_score=score,
        risk_tags=risk_tags,
        sanitized_prompt=sanitized_prompt,
        sanitized_context_docs=sanitized_context_docs,
        reasons=reasons,
    )


def get_policy() -> Dict[str, object]:
    return POLICY_CONFIG
