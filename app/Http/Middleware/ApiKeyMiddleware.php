<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiKeyMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $apiKey = $request->header('ApiKey'); // client must send this header

        if ($apiKey !== 'iamZaid@7862') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Invalid API Key.'
            ], 401);
        }

        return $next($request);
    }
}
