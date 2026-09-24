<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Fetch categories as lightweight options for the news form.
     *
     * @return Collection<int, Category>
     */
    public static function findForOptions(): Collection
    {
        return Category::query()
            ->orderBy('name')
            ->get(['id', 'name']);
    }

    /**
     * Display a list of categories with optional search and pagination.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $categories = Category::query()
            ->when($search, fn ($query, $term) => $query
                ->where('name', 'like', "%{$term}%")
                ->orWhere('slug', 'like', "%{$term}%"))
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->appends(request()->query());

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Show the form to create a new category.
     */
    public function create(): Response
    {
        return Inertia::render('admin/categories/create');
    }

    /**
     * Show the form to edit an existing category.
     */
    public function edit(Category $category): Response
    {
        return Inertia::render('admin/categories/edit', [
            'category' => $category,
        ]);
    }

    /**
     * Create a new category.
     */
    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $data = array_merge([
            'slug' => null,
            'icon' => null,
            'comment' => null,
        ], $request->validated());

        $data['slug'] = $this->uniqueSlug($data['slug'] ?: Str::slug($data['name']));

        $category = Category::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Category created.']);

        return to_route('management.categories.edit', $category);
    }

    /**
     * Update a category.
     */
    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $data = array_merge([
            'slug' => null,
            'icon' => null,
            'comment' => null,
        ], $request->validated());

        $data['slug'] = $data['slug'] ?: Str::slug($data['name']);

        if ($data['slug'] !== $category->slug && Category::where('slug', $data['slug'])->exists()) {
            $data['slug'] = $this->uniqueSlug($data['slug']);
        }

        $category->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Category updated.']);

        return to_route('management.categories.edit', $category);
    }

    /**
     * Delete a category.
     */
    public function destroy(Request $request, Category $category): RedirectResponse
    {
        $category->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Category deleted.']);

        return back();
    }

    /**
     * Generate a unique slug based on an existing slug.
     */
    private function uniqueSlug(string $slug): string
    {
        $candidate = $slug;
        $i = 2;

        while (Category::where('slug', $candidate)->exists()) {
            $candidate = $slug.'-'.$i;
            $i++;
        }

        return $candidate;
    }
}
