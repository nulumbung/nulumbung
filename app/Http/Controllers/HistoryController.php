<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHistoryRequest;
use App\Http\Requests\UpdateHistoryRequest;
use App\Models\History;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HistoryController extends Controller
{
    /**
     * Display a list of history entries with search and pagination.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $histories = History::query()
            ->when($search, fn ($query, string $term) => $query
                ->where('title', 'like', "%{$term}%")
                ->orWhere('year', 'like', "%{$term}%"))
            ->orderBy('sort_order')
            ->orderBy('title')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/history/index', [
            'histories' => $histories,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Show the form to create a new history entry.
     */
    public function create(): Response
    {
        return Inertia::render('admin/history/create');
    }

    /**
     * Display a single history entry.
     */
    public function show(History $history): Response
    {
        return Inertia::render('admin/history/show', [
            'history' => $history,
        ]);
    }

    /**
     * Show the form to edit an existing history entry.
     */
    public function edit(History $history): Response
    {
        return Inertia::render('admin/history/edit', [
            'history' => $history,
        ]);
    }

    /**
     * Store a newly created history entry.
     */
    public function store(StoreHistoryRequest $request): RedirectResponse
    {
        $history = History::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'History created.']);

        return to_route('management.history.edit', $history);
    }

    /**
     * Update the given history entry.
     */
    public function update(UpdateHistoryRequest $request, History $history): RedirectResponse
    {
        $history->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'History updated.']);

        return to_route('management.history.edit', $history);
    }

    /**
     * Remove the given history entry.
     */
    public function destroy(Request $request, History $history): RedirectResponse
    {
        $history->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'History deleted.']);

        return back();
    }

    /**
     * Upload an image for use inside the history form.
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp,gif,svg', 'max:5120'],
        ]);

        $path = $request->file('image')->store('history', 'public');

        return response()->json(['path' => $path]);
    }
}
