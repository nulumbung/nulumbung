<?php

namespace App\Http\Controllers;

use App\Enums\MediaStatus;
use App\Enums\MediaType;
use App\Http\Requests\StoreMediaRequest;
use App\Http\Requests\UpdateMediaRequest;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    /**
     * Display a list of media with search, filters and pagination.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $type = $request->string('type')->trim()->toString();
        $status = $request->string('status')->trim()->toString();

        $media = Media::query()
            ->when($search, fn ($query, string $term) => $query->where('title', 'like', "%{$term}%"))
            ->when(MediaType::tryFrom($type), fn ($query, MediaType $value) => $query->where('type', $value))
            ->when(MediaStatus::tryFrom($status), fn ($query, MediaStatus $value) => $query->where('status', $value))
            ->orderBy('sort_order')
            ->orderBy('title')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/media/index', [
            'media' => $media,
            'filters' => ['search' => $search, 'type' => $type, 'status' => $status],
        ]);
    }

    /**
     * Show the form to create a new media item.
     */
    public function create(): Response
    {
        return Inertia::render('admin/media/create');
    }

    /**
     * Display a single media item.
     */
    public function show(Media $media): Response
    {
        return Inertia::render('admin/media/show', [
            'media' => $media,
        ]);
    }

    /**
     * Show the form to edit an existing media item.
     */
    public function edit(Media $media): Response
    {
        return Inertia::render('admin/media/edit', [
            'media' => $media,
        ]);
    }

    /**
     * Store a newly created media item.
     */
    public function store(StoreMediaRequest $request): RedirectResponse
    {
        $media = Media::create($request->normalized());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Media created.']);

        return to_route('management.media.edit', $media);
    }

    /**
     * Update the given media item.
     */
    public function update(UpdateMediaRequest $request, Media $media): RedirectResponse
    {
        $media->update($request->normalized());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Media updated.']);

        return to_route('management.media.edit', $media);
    }

    /**
     * Remove the given media item.
     */
    public function destroy(Request $request, Media $media): RedirectResponse
    {
        $media->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Media deleted.']);

        return back();
    }

    /**
     * Upload a photo or video file for the media form.
     */
    public function uploadFile(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,gif,svg,mp4,webm,ogg,mov', 'max:51200'],
        ]);

        $path = $request->file('file')->store('media', 'public');

        return response()->json(['path' => $path]);
    }

    /**
     * Upload a custom thumbnail for a video media item.
     */
    public function uploadThumbnail(Request $request): JsonResponse
    {
        $request->validate([
            'thumbnail' => ['required', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
        ]);

        $path = $request->file('thumbnail')->store('media/thumbnails', 'public');

        return response()->json(['path' => $path]);
    }
}
