import re
from dataclasses import dataclass
from typing import Iterable, List, Tuple


EMAIL_RE = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
PHONE_RE = re.compile(r"\b(?:\+?\d{1,3}[-.\s]?)?(?:\d{3}[-.\s]?){2}\d{4}\b")

PROMPT_INJECTION_PHRASES = (
    "ignore previous instructions",
    "reveal system prompt",
    "act as dan",
    "bypass safety",
    "ignore all prior constraints",
)

RAG_INJECTION_PHRASES = (
    "system:",
    "override policy",
    "ignore guidelines",
    "disregard prior policy",
)


@dataclass(frozen=True)
class DetectionResult:
    tag: str
    triggered: bool
    evidence: str = ""
    weight: int = 0


def detect_prompt_injection(prompt: str) -> DetectionResult:
    lowered = prompt.lower()
    for phrase in PROMPT_INJECTION_PHRASES:
        if phrase in lowered:
            return DetectionResult(
                tag="prompt_injection",
                triggered=True,
                evidence=f"matched phrase: {phrase}",
                weight=60,
            )
    return DetectionResult(tag="prompt_injection", triggered=False, weight=0)


def detect_pii(text: str) -> Tuple[DetectionResult, bool, bool]:
    email_match = EMAIL_RE.search(text)
    phone_match = PHONE_RE.search(text)
    if email_match or phone_match:
        evidence_parts: List[str] = []
        if email_match:
            evidence_parts.append("matched email pattern")
        if phone_match:
            evidence_parts.append("matched phone pattern")
        return (
            DetectionResult(
                tag="pii",
                triggered=True,
                evidence=", ".join(evidence_parts),
                weight=35,
            ),
            bool(email_match),
            bool(phone_match),
        )
    return DetectionResult(tag="pii", triggered=False, weight=0), False, False


def detect_rag_injection(context_texts: Iterable[str]) -> DetectionResult:
    for text in context_texts:
        lowered = text.lower()
        for phrase in RAG_INJECTION_PHRASES:
            if phrase in lowered:
                return DetectionResult(
                    tag="rag_injection",
                    triggered=True,
                    evidence=f"matched context phrase: {phrase}",
                    weight=45,
                )
    return DetectionResult(tag="rag_injection", triggered=False, weight=0)


def redact_pii(text: str) -> str:
    redacted = EMAIL_RE.sub("[REDACTED_EMAIL]", text)
    redacted = PHONE_RE.sub("[REDACTED_PHONE]", redacted)
    return redacted
