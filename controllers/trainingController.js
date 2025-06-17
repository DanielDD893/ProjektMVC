const Training = require('../models/Training');

const trainingController = {
    index: async (req, res) => {
        try {
            const trainings = await Training.getAll();
            const stats = await Training.getStats();
            
            res.render('trainings/index', {
                title: 'Dashboard Treningów',
                trainings,
                stats,
                message: req.query.message || null
            });
        } catch (error) {
            console.error('Błąd w index:', error);
            res.status(500).render('error', {
                title: 'Błąd serwera',
                message: 'Wystąpił błąd podczas ładowania treningów',
                error
            });
        }
    },

    show: async (req, res) => {
        try {
            const training = await Training.getById(req.params.id);
            
            if (!training) {
                return res.status(404).render('error', {
                    title: 'Trening nie znaleziony',
                    message: 'Trening o podanym ID nie istnieje',
                    error: { status: 404 }
                });
            }

            res.render('trainings/show', {
                title: `Trening: ${training.name}`,
                training
            });
        } catch (error) {
            console.error('Błąd w show:', error);
            res.status(500).render('error', {
                title: 'Błąd serwera',
                message: 'Nie można załadować szczegółów treningu',
                error
            });
        }
    },

    new: (req, res) => {
        res.render('trainings/new', {
            title: 'Dodaj nowy trening',
            training: {
                name: '',
                type: '',
                intensity: 5,
                duration: 30,
                date: new Date().toISOString().split('T')[0],
                description: ''
            }
        });
    },

    create: async (req, res) => {
        console.log('🚀 [DEBUG] create() została wywołana!');
        console.log('📦 [DEBUG] req.body:', req.body);
        console.log('🌐 [DEBUG] req.method:', req.method);
        
        try {
            const { name, type, intensity, duration, date, description } = req.body;
            
            console.log('📝 [DEBUG] Extracted data:', { name, type, intensity, duration, date, description });
            
            if (!name || !type || !intensity || !duration || !date) {
                console.log('❌ [DEBUG] Validation failed - missing fields');
                return res.status(400).render('trainings/new', {
                    title: 'Dodaj nowy trening',
                    training: req.body,
                    error: 'Wszystkie pola oprócz opisu są wymagane'
                });
            }

            if (intensity < 1 || intensity > 10) {
                console.log('❌ [DEBUG] Validation failed - intensity out of range');
                return res.status(400).render('trainings/new', {
                    title: 'Dodaj nowy trening',
                    training: req.body,
                    error: 'Intensywność musi być w zakresie 1-10'
                });
            }

            console.log('✅ [DEBUG] Validation passed, creating training...');
            const newTraining = await Training.create({
                name,
                type,
                intensity,
                duration,
                date,
                description
            });

            console.log('🎉 [DEBUG] Training created:', newTraining);
            res.redirect('/trainings?message=Trening został pomyślnie dodany');
        } catch (error) {
            console.error('💥 [DEBUG] Error in create:', error);
            res.status(500).render('trainings/new', {
                title: 'Dodaj nowy trening',
                training: req.body,
                error: 'Wystąpił błąd podczas dodawania treningu'
            });
        }
    },

    edit: async (req, res) => {
        try {
            const training = await Training.getById(req.params.id);
            
            if (training) {
                // Format date for HTML date input (YYYY-MM-DD)
                const date = new Date(training.date);
                training.date = date.toISOString().split('T')[0];
            }
            
            if (!training) {
                return res.status(404).render('error', {
                    title: 'Trening nie znaleziony',
                    message: 'Trening o podanym ID nie istnieje',
                    error: { status: 404 }
                });
            }

            res.render('trainings/edit', {
                title: `Edytuj trening: ${training.name}`,
                training
            });
        } catch (error) {
            console.error('Błąd w edit:', error);
            res.status(500).render('error', {
                title: 'Błąd serwera',
                message: 'Nie można załadować formularza edycji',
                error
            });
        }
    },

    update: async (req, res) => {
        try {
            const { name, type, intensity, duration, date, description } = req.body;
            
            if (!name || !type || !intensity || !duration || !date) {
                const training = await Training.getById(req.params.id);
                return res.status(400).render('trainings/edit', {
                    title: `Edytuj trening: ${training ? training.name : 'Nieznany'}`,
                    training: { ...req.body, id: req.params.id },
                    error: 'Wszystkie pola oprócz opisu są wymagane'
                });
            }

            if (intensity < 1 || intensity > 10) {
                const training = await Training.getById(req.params.id);
                return res.status(400).render('trainings/edit', {
                    title: `Edytuj trening: ${training ? training.name : 'Nieznany'}`,
                    training: { ...req.body, id: req.params.id },
                    error: 'Intensywność musi być w zakresie 1-10'
                });
            }

            const updatedTraining = await Training.update(req.params.id, {
                name,
                type,
                intensity,
                duration,
                date,
                description
            });

            if (!updatedTraining) {
                return res.status(404).render('error', {
                    title: 'Trening nie znaleziony',
                    message: 'Nie można zaktualizować nieistniejącego treningu',
                    error: { status: 404 }
                });
            }

            res.redirect('/trainings?message=Trening został pomyślnie zaktualizowany');
        } catch (error) {
            console.error('Błąd w update:', error);
            res.status(500).render('error', {
                title: 'Błąd serwera',
                message: 'Wystąpił błąd podczas aktualizacji treningu',
                error
            });
        }
    },

    destroy: async (req, res) => {
        try {
            const success = await Training.delete(req.params.id);
            
            if (!success) {
                return res.status(404).render('error', {
                    title: 'Trening nie znaleziony',
                    message: 'Nie można usunąć nieistniejącego treningu',
                    error: { status: 404 }
                });
            }

            res.redirect('/trainings?message=Trening został pomyślnie usunięty');
        } catch (error) {
            console.error('Błąd w destroy:', error);
            res.status(500).render('error', {
                title: 'Błąd serwera',
                message: 'Wystąpił błąd podczas usuwania treningu',
                error
            });
        }
    }
};

module.exports = trainingController; 