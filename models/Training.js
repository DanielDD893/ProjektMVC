const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    intensity: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    }
}, {
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    toObject: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = ret._id.toString();
            return ret;
        }
    }
});

const Training = mongoose.model('Training', trainingSchema);

module.exports = {
    getAll: async function() {
        try {
            return await Training.find().sort({ date: -1 });
        } catch (error) {
            console.error('Błąd przy pobieraniu treningów:', error);
            return [];
        }
    },
    
    getById: async function(id) {
        try {
            return await Training.findById(id);
        } catch (error) {
            console.error('Błąd przy pobieraniu treningu po ID:', error);
            return null;
        }
    },
    
    create: async function(trainingData) {
        try {
            const newTraining = new Training({
                name: trainingData.name,
                type: trainingData.type,
                intensity: parseInt(trainingData.intensity),
                duration: parseInt(trainingData.duration),
                date: trainingData.date,
                description: trainingData.description || ''
            });
            
            return await newTraining.save();
        } catch (error) {
            console.error('Błąd przy tworzeniu treningu:', error);
            throw error;
        }
    },
    
    update: async function(id, updateData) {
        try {
            const updatedTraining = await Training.findByIdAndUpdate(
                id,
                {
                    name: updateData.name,
                    type: updateData.type,
                    intensity: parseInt(updateData.intensity),
                    duration: parseInt(updateData.duration),
                    date: updateData.date,
                    description: updateData.description || '',
                    updatedAt: new Date()
                },
                { new: true }
            );
            
            return updatedTraining;
        } catch (error) {
            console.error('Błąd przy aktualizacji treningu:', error);
            return null;
        }
    },
    
    delete: async function(id) {
        try {
            const result = await Training.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            console.error('Błąd przy usuwaniu treningu:', error);
            return false;
        }
    },
    
    getStats: async function() {
        try {
            const trainings = await this.getAll();
            const now = new Date();
            const thisMonth = trainings.filter(t => {
                const trainingDate = new Date(t.date);
                return trainingDate.getMonth() === now.getMonth() && 
                       trainingDate.getFullYear() === now.getFullYear();
            });
    
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const thisWeek = trainings.filter(t => {
                const trainingDate = new Date(t.date);
                return trainingDate >= weekAgo;
            });
    
            const totalDuration = trainings.reduce((sum, t) => sum + t.duration, 0);
            const avgIntensity = trainings.length > 0 
                ? (trainings.reduce((sum, t) => sum + t.intensity, 0) / trainings.length).toFixed(1)
                : 0;
    
            return {
                total: trainings.length,
                thisMonth: thisMonth.length,
                thisWeek: thisWeek.length,
                totalDuration,
                avgIntensity,
                totalHours: Math.floor(totalDuration / 60),
                totalMinutes: totalDuration % 60
            };
        } catch (error) {
            console.error('Błąd przy obliczaniu statystyk:', error);
            return {
                total: 0,
                thisMonth: 0,
                thisWeek: 0,
                totalDuration: 0,
                avgIntensity: 0,
                totalHours: 0,
                totalMinutes: 0
            };
        }
    }
}; 