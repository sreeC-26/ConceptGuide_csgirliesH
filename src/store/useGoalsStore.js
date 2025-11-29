import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import {
  createGoal as saveGoalToFirebase,
  fetchUserGoals,
  updateGoal as updateGoalInFirebase,
  deleteGoal as deleteGoalFromFirebase,
  calculateGoalProgress,
  shouldShowReminder,
  getReminderMessage,
  GOAL_TYPES,
  GOAL_PERIODS,
} from '../services/goalsService';

export { GOAL_TYPES, GOAL_PERIODS };

export const useGoalsStore = create((set, get) => ({
  goals: [],
  activeReminders: [],
  isLoading: false,
  error: null,

  // Fetch all goals from Firebase
  fetchGoals: async (forceRefresh = false) => {
    const userId = useAuthStore.getState().user?.uid;
    if (!userId) {
      console.log('[GoalsStore] No user, clearing goals');
      set({ goals: [], isLoading: false });
      return [];
    }

    // If we have goals and not forcing refresh, skip fetch
    const currentGoals = get().goals;
    if (currentGoals.length > 0 && !forceRefresh) {
      console.log('[GoalsStore] Goals already loaded, skipping fetch. Count:', currentGoals.length);
      return currentGoals;
    }

    set({ isLoading: true, error: null });

    try {
      console.log('[GoalsStore] Fetching goals from Firebase for user:', userId);
      const goals = await fetchUserGoals(userId);
      console.log('[GoalsStore] Fetched goals from Firebase:', goals.length);
      
      if (goals.length > 0) {
        console.log('[GoalsStore] First goal:', goals[0].name);
      }
      
      set({ goals, isLoading: false });
      return goals;
    } catch (error) {
      console.error('[GoalsStore] Failed to fetch goals:', error);
      set({ error: error.message, isLoading: false });
      return [];
    }
  },

  // Create a new goal - Save to Firebase FIRST, then update local state
  addGoal: async (goalData) => {
    const userId = useAuthStore.getState().user?.uid;
    
    const goalId = `goal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const newGoal = {
      id: goalId,
      name: goalData.name || 'Study Goal',
      type: goalData.type || GOAL_TYPES.SESSIONS,
      target: goalData.target || 5,
      period: goalData.period || GOAL_PERIODS.WEEKLY,
      startDate: goalData.startDate || new Date().toISOString(),
      isActive: true,
      reminderEnabled: goalData.reminderEnabled !== false,
      reminderTime: goalData.reminderTime || '09:00',
      createdAt: new Date().toISOString(),
    };

    console.log('[GoalsStore] Creating goal:', newGoal);

    // Save to Firebase FIRST if user is logged in
    if (userId) {
      try {
        await saveGoalToFirebase(userId, newGoal);
        console.log('[GoalsStore] Goal saved to Firebase successfully:', goalId);
      } catch (error) {
        console.error('[GoalsStore] Failed to save goal to Firebase:', error);
        // Still add to local state so user sees it
      }
    } else {
      console.log('[GoalsStore] No user logged in, goal will be local only');
    }

    // Then update local state
    set((state) => {
      console.log('[GoalsStore] Adding goal to local state. Current count:', state.goals.length);
      const updatedGoals = [newGoal, ...state.goals];
      console.log('[GoalsStore] New count:', updatedGoals.length);
      return { goals: updatedGoals };
    });

    return newGoal;
  },

  // Update an existing goal
  updateGoal: async (goalId, updates) => {
    const userId = useAuthStore.getState().user?.uid;

    // Update local state first
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === goalId ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
      ),
    }));
    console.log('[GoalsStore] Goal updated locally:', goalId);

    // Then sync to Firebase
    if (userId) {
      try {
        await updateGoalInFirebase(userId, goalId, updates);
        console.log('[GoalsStore] Goal synced to Firebase:', goalId);
      } catch (error) {
        console.error('[GoalsStore] Failed to sync goal to Firebase:', error);
      }
    }
  },

  // Delete a goal
  removeGoal: async (goalId) => {
    const userId = useAuthStore.getState().user?.uid;

    // Remove from local state first
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== goalId),
    }));
    console.log('[GoalsStore] Goal removed locally:', goalId);

    // Then delete from Firebase
    if (userId) {
      try {
        await deleteGoalFromFirebase(userId, goalId);
        console.log('[GoalsStore] Goal deleted from Firebase:', goalId);
      } catch (error) {
        console.error('[GoalsStore] Failed to delete goal from Firebase:', error);
      }
    }
  },

  // Toggle goal active status
  toggleGoalActive: async (goalId) => {
    const goal = get().goals.find((g) => g.id === goalId);
    if (goal) {
      await get().updateGoal(goalId, { isActive: !goal.isActive });
    }
  },

  // Get progress for all active goals (helper - but prefer computing in component)
  getGoalsWithProgress: (sessions) => {
    const { goals } = get();
    return goals.map((goal) => ({
      ...goal,
      progress: calculateGoalProgress(goal, sessions),
    }));
  },

  // Check and update reminders
  checkReminders: (sessions) => {
    const { goals } = get();
    const reminders = [];

    goals.forEach((goal) => {
      if (!goal.isActive || !goal.reminderEnabled) return;

      const progress = calculateGoalProgress(goal, sessions);
      
      if (shouldShowReminder(goal, progress)) {
        const reminder = getReminderMessage(goal, progress);
        if (reminder) {
          reminders.push({
            goalId: goal.id,
            goalName: goal.name,
            ...reminder,
            progress,
          });
        }
      }
    });

    set({ activeReminders: reminders });
    return reminders;
  },

  // Dismiss a reminder
  dismissReminder: (goalId) => {
    set((state) => ({
      activeReminders: state.activeReminders.filter((r) => r.goalId !== goalId),
    }));
  },

  // Clear all reminders
  clearReminders: () => {
    set({ activeReminders: [] });
  },

  // Reset store
  reset: () => {
    set({
      goals: [],
      activeReminders: [],
      isLoading: false,
      error: null,
    });
  },
}));
