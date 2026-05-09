<?php

namespace App\Policies;

use App\Models\Listing;
use App\Models\User;
use App\Policies\ListingPolicy;
use Illuminate\Support\Facades\Gate;

class ListingPolicy
{
    public function update(User $user, Listing $listing): bool
    {
        return $user->id === $listing->user_id || $user->isAdmin();
    }

    public function delete(User $user, Listing $listing): bool
    {
        return $user->id === $listing->user_id || $user->isAdmin();
    }
    
}
