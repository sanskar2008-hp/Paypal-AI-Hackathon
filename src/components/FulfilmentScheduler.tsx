import React from 'react';
import { FulfilmentTask } from '../types';
import { Calendar, CheckCircle2, Clock, Plus, User, AlertCircle, Check } from 'lucide-react';

interface FulfilmentSchedulerProps {
  tasks: FulfilmentTask[];
  onAddTask: (task: Omit<FulfilmentTask, 'id'>) => void;
  onUpdateTaskStatus: (taskId: string, status: FulfilmentTask['status']) => void;
}

export const FulfilmentScheduler: React.FC<FulfilmentSchedulerProps> = ({
  tasks,
  onAddTask,
  onUpdateTaskStatus,
}) => {
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [newTask, setNewTask] = React.useState({
    orderId: 'ORD-9842',
    title: '',
    description: '',
    assignedTo: 'Jordan Lee (Warehouse)',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium' as FulfilmentTask['priority'],
    status: 'pending' as FulfilmentTask['status'],
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    onAddTask(newTask);
    setShowAddModal(false);
    setNewTask({
      orderId: 'GENERAL',
      title: '',
      description: '',
      assignedTo: 'Jordan Lee (Warehouse)',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'medium',
      status: 'pending',
    });
  };

  return (
    <div className="space-y-6">
      {/* Scheduler Header & Bryntum Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Fulfilment Task Scheduler
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-200">
              Bryntum Task Model
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate warehouse picking, packaging checks, carrier dispatch, and logistics milestones.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Schedule Task
        </button>
      </div>

      {/* Task List by Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => {
          const isDone = task.status === 'completed';

          return (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-slate-50 border-slate-200 opacity-75'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {task.orderId}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    task.priority === 'high'
                      ? 'bg-rose-100 text-rose-700'
                      : task.priority === 'medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {task.priority}
                </span>
              </div>

              <h4 className={`text-sm font-bold text-slate-900 ${isDone ? 'line-through text-slate-400' : ''}`}>
                {task.title}
              </h4>

              <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                {task.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{task.assignedTo}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 flex items-center justify-between">
                <button
                  onClick={() =>
                    onUpdateTaskStatus(task.id, isDone ? 'pending' : 'completed')
                  }
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  {isDone ? 'Completed' : 'Mark Done'}
                </button>

                <span className="text-[11px] text-slate-400 capitalize">
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Schedule Fulfilment Task
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g. Inspect AeroBook Pro packaging"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Related Order ID</label>
                <input
                  type="text"
                  value={newTask.orderId}
                  onChange={(e) => setNewTask({ ...newTask, orderId: e.target.value })}
                  placeholder="ORD-9842"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Assigned Specialist</label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                >
                  <option value="Jordan Lee (Warehouse)">Jordan Lee (Warehouse Lead)</option>
                  <option value="Sarah Jenkins (Logistics)">Sarah Jenkins (Logistics & Customs)</option>
                  <option value="Alex Chen (Support)">Alex Chen (Customer Success)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Provide warehouse or dispatch instructions..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
