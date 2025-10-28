<?php

// app/Http/Controllers/ManagerController.php (updated show method to include testingPoints)

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Task;
use App\Models\Employee;
use App\Models\Client;
use App\Models\TaskDetail;
use App\Models\TestingPoint;

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
            'detail',
            'testingPoints' // Add the testingPoints relationship
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
                'testingPoints' => $task->testingPoints->map(function ($point) {
            return [
                'id' => $point->id,
                'description' => $point->description,
                'passed' => $point->passed,
                'remark' => $point->remark,
                'testerName' => $point->tester_name,
                'addedDate' => $point->added_date->format('Y-m-d'),
                'managerRemark' => $point->manager_remark ?? '',
            ];
        })->toArray(),
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
            'detail',
            'testingPoints'
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
            'testingPoints' => $task->testingPoints->map(function ($point) {
                return [
                    'id' => $point->id,
                    'number' => $point->id, // Use id as number for simplicity, or add a number field if needed
                    'description' => $point->description,
                    'passed' => $point->passed,
                    'remark' => $point->remark,
                    'testerName' => $point->tester_name,
                    'addedDate' => $point->added_date->format('Y-m-d'),
                    'managerRemark' => $point->manager_remark ?? '',
                ];
            }),
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
                'documents' => $validated['documents'],
            ]
        );

        // Update manager remarks for testing points if provided
        if ($request->has('testingPoints')) {
            foreach ($validated['testingPoints'] ?? [] as $point) {
                if (isset($point['managerRemark'])) {
                    TestingPoint::where('id', $point['id'])->update([
                        'manager_remark' => $point['managerRemark'],
                    ]);
                }
            }
        }

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

        return redirect()->route('manager.index')->with('success', 'Employee added successfully!');
    }

    public function storeClient(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:clients,name',
        ]);

        \App\Models\Client::create([
            'name' => $validated['name'],
        ]);

        return redirect()->route('manager.index')->with('success', 'Client added successfully!');
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

        return redirect()->route('manager.index')->with('success', 'Task added successfully!');
    }

    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->detail()->delete();
        $task->testingPoints()->delete(); // Delete related testing points
        $task->delete();

        request()->session()->flash('success', 'Task deleted successfully!');

        return redirect()->route('manager.index');
    }
}