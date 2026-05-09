<?php

// ============================================================
// POUR LARAVEL 11 — bootstrap/app.php
// Remplace ton fichier bootstrap/app.php par ce contenu
// ============================================================

use App\Http\Middleware\AdminMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Sanctum stateful domains pour les cookies
        $middleware->statefulApi();

        // Alias pour le middleware admin
        $middleware->alias([
            'admin' => AdminMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();


// ============================================================
// POUR LARAVEL 10 — app/Http/Kernel.php
// Ajoute dans $routeMiddleware :
// 'admin' => \App\Http\Middleware\AdminMiddleware::class,
// ============================================================
