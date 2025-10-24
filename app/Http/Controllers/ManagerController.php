<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Task;
use App\Models\Employee;
use App\Models\Client;
use App\Models\TaskDetail;

class ManagerController extends Controller
{
    private function getDashboardData()
    {
        $employees = Employee::select('id', 'name', 'category', 'sub_category', 'manager')
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'category' => $employee->category,
                    'subCategory' => $employee->sub_category,
                    'manager' => $employee->manager,
                    'projects' => [], // Not in DB, set empty
                ];
            });

        $tasks = Task::with([
            'employee:id,name',
            'client:id,name',
            'detail'
        ])
        ->get()
        ->map(function ($task) {
            return [
                'id' => $task->id,
                'task' => $task->task,
                'employeeId' => $task->employee_id,
                'client' => $task->client->name ?? 'Unknown',
                'status' => $task->status ?? 'Pending',
                'due' => $task->due ? $task->due->format('Y-m-d') : null,
                'expectedTimeline' => $task->expected_timeline ? $task->expected_timeline->format('Y-m-d') : null,
                'devRemark' => $task->detail->dev_remark ?? '', // From detail
                'clientRemark' => $task->detail->client_remark ?? '', // From detail
                'managerRemark' => $task->detail->manager_remark ?? '', // From detail
                'testingPoints' => $task->detail && $task->detail->testing_points ? $task->detail->testing_points : [], // From detail, cast array
            ];
        });

        $clients = Client::select('name')
            ->distinct()
            ->orderBy('name')
            ->pluck('name')
            ->toArray();

        return [
            'employees' => $employees,
            'tasks' => $tasks,
            'clients' => $clients,
        ];
    }

   public function index()
    {
        return Inertia::render('Manager', $this->getDashboardData());
    }

    public function show($id)
    {
        $task = Task::with([
            'employee:id,name',
            'client:id,name',
            'detail'
        ])->findOrFail($id);

        $detail = $task->detail ?? new TaskDetail(['task_id' => $task->id]);

        $taskData = [
            'id' => $task->id,
            'task' => $task->task,
            'employeeId' => $task->employee_id,
            'client' => $task->client->name ?? 'Unknown',
            'status' => $task->status ?? 'Pending',
            'due' => $task->due ? $task->due->format('Y-m-d') : null,
            'expectedTimeline' => $task->expected_timeline ? $task->expected_timeline->format('Y-m-d') : null,
            'devRemark' => $detail->dev_remark ?? '',
            'clientRemark' => $detail->client_remark ?? '',
            'managerRemark' => $detail->manager_remarks ?? '',
            'testingPoints' => $detail->testing_points ?? [],
            'developer' => $task->employee->name ?? 'Unknown',
            'managerRemarks' => $detail->manager_remarks ?? ['', '', ''],
            'overallRemark' => $detail->overall_remark ?? '',
            'documents' => $detail->documents ?? [],
        ];

        return Inertia::render('TaskDetails', [
            'task' => $taskData,
        ]);
    }

    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $detail = $task->detail ?? new TaskDetail();
        $detail->task_id = $task->id;

        $validated = $request->validate([
            'status' => 'required|in:Pending,In Progress,On Hold,Finished',
            'devRemark' => 'nullable|string|max:1000',
            'clientRemark' => 'nullable|string|max:1000',
            'overallRemark' => 'nullable|string|max:1000',
            'managerRemarks' => 'nullable|array|max:3',
            'testingPoints' => 'nullable|array',
            'documents' => 'nullable|array',
        ]);

        $task->update([
            'status' => $validated['status'],
        ]);

        $detail->updateOrCreate(
            ['task_id' => $id],
            [
                'dev_remark' => $validated['devRemark'] ?? $detail->dev_remark,
                'client_remark' => $validated['clientRemark'] ?? $detail->client_remark,
                'overall_remark' => $validated['overallRemark'],
                'manager_remarks' => $validated['managerRemarks'],
                'testing_points' => $validated['testingPoints'],
                'documents' => $validated['documents'],
            ]
        );

        $request->session()->flash('success', 'Task details updated successfully!');

        return $this->show($id);
    }

    public function storeEmployee(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'subCategory' => 'nullable|string|max:255',
            'manager' => 'required|string|max:255',
        ]);

        \App\Models\Employee::create([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'sub_category' => $validated['subCategory'] ?? null,
            'manager' => $validated['manager'],
        ]);

        $request->session()->flash('success', 'Employee added successfully!');

        return Inertia::render('Manager', $this->getDashboardData());
    }

    public function storeClient(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:clients,name',
        ]);

        \App\Models\Client::create([
            'name' => $validated['name'],
        ]);

        $request->session()->flash('success', 'Client added successfully!');

        return Inertia::render('Manager', $this->getDashboardData());
    }

    public function storeTask(Request $request)
    {
        $validated = $request->validate([
            'task' => 'required|string|max:255',
            'employee_id' => 'required|exists:employees,id',
            'client' => 'required|string|max:255',
            'due' => 'nullable|date',
            'expected_timeline' => 'nullable|date',
        ]);

        $client = \App\Models\Client::firstOrCreate(
            ['name' => $validated['client']],
            ['name' => $validated['client']]
        );

        \App\Models\Task::create([
            'task' => $validated['task'],
            'employee_id' => $validated['employee_id'],
            'client_id' => $client->id,
            'status' => 'Pending',
            'due' => $validated['due'],
            'expected_timeline' => $validated['expected_timeline'],
        ]);

        $request->session()->flash('success', 'Task added successfully!');

        return Inertia::render('Manager', $this->getDashboardData());
    }
}