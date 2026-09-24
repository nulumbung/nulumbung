<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $news->title }}</title>
</head>
<body style="margin:0;padding:0;background:#f2f0eb;font-family:Arial,Helvetica,sans-serif;color:#1b1b18;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f2f0eb;padding:32px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;">
                    <tr>
                        <td style="padding:24px 32px;border-bottom:1px solid #e7e5e4;">
                            <span style="font-size:16px;font-weight:700;color:#1b1b18;">{{ $brandName }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#1b1b18;">{{ $news->title }}</h1>
                            @if ($news->image_url)
                                <img src="{{ $news->image_url }}" alt="" style="display:block;width:100%;max-width:100%;border-radius:8px;margin-bottom:16px;">
                            @endif
                            <div style="font-size:15px;line-height:1.7;color:#44403c;">
                                {!! $news->email_description !!}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:24px 32px;border-top:1px solid #e7e5e4;text-align:center;">
                            @if ($subscriber && $unsubscribeUrl)
                                <a href="{{ $unsubscribeUrl }}" style="font-size:12px;color:#78716c;text-decoration:underline;">
                                    {{ $subscriber->email }} - Unsubscribe from this newsletter
                                </a>
                            @endif
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>