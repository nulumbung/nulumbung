<?php

namespace App\Http\Controllers;

use App\Enums\NewsStatus;
use App\Http\Requests\StoreNewsRequest;
use App\Http\Requests\UpdateNewsRequest;
use App\Models\News;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Ramsey\Uuid\Uuid;

class NewsController extends Controller
{
    private const NAMESPACE = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

    /**
     * Display a list of news with optional search and pagination.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $status = $request->string('status')->trim()->toString();

        $news = News::query()
            ->with('category:id,name')
            ->when($search, fn ($query, $term) => $query->where('title', 'like', "%{$term}%"))
            ->when(NewsStatus::tryFrom($status), function ($query, NewsStatus $value) {
                $query->where('status', $value);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->appends(request()->query());

        return Inertia::render('admin/news/index', [
            'news' => $news,
            'categories' => CategoryController::findForOptions(),
            'filters' => ['search' => $search, 'status' => $status],
            'timezone' => config('app.timezone'),
        ]);
    }

    /**
     * Show the form to create a new news item.
     */
    public function create(): Response
    {
        return Inertia::render('admin/news/create', [
            'categories' => CategoryController::findForOptions(),
            'timezone' => config('app.timezone'),
        ]);
    }

    /**
     * Display a single news item.
     */
    public function show(News $news): Response
    {
        $news->load('category:id,name');

        return Inertia::render('admin/news/show', [
            'news' => $news,
            'categories' => CategoryController::findForOptions(),
            'timezone' => config('app.timezone'),
        ]);
    }

    /**
     * Show the form to edit an existing news item.
     */
    public function edit(News $news): Response
    {
        $news->load('category:id,name');

        return Inertia::render('admin/news/edit', [
            'news' => $news,
            'categories' => CategoryController::findForOptions(),
            'timezone' => config('app.timezone'),
        ]);
    }

    /**
     * Create a new news item.
     */
    public function store(StoreNewsRequest $request): RedirectResponse
    {
        $data = $this->normalize($request);

        $data['slug'] = $this->uniqueSlug($this->slugFromRequest($request));
        $data['id'] = $this->uuidFromTitle($data['slug']);
        $data['publisher'] = $this->publisherName();

        $news = News::create($data);

        $news->sendNewsletterIfDue();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'News created.']);

        return to_route('management.news.edit', $news);
    }

    /**
     * Update a news item.
     */
    public function update(UpdateNewsRequest $request, News $news): RedirectResponse
    {
        $data = $this->normalize($request);

        $data['slug'] = $this->uniqueSlug($this->slugFromRequest($request), $news->id);

        $news->update($data + ['publisher' => $this->publisherName()]);

        $news->sendNewsletterIfDue();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'News updated.']);

        return to_route('management.news.edit', $news);
    }

    /**
     * Delete a news item.
     */
    public function destroy(Request $request, News $news): RedirectResponse
    {
        $news->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'News deleted.']);

        return back();
    }

    /**
     * Upload an image for use inside the news editor.
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp,gif,svg', 'max:5120'],
        ]);

        $path = $request->file('image')->store('news', 'public');

        return response()->json(['path' => $path]);
    }

    /**
     * Normalise the validated request into a safe column payload.
     *
     * @return array<string, mixed>
     */
    private function normalize(Request $request): array
    {
        $data = array_merge([
            'image' => null,
            'image_caption' => null,
            'description' => null,
            'publish_at' => null,
            'is_headline' => false,
            'is_trending' => false,
            'is_popular' => false,
            'is_latest' => false,
            'is_newsletter' => false,
        ], $request->validated());

        $data['publish_at'] = $data['publish_at'] ?: now();

        return $data;
    }

    /**
     * Resolve the desired slug, preferring the submitted one and falling
     * back to one generated from the title.
     */
    private function slugFromRequest(Request $request): string
    {
        $submitted = Str::slug((string) ($request->validated()['slug'] ?? ''));
        $title = Str::slug((string) ($request->validated()['title'] ?? ''));

        return $submitted !== '' ? $submitted : $title;
    }

    /**
     * Derive the primary key from the news title (deterministic uuid).
     */
    private function uuidFromTitle(string $slug): string
    {
        return (string) Uuid::uuid5(self::NAMESPACE, $slug);
    }

    /**
     * Build the publisher label from the current account roles.
     */
    private function publisherName(): string
    {
        $roles = auth()->user()?->getRoleNames() ?? collect();

        return $roles->isNotEmpty() ? $roles->join(', ') : (string) auth()->user()?->name ?? 'System';
    }

    /**
     * Generate a unique slug based on an existing slug.
     */
    private function uniqueSlug(string $slug, ?string $ignoreId = null): string
    {
        $candidate = $slug;
        $i = 2;

        while (News::where('slug', $candidate)->when($ignoreId, fn ($query, $id) => $query->where('id', '!=', $id))->exists()) {
            $candidate = $slug.'-'.$i;
            $i++;
        }

        return $candidate;
    }
}
