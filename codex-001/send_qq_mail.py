import argparse
import os
import smtplib
from email.message import EmailMessage


SMTP_HOST = os.getenv("QQ_SMTP_HOST", "smtp.qq.com")
SMTP_PORT = int(os.getenv("QQ_SMTP_PORT", "465"))
SMTP_USER = os.getenv("QQ_SMTP_USER")
SMTP_AUTH_CODE = os.getenv("QQ_SMTP_AUTH_CODE")


def read_body(args: argparse.Namespace) -> str:
    if args.body_file:
        with open(args.body_file, "r", encoding="utf-8") as file:
            return file.read()
    return args.body or ""


def send_mail(to_addr: str, subject: str, body: str) -> None:
    if not SMTP_USER or not SMTP_AUTH_CODE:
        raise SystemExit(
            "Missing QQ_SMTP_USER or QQ_SMTP_AUTH_CODE environment variable."
        )

    message = EmailMessage()
    message["From"] = SMTP_USER
    message["To"] = to_addr
    message["Subject"] = subject
    message.set_content(body, subtype="plain", charset="utf-8")

    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as smtp:
        smtp.login(SMTP_USER, SMTP_AUTH_CODE)
        smtp.send_message(message)


def main() -> None:
    parser = argparse.ArgumentParser(description="Send a plain-text email via QQ SMTP.")
    parser.add_argument("--to", required=True, help="Recipient email address.")
    parser.add_argument("--subject", required=True, help="Email subject.")
    parser.add_argument("--body", help="Email body text.")
    parser.add_argument("--body-file", help="UTF-8 text file containing the email body.")
    args = parser.parse_args()

    send_mail(args.to, args.subject, read_body(args))


if __name__ == "__main__":
    main()
