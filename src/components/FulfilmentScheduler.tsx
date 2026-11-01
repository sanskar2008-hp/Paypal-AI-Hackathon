import React from 'react';
import { FulfilmentTask } from '../types';
import { Calendar, CheckCircle2, Clock, Plus, User, AlertCircle, Check, X } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#101321] p-5 rounded-2xl border border-white/10 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
              Fulfilment Task Scheduler
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-[#8757FF]/15 text-[#43D9FF] text-[11px] font-semibold border border-[#8757FF]/25 font-mono">
              Bryntum Task Engine
            </span>
          </div>
          <p className="text-xs text-[#9299B2] mt-0.5">
            Coordinate warehouse picking, quality checks, carrier dispatch, and logistics milestones.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#8757FF] hover:bg-[#7644FF] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#8757FF]/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Task</span>
        </button>
      </div>

      {/* Task Grid by Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => {
          const isDone = task.status === 'completed';

          return (
            <div
              key={task.id}
              className={`p-5 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-[#101321]/60 border-white/5 opacity-65'
                  : 'bg-[#151A2B] border-white/10 hover:border-[#8757FF]/40 shadow-xl'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <span className="font-mono text-[11px] bg-[#101321] text-[#43D9FF] px-2.5 py-0.5 rounded border border-white/10">
                  {task.orderId}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                    task.priority === 'high'
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      : task.priority === 'medium'
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'bg-[#8757FF]/15 text-[#8757FF] border border-[#8757FF]/30'
                  }`}
                >
                  {task.priority}
                </span>
              </div>

              <h4 className={`text-sm font-bold font-['Space_Grotesk'] text-white ${isDone ? 'line-through text-[#9299B2]' : ''}`}>
                {task.title}
              </h4>

              <p className="text-xs text-[#9299B2] mt-1.5 leading-relaxed line-clamp-2">
                {task.description}
              </p>

              <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-1.5 text-xs text-[#9299B2]">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#8757FF]" />
                  <span className="truncate">{task.assignedTo}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#43D9FF]" />
                  <span className="font-mono text-[11px]">Due {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() =>
                    onUpdateTaskStatus(task.id, isDone ? 'pending' : 'completed')
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isDone
                      ? 'bg-[#38D99A]/15 text-[#38D99A] border border-[#38D99A]/20'
                      : 'bg-[#1C2236] text-white hover:bg-[#8757FF] border border-white/10'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                </button>

                <span className="text-[11px] text-[#9299B2] capitalize font-mono">
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#080A12]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#101321] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-white/10 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                Schedule Fulfilment Task
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#9299B2] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#9299B2] mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g. Inspect AeroBook Pro packaging"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#151A2B] text-white placeholder-[#9299B2] focus:outline-hidden focus:border-[#8757FF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#9299B2] mb-1">Related Order Ref</label>
                <input
                  type="text"
                  value={newTask.orderId}
                  onChange={(e) => setNewTask({ ...newTask, orderId: e.target.value })}
                  placeholder="ORD-9842"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#151A2B] text-white placeholder-[#9299B2] focus:outline-hidden focus:border-[#8757FF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#9299B2] mb-1">Assigned Specialist</label>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#151A2B] text-white focus:outline-hidden focus:border-[#8757FF]"
                >
                  <option value="Jordan Lee (Warehouse)">Jordan Lee (Warehouse Lead)</option>
                  <option value="Sarah Jenkins (Logistics)">Sarah Jenkins (Logistics & Customs)</option>
                  <option value="Alex Chen (Support)">Alex Chen (Customer Success)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#9299B2] mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#151A2B] text-white focus:outline-hidden focus:border-[#8757FF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#9299B2] mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#151A2B] text-white focus:outline-hidden focus:border-[#8757FF]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#9299B2] mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Provide warehouse or dispatch instructions..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#151A2B] text-white placeholder-[#9299B2] focus:outline-hidden focus:border-[#8757FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-[#9299B2] hover:text-white rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#8757FF] hover:bg-[#7644FF] text-white rounded-xl font-bold shadow-lg shadow-[#8757FF]/25 cursor-pointer"
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
