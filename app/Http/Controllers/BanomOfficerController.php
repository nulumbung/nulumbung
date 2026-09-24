<?php

namespace App\Http\Controllers;

use App\Enums\BanomOfficerStatus;
use App\Http\Requests\StoreBanomOfficerRequest;
use App\Http\Requests\UpdateBanomOfficerRequest;
use App\Models\Banom;
use App\Models\BanomOfficer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BanomOfficerController extends Controller
{
    /**
     * Display the officers of a banom with optional status filter and search.
     */
    public function index(Request $request, Banom $banom): Response
    {
        $status = BanomOfficerStatus::tryFrom(
            $request->string('status')->toString()
        ) ?? BanomOfficerStatus::Aktif;

        $search = $request->string('search')->trim()->toString();

        $officers = $banom->officers()
            ->where('status', $status)
            ->when($search, fn ($query, string $term) => $query
                ->where(fn ($query) => $query
                    ->where('name', 'like', "%{$term}%")
                    ->orWhere('period', 'like', "%{$term}%")))
            ->orderByDesc('period')
            ->orderByRaw("CASE position WHEN 'ketua' THEN 0 WHEN 'sekretaris' THEN 1 WHEN 'bendahara' THEN 2 ELSE 3 END")
            ->orderBy('name')
            ->paginate(10)
            ->appends(request()->query());

        return Inertia::render('admin/banom/officers', [
            'banom' => $banom->only(['id', 'name', 'tagline', 'logo']),
            'officers' => $officers,
            'statusOptions' => [
                BanomOfficerStatus::Aktif->value,
                BanomOfficerStatus::Demisioner->value,
            ],
            'filters' => [
                'status' => $status->value,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Create a new officer for the banom.
     */
    public function store(StoreBanomOfficerRequest $request, Banom $banom): RedirectResponse
    {
        $banom->officers()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Officer created.']);

        return back();
    }

    /**
     * Update an officer of the banom.
     */
    public function update(
        UpdateBanomOfficerRequest $request,
        Banom $banom,
        BanomOfficer $officer
    ): RedirectResponse {
        $officer->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Officer updated.']);

        return back();
    }

    /**
     * Delete an officer of the banom.
     */
    public function destroy(Request $request, Banom $banom, BanomOfficer $officer): RedirectResponse
    {
        $officer->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Officer deleted.']);

        return back();
    }
}
