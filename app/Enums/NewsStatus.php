<?php

namespace App\Enums;

enum NewsStatus: string
{
    case Draft = 'draft';
    case Publish = 'publish';
    case Archive = 'archive';
}
