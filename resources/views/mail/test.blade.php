<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $label }}</title>
</head>
<body style="margin:0;padding:0;background:#f2f0eb;font-family:Arial,Helvetica,sans-serif;color:#1b1b18;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f2f0eb;padding:32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:8px;">
                    <tr>
                        <td style="padding:32px;text-align:center;">
                            <p style="margin:0 0 8px;font-size:18px;font-weight:700;">{{ $label }}</p>
                            <p style="margin:0;font-size:14px;color:#78716c;">Your SMTP settings are working correctly.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>