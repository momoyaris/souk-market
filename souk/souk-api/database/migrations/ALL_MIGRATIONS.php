<?php

// ============================================================
// MIGRATION 1 — Ajouter colonnes à la table users existante
// php artisan make:migration add_columns_to_users_table
// ============================================================

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->string('avatar', 10)->nullable()->after('phone');
            $table->enum('role', ['user', 'admin', 'banned'])->default('user')->after('avatar');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'avatar', 'role']);
        });
    }
};

// ============================================================
// MIGRATION 2 — Listings
// php artisan make:migration create_listings_table
// ============================================================
/*
return new class extends Migration {
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->integer('price');
            $table->string('category');
            $table->string('city');
            $table->string('condition');
            $table->json('images')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_flagged')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
*/

// ============================================================
// MIGRATION 3 — Conversations
// php artisan make:migration create_conversations_table
// ============================================================
/*
return new class extends Migration {
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->foreignId('buyer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['listing_id', 'buyer_id', 'seller_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
*/

// ============================================================
// MIGRATION 4 — Messages
// php artisan make:migration create_messages_table
// ============================================================
/*
return new class extends Migration {
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('text');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
*/

// ============================================================
// MIGRATION 5 — Favorites
// php artisan make:migration create_favorites_table
// ============================================================
/*
return new class extends Migration {
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->unique(['user_id', 'listing_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};
*/

// ============================================================
// MIGRATION 6 — Reports
// php artisan make:migration create_reports_table
// ============================================================
/*
return new class extends Migration {
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('reason');
            $table->enum('status', ['pending', 'reviewed', 'dismissed'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
*/
