/**
 * A class to manage all exercise-related data operations.
 * This centralizes the logic for adding, retrieving, and deleting exercises.
 */
class ExerciseTracker {
    constructor(authService) {
        this.auth = authService;
    }

    /**
     * Adds an exercise entry for the current user.
     * @param {object} exerciseData - The data for the exercise entry.
     */
    addExercise(exerciseData) {
        const user = this.auth.getCurrentUser();
        if (!user) return;

        const newEntry = {
            id: `ex-${Date.now()}`,
            ...exerciseData
        };
        user.data.exercise.push(newEntry);
        this.auth.updateUser(user);
    }

    /**
     * Retrieves all exercise entries for the current user on a specific date.
     * @param {string} dateString - The date in 'YYYY-MM-DD' format.
     * @returns {Array} - An array of exercise entries for that date.
     */
    getExercisesForDate(dateString) {
        const user = this.auth.getCurrentUser();
        if (!user) return [];
        return user.data.exercise.filter(ex => ex.date === dateString);
    }

    /**
     * Deletes an exercise entry by its unique ID.
     * @param {string} entryId - The ID of the exercise entry to delete.
     */
    deleteExercise(entryId) {
        const user = this.auth.getCurrentUser();
        if (!user) return;

        user.data.exercise = user.data.exercise.filter(ex => ex.id !== entryId);
        this.auth.updateUser(user);
    }
    
    /**
     * Calculates the estimated calories burned for an exercise.
     * @param {object} exercise - The exercise object from the database.
     * @param {number} duration - The duration of the exercise in minutes.
     * @param {string} intensity - The intensity ('light', 'moderate', 'vigorous').
     * @returns {number} - The estimated calories burned.
     */
    calculateCaloriesBurned(exercise, duration, intensity) {
        let multiplier = 1.0;
        switch (intensity) {
            case 'light': multiplier = 0.75; break;
            case 'moderate': multiplier = 1.0; break;
            case 'vigorous': multiplier = 1.25; break;
        }
        return Math.round(exercise.calsPerMinute * duration * multiplier);
    }
}

const exerciseTracker = new ExerciseTracker(auth);