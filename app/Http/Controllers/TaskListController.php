<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TaskList;
use App\Models\User;
use Illuminate\Container\Attributes\Auth as AttributesAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class TaskListController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasklists = TaskList::where('user_id', Auth::id())
            ->withCount(['tasks' => function ($query) {
                $query->where('completed', false); // conta apenas tarefas pendentes
            }])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('TaskLists/Index', [
            'taskLists' => $tasklists,
            'totalTasks' => Auth::user()->tasks()->count(),
            'pendingTasks' => Auth::user()->tasks()->where('completed', false)->count(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $colors = [
            '#3b82f6', // blue
            '#ef4444', // red
            '#10b981', // green
            '#f59e0b', // yellow
            '#8b5cf6', // purple
            '#ec4899', // pink
            '#6366f1', // indigo
        ];

        return Inertia::render('TaskLists/Form', [
            'colors' => $colors,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'color' => 'nullable|string',
        ]);

        $tasklist = Auth::user()->taskLists()->create($validated);
        //$tasklist = TaskList::create($validated);

        return redirect()->route('tasklists.index')->with('success', 'Lista criada com sucesso!');
    }

    /**
     * Display the specified resource.
     */
    public function show(TaskList $tasklist)
    {
        $this->authorize('view', $tasklist);

        $tasklist->load(['tasks' => function ($query) {
            $query->orderBy('completed')
                ->orderBy('due_date', 'asc')
                ->orderBy('created_at', 'desc');
        }]);

        return Inertia::render(
            'TaskLists/Show',
            [
                'tasklist' => $tasklist,
                'tasks' => $tasklist->tasks,
                'stats' => [
                    'total' => $tasklist->tasks->count(),
                    'completed' => $tasklist->tasks->where('completed', true)->count(),
                    'pending' => $tasklist->tasks->where('completed', false)->count(),
                ],
            ]
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TaskList $tasklist)
    {
        $this->authorize('update', $tasklist);

        $colors = [
            '#3b82f6',
            '#ef4444',
            '#10b981',
            '#f59e0b',
            '#8b5cf6',
            '#ec4899',
            '#6366f1',
        ];

        return Inertia::render('TaskLists/Index', [
            'tasklist' => $tasklist,
            'colors' => $colors,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TaskList $tasklist)
    {
        $this->authorize('update', $tasklist);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:255',
            'color' => 'nullable|string'
        ]);

        $tasklist->update($validated);
        return redirect()->route('tasklists.index')->with('success', 'Lista atualizada com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TaskList $tasklist)
    {
        $this->authorize('delete', $tasklist);

        $tasklist->delete();

        return redirect()->route('tasklists.index')->with('success', 'Lista deletada com sucesso!');
    }
}
