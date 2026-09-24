<?php

namespace App\Enums;

enum MediaStatus: string
{
    case Draft = 'draft';
    case Publish = 'publish';
    case Archive = 'archive';
}
