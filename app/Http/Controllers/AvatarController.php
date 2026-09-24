<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Response;

class AvatarController extends Controller
{
    /**
     * Serve the user's avatar image directly from the database.
     */
    public function show(User $user): Response
    {
        $image = $user->getRawOriginal('avatar');

        abort_unless($image, 404);

        $binary = (string) base64_decode((string) $image, true);

        abort_unless($binary !== '', 404);

        $mime = (new \finfo(FILEINFO_MIME_TYPE))->buffer($binary) ?: 'image/png';

        return response($binary, headers: [
            'Content-Type' => $mime,
            'Content-Length' => strlen($binary),
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ]);
    }
}
