<?php

// app/Http/Controllers/EmployeeController.php (updated to fetch all employees)

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class EmployeeController extends Controller
{
    public function frontendDevelopers()
    {
        $employees = Employee::with(['tasks.client'])
            ->get()
            ->map(function ($employee) {
                $projects = $employee->tasks->map(function ($task) {
                    return [
                        'name' => $task->task,
                        'timeline' => $task->expected_timeline?->format('Y-m-d') ?? $task->due?->format('Y-m-d') ?? null,
                        'client' => $task->client?->name ?? 'Unknown',
                    ];
                });

                return [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'category' => $employee->category,
                    'sub_category' => $employee->sub_category ?? null,
                    'manager' => $employee->manager,
                    'projects' => $projects->toArray(),
                ];
            });

        Log::info('All Employees Fetched:', $employees->toArray());

        return Inertia::render('FrontendDevelopers', [
            'employees' => $employees,
        ]);
    }
}