<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ListingController extends Controller
{
    // GET /listings — liste publique avec filtres
    public function index(Request $request)
    {
        $listings = Listing::with('user:id,name,avatar,created_at')
            ->active()
            ->category($request->category)
            ->search($request->q)
            ->when($request->max_price, fn($q) => $q->where('price', '<=', $request->max_price))
            ->when($request->city, fn($q) => $q->where('city', $request->city))
            ->when($request->sort === 'price_asc',  fn($q) => $q->orderBy('price', 'asc'))
            ->when($request->sort === 'price_desc', fn($q) => $q->orderBy('price', 'desc'))
            ->latest()
            ->paginate(16);

        return response()->json($listings);
    }

    // GET /listings/:id
    public function show(Listing $listing)
    {
        $listing->load('user:id,name,avatar,created_at');
        return response()->json($listing);
    }

    // POST /listings — créer une annonce (auth requise)
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|integer|min:0',
            'category'    => 'required|string',
            'city'        => 'required|string|max:100',
            'condition'   => 'required|string',
            'images'      => 'nullable|array',
            'images.*'    => 'url',
        ]);

        $listing = $request->user()->listings()->create($data);

        return response()->json($listing->load('user:id,name,avatar'), 201);
    }

    // PUT /listings/:id
    public function update(Request $request, Listing $listing)
    {
        $this->authorize('update', $listing);

        $data = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price'       => 'sometimes|integer|min:0',
            'category'    => 'sometimes|string',
            'city'        => 'sometimes|string|max:100',
            'condition'   => 'sometimes|string',
            'images'      => 'sometimes|array',
            'is_active'   => 'sometimes|boolean',
        ]);

        $listing->update($data);

        return response()->json($listing);
    }

    // DELETE /listings/:id
    public function destroy(Request $request, Listing $listing)
    {
        $this->authorize('delete', $listing);
        $listing->delete();

        return response()->json(['message' => 'Annonce supprimée.']);
    }

    // GET /users/:id/listings
    public function byUser(int $userId)
    {
        $listings = Listing::where('user_id', $userId)
            ->where('is_active', true)
            ->latest()
            ->get();

        return response()->json($listings);
    }

    // POST /listings/:id/images — upload image vers Supabase Storage
    public function uploadImage(Request $request, Listing $listing)
    {
        $this->authorize('update', $listing);

        $request->validate([
            'image' => 'required|image|max:10240', // 10 Mo
        ]);

        $file = $request->file('image');
        $path = 'listings/' . $listing->id . '/' . uniqid() . '.' . $file->extension();

        // Stockage local (swap par Supabase Storage dans .env)
        Storage::disk('public')->put($path, file_get_contents($file));
        $url = Storage::disk('public')->url($path);

        $images = $listing->images ?? [];
        $images[] = $url;
        $listing->update(['images' => $images]);

        return response()->json(['url' => $url, 'images' => $images]);
    }
}
