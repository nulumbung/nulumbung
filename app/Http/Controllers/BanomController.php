<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBanomRequest;
use App\Http\Requests\UpdateBanomRequest;
use App\Models\Banom;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BanomController extends Controller
{
    /**
     * Display a list of banoms with optional search and pagination.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $banoms = Banom::query()
            ->when($search, fn ($query, string $term) => $query
                ->where('name', 'like', "%{$term}%")
                ->orWhere('tagline', 'like', "%{$term}%"))
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(10)
            ->appends(request()->query());

        return Inertia::render('admin/banom/index', [
            'banoms' => $banoms,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Show the form to create a new banom.
     */
    public function create(): Response
    {
        return Inertia::render('admin/banom/create');
    }

    /**
     * Show the form to edit an existing banom.
     */
    public function edit(Banom $banom): Response
    {
        return Inertia::render('admin/banom/edit', [
            'banom' => $banom,
        ]);
    }

    /**
     * Create a new banom.
     */
    public function store(StoreBanomRequest $request): RedirectResponse
    {
        Banom::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Banom created.']);

        return back();
    }

    /**
     * Update a banom.
     */
    public function update(UpdateBanomRequest $request, Banom $banom): RedirectResponse
    {
        $banom->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Banom updated.']);

        return back();
    }

    /**
     * Delete a banom.
     */
    public function destroy(Request $request, Banom $banom): RedirectResponse
    {
        $banom->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Banom deleted.']);

        return back();
    }

    /**
     * Upload an image for use inside the banom form.
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp,gif,svg', 'max:5120'],
        ]);

        $path = $request->file('image')->store('banom', 'public');

        return response()->json(['path' => $path]);
    }
}
